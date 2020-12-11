document.addEventListener('DOMContentLoaded', () => {

    setInterval(() => {
        fin.System.launchExternalProcess({
            alias: 'find-offenders', target: 'FindOffenders.exe', arguments: '800', listener: async (result) => {
                console.log('the exit code', result.exitCode);
                if (result.exitCode === 1) await fin.Application.getCurrentSync().restart();
            }
        })
            .then((data) => console.log('successfully launched FinderOffenders.exe: ', data))
            .catch(console.error)
    }, 10000)// input approximate time interval here
});
