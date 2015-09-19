var CommandQueue = require('./command-queue');

/**
 * @param {object} options.board See https://github.com/rwaldron/johnny-five/wiki/Board#parameters
 * @param {object} options.axis
 */
var RobotArm = function(options) {
    this._queue = new CommandQueue();
    this.axis = options.axis;

    this._queue.on('data', function(fn) {
        console.assert(typeof fn === 'function', 'fn is not a function');

        fn.call(this, function() {
            this._queue.next();
        }.bind(this));
    }.bind(this));
};

RobotArm.prototype.then = function(fn) {
    this._queue.add(fn);
    return this;
};

RobotArm.prototype.run = RobotArm.prototype.start = function(options) {
    this._queue.start(options);
    return this;
};

RobotArm.prototype.stop = function() {
    this._queue.stop();
    return this;
};

RobotArm.prototype.restart = function(options) {
    this._queue.restart(options);
    return this;
};

RobotArm.prototype.pause = function() {
    this._queue.pause();
    return this;
};

RobotArm.prototype.reset = function() {
    this._queue.stop();
    this._queue.clear();
    return this;
};

module.exports = RobotArm;
