const clock = document.querySelector(".pomodoro");
const input = document.querySelector("input");
const wrap = (str) => (str.length == 2 ? str : '0' + str);
let threadID;

class Timer {
    constructor(time, event) {
        this.time = time;
        this.event = event;
    }

    start(action) {
        this.now = new Date();
        this.endDate = new Date(this.now.getTime() + this.time);


        threadID = setInterval(() => {
            this.event();
            this.now = new Date();
            if (this.now > this.endDate) {
                action();
                clearInterval(threadID);
            }
        }, 1000);
    }

    getCurrentState() {
        let state = new Date(this.endDate - this.now);

        let minutes = state.getMinutes();
        let seconds = state.getSeconds();

        return [minutes, seconds].map(e => (e.length == 2 ? e : '0' + e)).join(':');
    }
}

document.querySelector('.btn-danger').addEventListener('click', () => {
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
});

document.querySelector('.btn-success').addEventListener('click', () => {
    input.value = parseInt(input.value) + 1;
});

document.querySelector(".trigg").addEventListener('click', function () {
    clearInterval(threadID);
    let timer = new Timer(parseInt(input.value) * 60000,
        () => clock.innerHTML = timer.getCurrentState());
    timer.start(() => window.alert("Done!"));
});
