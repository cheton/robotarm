var MotionQueue = function(options) {

    var Wrapper = function() {
        this._queue = [];
        this._executed = 0;
        this._loop = false;
        this._stopped = true;
        this._callbacks = [];
    };

    Wrapper.prototype.on = function(evt, callback) {
        if (evt === 'data' && (typeof callback === 'function')) {
            this._callbacks.push(callback);
        }
        return this;
    };

    Wrapper.prototype.start = function(options) {
        options = options || {};
        this._stopped = false;
        this._loop = !!options.loop;
        this.next();
        return this;
    };

    Wrapper.prototype.pause = function() {
        this._stopped = true;
        return this;
    };

    Wrapper.prototype.stop = function() {
        this._stopped = true;
        this._loop = false;
        this._executed = 0;
        return this;
    };

    Wrapper.prototype.restart = function(options) {
        this.stop();
        this.start(options);
        return this;
    };

    Wrapper.prototype.clear = function() {
        this._queue = [];
        this._executed = 0;
        return this;
    };

    Wrapper.prototype.add = function(data) {
        this._queue = this._queue.concat(data);
        return this;
    };

    Wrapper.prototype.next = function() {
        if (this._stopped) {
            return this;
        }

        if (this._loop && this._queue.length > 0 && this._executed >= this._queue.length) {
            this._executed = 0;
            this.next();
            return this;
        }

        if (this._executed < this._queue.length) {
            var data = this._queue[this._executed];
            this._executed++;

            this._callbacks.forEach(function(callback) {
                callback(data);
            });
        }

        return this;
    };

    Wrapper.prototype.status = function() {
        return {
            stopped: this._stopped,
            total: this._queue.length,
            executed: this._executed
        };
    };

    Wrapper.prototype.executed = function() {
        return this._executed;
    };

    Wrapper.prototype.size = function() {
        return this._queue.length;
    };

    return new Wrapper();
};

module.exports = MotionQueue;
