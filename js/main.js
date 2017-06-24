class Timer {
    constructor(tick) {
        this.tick = tick;
        this.state = states.inactive;
        this.threadID = null;
        this.timePassed = 0;
    }

    start(time) {
        if(this.state === states.pause) {
            this.endDate = new Date().getTime() + (this.time - this.timePassed);
        }
        else {
            this.time = time;
            this.endDate = new Date(new Date().getTime() + this.time);
        }
        this.state = states.active;

        return new Promise(resolve => {
            this.threadID = setInterval(() => {
                this.tick();
                this.now = new Date();
                this.timePassed = this.time - (this.endDate - this.now);
                if (this.now > this.endDate) {
                    clearInterval(this.threadID);
                    this.state = states.inactive;
                    this.timePassed = 0;
                    resolve();
                }
            }, 1000);
        })
    }

    getCurrentState() {
        if(this.state === states.inactive) {
            return '00:00';
        }

        const distance = this.time - this.timePassed;
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.ceil((distance % (1000 * 60)) / 1000);

        if(seconds === 60) {
            minutes++;
            seconds = 0;
        }

        return minutes + ':' + (seconds.toString().length === 2 ? seconds : '0' + seconds);
    }

    getState() { return this.state; }

    pause() {
        this.state = states.pause;
        clearInterval(this.threadID);
        this.timePassed = this.time - (this.endDate - this.now);
    }

    getPercentage() {
        if (this.timePassed !== 0) return Math.floor(this.timePassed / this.time * 100);
        return 0;
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
const clock = document.querySelector(".clock");
const timerNode = document.querySelector('.timer');
let timer = new Pomodoro(() => {
    clock.innerText = timer.getCurrentState();
    timerNode.className = timerNode.className.replace(/p[0-9]+/g, 'p' + timer.getPercentage());
    timerNode.className = timerNode.className.replace(/green|red/g, timer.getTimeFor() ? 'green' : 'red');
    document.querySelector('html').style.backgroundColor = timer.getTimeFor() ? '#37f53b' : '#d33728';
});

document.querySelectorAll('.danger').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        if(input.value > 1) input.value--;
    });
});

document.querySelectorAll('.success').forEach(e => {
    e.addEventListener('click', function() {
        let groupID = this.parentElement.parentElement.id;
        let input = document.querySelector('#' + groupID + ' input');
        if(input.value < 100) input.value++;
    });
});

document.querySelector(".timer").addEventListener('click', function () {
    if(timer.getState() === states.active) {
        timer.pause();
    }
    else {
        if (timer.getState() === states.pause) {
            timer.resume();
        }
        else {
            document.querySelectorAll('button, input').forEach(e => e.style.display = 'none');
            timer.start(parseInt(document.querySelector('#work input').value) * 60000,
                        parseInt(document.querySelector('#break input').value) * 60000);
        }
    }
});
