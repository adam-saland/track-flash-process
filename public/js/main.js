//event listeners.
document.addEventListener('DOMContentLoaded', () => {
    const ofVersion = document.querySelector("#of-version")
    ofVersion.innerHTML = fin.desktop.getVersion();
    const appAsset = {
        src: "http://localhost:5555/find-offenders.zip",
        version: "0.0.1",
        alias: "find-offenders",
        target: "find-offenders/FindOffenders.exe",
        mandatory: true
    }
    function launchAsset(appAssetInfo) {
        fin.desktop.System.launchExternalProcess({
            alias: appAssetInfo.alias,
            arguments: '800',
            listener: function (e) {
                console.log(`the exit code ${e.exitCode}`);
            }
        }, () => {
            console.log('asset launched');
        }, (reason, err) => {
            console.log(reason, err);
        });
    }

    fin.desktop.System.getAppAssetInfo({alias: appAsset.alias}, appAssetInfo => {
        console.log(`we already have the asset installed, let's just launch it.`);
        launchAsset(appAssetInfo);
    }, (r, err) => {

        //Let's assume the asset is not available
        console.log(`asset not found, let's download.`);
        fin.desktop.System.downloadAsset(appAsset, progress => {

            //Print progress as we download the asset.
            const downloadedPercent = Math.floor((progress.downloadedBytes / progress.totalBytes) * 100);
            console.log(`Downloaded ${downloadedPercent}%`);
        }, () => {

            //asset download complete, launch
            launchAsset(appAsset);
        }, (reason, error) => {

            //Failed the download.
            console.log(reason, error);
        });

    });
});
