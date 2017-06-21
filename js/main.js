const clock = document.querySelector(".pomodoro");
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

        return [minutes, seconds].map(e => (e.toString().length === 2 ? e : '0' + e)).join(':');
    }
}

document.querySelectorAll('.btn-danger').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        if(input.value > 1) input.value = parseInt(input.value) - 1;
    });
});

document.querySelectorAll('.btn-success').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        input.value = parseInt(input.value) + 1;
    });
});

document.querySelector(".trigg").addEventListener('click', function () {
    clearInterval(threadID);
    let timer = new Timer(parseInt(document.querySelector('input').value) * 60000,
        () => clock.innerHTML = timer.getCurrentState());
    timer.start(() => window.alert("Done!"));
});
