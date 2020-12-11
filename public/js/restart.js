//Use either of the below options in the preload script of your application
// that will allow you to restart the application at a setTimeout
​
//Option 1
​
const app = fin.Application.getCurrentSync();
function restartMe() {
    var conf = confirm("Restart Application?")
    if (conf) {
       app.restart()
    } else { setTimeout(() => { restartMe() }, 600000); }
};
restartMe();
​
// Keeps prompting to restart every 10 minutes till you hit "OK".
​
​
​
//Option 2
​
const app = fin.Application.getCurrentSync();
function restartMe() {
    var conf = confirm("Restart Application?")
    if (conf) {
       app.restart()
    }
};
setTimeout(() => { restartMe()
