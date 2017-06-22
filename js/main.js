class Timer {
    constructor(tick) {
        this.tick = tick;
        this.state = states.inactive;
        this.threadID = null;
    }

    start(time, action) {
        if(this.state === states.inactive) this.time = time;
        this.now = new Date();
        this.endDate = new Date(this.now.getTime() + this.time);
        this.state = states.active;

        this.threadID = setInterval(() => {
            this.tick();
            this.now = new Date();
            if (this.now > this.endDate) {
                action();
                clearInterval(this.threadID);
                this.state = states.inactive;
            }
        }, 1000);
    }

    getCurrentState() {
        if(this.state === states.inactive) {
            return '00:00';
        }
        if(this.state === states.pause) {
            let state = new Date(this.time);
            let minutes = state.getMinutes();
            let seconds = state.getSeconds();

            return [minutes, seconds].map(e => (e.toString().length === 2 ? e : '0' + e)).join(':');
        }

        let state = new Date(this.endDate - this.now);
        let minutes = state.getMinutes();
        let seconds = state.getSeconds();

        return [minutes, seconds].map(e => (e.toString().length === 2 ? e : '0' + e)).join(':');
    }

    getState() { return this.state; }

    pause() {
        this.state = states.pause;
        clearInterval(this.threadID);
        this.time = this.endDate.getTime() - this.now.getTime();
    }
}

const states = {
    inactive : 0,
    active : 1,
    pause : 2
};
const clock = document.querySelector(".pomodoro");
timer = new Timer(() => clock.innerText = timer.getCurrentState());

document.querySelectorAll('.btn-danger').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        if(input.value > 1) input.value--;
    });
});

document.querySelectorAll('.btn-success').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        input.value++;
    });
});

document.querySelector(".trigg").addEventListener('click', function () {
    if(timer.getState() === states.active) {
        timer.pause();
    }
    else {
        document.querySelectorAll('button, input').forEach(e => {if(e !== this) e.disabled = true});
        timer.start(parseInt(document.querySelector('input').value) * 60000, () => alert('done'));
    }
});
