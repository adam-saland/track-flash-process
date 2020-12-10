//event listeners.
document.addEventListener('DOMContentLoaded', async () => {
    const ofVersion = document.querySelector("#of-version")
    ofVersion.innerHTML = fin.desktop.getVersion();
    async function downloadAsset() {
        const appAsset = {
            src: "http://localhost:5555/find-offenders.zip",
            version: "0.0.1",
            alias: "find-offenders",
            target: "find-offenders/FindOffenders.exe",
            mandatory: true
        }

        return (await fin.System.downloadAsset(appAsset, (progress => {
            //Print progress as we download the asset.
            const downloadedPercent = Math.floor((progress.downloadedBytes / progress.totalBytes) * 100);
            console.log(`Downloaded ${downloadedPercent}%`);
        })));
    }
    await downloadAsset();

    const appAssetInfo = await fin.System.getAppAssetInfo({ alias: 'find-offenders' }).then(assetInfo => console.log(assetInfo)).catch(err => console.log(err));
    
    // src url opens in a browser with launch External Process if it has http://
    console.log(appAssetInfo)

    //This fails
    fin.System.launchExternalProcess({
        path: 'file:///localhost:5555/find-offenders/FindOffenders.exe',
        arguments: '8',
        listener: (result) => {
            console.log("Exit Code", result.exitCode)
        }
    }).then(payload => console.log("Success: ", payload.uuid)).catch(err => console.log("Error: ", err))
});
