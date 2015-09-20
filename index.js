var CommandQueue = require('./command-queue');

/**
 * Creates a new robot arm
 * @constructor
 * @param {object} options The options object.
 * @param {object|array} options.axis A list of servos to control robot arm.
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
    this._queue.push(fn);
    return this;
};

RobotArm.prototype.play = function(options) {
    this._queue.play(options);
    return this;
};

RobotArm.prototype.stop = function() {
    this._queue.stop();
    return this;
};

RobotArm.prototype.replay = function(options) {
    this._queue.replay(options);
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
