
document.addEventListener('DOMContentLoaded', () => {
    const app = fin.Application.getCurrentSync();
    fin.System.launchExternalProcess({
        alias: 'find-offenders',
        arguments: '800', //
        listener: (code) => { if (code === 1) { app.restart() } },
        target: 'FindOffenders.exe'
    })
    .then((data) => console.log('successfully launched FinderOffenders.exe: ', data))
    .catch(console.error)

});
