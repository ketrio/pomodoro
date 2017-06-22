class Timer {
    constructor(tick) {
        this.tick = tick;
        this.state = states.inactive;
        this.threadID = null;
    }

    start(time) {
        if(this.state === states.inactive) this.time = time;
        this.now = new Date();
        this.endDate = new Date(this.now.getTime() + this.time);
        this.state = states.active;

        return new Promise(resolve => {
            this.threadID = setInterval(() => {
                this.tick();
                this.now = new Date();
                if (this.now > this.endDate) {
                    // action();
                    clearInterval(this.threadID);
                    this.state = states.inactive;
                    resolve();
                }
            }, 1000);
        })
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

class Pomodoro extends Timer {
    constructor(tick) {
        super(tick);
        this.timeFor = undefined;
    }

    start(workTime, breakTime) {
        this.workTime = workTime;
        this.breakTime = breakTime;
        this.startWork();
    }

    async startWork() {
        this.timeFor = timeFor.work;
        await super.start(this.workTime);
        this.startBreak()
    }

    async startBreak() {
        this.timeFor = timeFor.break;
        await super.start(this.breakTime);
        this.startWork();
    }

    getState() {
        const timerState = super.getState();
        if(timerState === states.inactive) {
            return timeFor.inactive;
        }
        else {
            return this.state;
        }
    }

    getTimeFor() {
        return this.timeFor;
    }

    resume() {
        super.start();
    }
}

const states = {
    inactive : 0,
    active : 1,
    pause : 2
};
const timeFor = {
    work: 0,
    break: 1
};
const clock = document.querySelector(".pomodoro");
let timer = new Pomodoro(() => clock.innerText = timer.getCurrentState() + '\n' +
    (timer.getTimeFor() ? 'break' : 'work'));

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
        if(input.value < 100) input.value++;
    });
});

document.querySelector(".trigg").addEventListener('click', async function () {
    if(timer.getState() === states.active) {
        timer.pause();
    }
    else {
        if (timer.getState() === states.pause) {
            timer.resume();
        }
        else {
            document.querySelectorAll('button, input').forEach(e => {if(e !== this) e.disabled = true});
            timer.start(parseInt(document.querySelector('#work input').value) * 60000,
                        parseInt(document.querySelector('#break input').value) * 60000);
        }
    }
});
