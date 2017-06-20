const clock = document.querySelector(".pomodoro");
const wrap = (str) => (str.length == 2 ? str : '0' + str);
let thread;


document.querySelector(".trigg").addEventListener('click', function (e) {
    let future = new Date();
    future.setTime(future.getTime() + 60000);
    new Node

    thread = window.setInterval(function(){ clock.innerHTML = timer(future, window.alert) }, 1000);
})

function timer(future, dzyn) {
    let diff = new Date(future - new Date());

    if (dzyn && diff.getTime() <= 0) {
        dzyn("Time expired!");
        clearInterval(thread);
        tick.sayIt();
        return "00:00";
    }

    let minutes = diff.getMinutes();
    let seconds = diff.getSeconds();

    return [minutes, seconds].map(e => wrap(e.toString())).join(':');
}
