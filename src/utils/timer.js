class Timer {
  constructor() {
    this.startTime = null;
    this.stopTime = null;
  }

  start() {
    this.startTime = new Date();
  }

  stop() {
    if (this.startTime === null) {
      return;
    }
    this.startTime = new Date();
  }

  calculateTimeSpent() {
    const timeTaken = new Date().getTime() - this.startTime.getTime();
    this.stop();
    return timeTaken / 1000.0;
  }
}

export default Timer;
