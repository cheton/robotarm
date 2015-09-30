var _ = require('lodash');
var five = require('johnny-five');
var RobotArm = require('../');

// JohnnyFive
// https://github.com/rwaldron/johnny-five/wiki/Board#parameters
var board = new five.Board({
    repl: true
});

var createRobotArm = function() {
    return new RobotArm({
        axis: {
            pivot: new five.Servo({
                pin: 3,
                center: true,
                range: [10, 170]
            }),
            stand: new five.Servo({
                pin: 5,
                center: true,
                range: [10, 170]
            }),
            shoulder: new five.Servo({
                pin: 6,
                center: true,
                range: [10, 170]
            }),
            elbow: new five.Servo({
                pin: 9,
                center: true,
                range: [10, 170]
            }),
            wrist: new five.Servo({
                pin: 10,
                center: true,
                range: [0, 180]
            }),
            claw: new five.Servo({
                pin: 11,
                center: true,
                range: [135, 175]
            })
        }
    });
};

board.on('ready', function() {
    var robotarm = createRobotArm();

    // Move each servo to the center point.
    var center = function() {
        var args = Array.prototype.slice.call(arguments);
        _.each(robotarm.axis, function(axis) {
            axis.center.apply(axis, args);
        });
    };

    // Move each servo to a specific position.
    var to = function() {
        var args = Array.prototype.slice.call(arguments);
        _.each(robotarm.axis, function(axis) {
            axis.to.apply(axis, args);
        });
    };

    this.repl.inject({
        robotarm: robotarm,
        axis: robotarm.axis,
        center: center,
        to: to
    });

    { // Toggle play/stop
        var button = new five.Button({
            pin: 2,
            isPullup: true
        });
        button.on('down', function(value) {
            if (robotarm.isRunning()) {
                robotarm.stop();
                center(1000); // Go back to center in 1000ms
            } else {
                robotarm.play();
            }
        });
    }

    var delay = 1500; // 1500ms
    var timeout = delay + 500;

    robotarm
        // turn right
        .then(function(next) {
            var delay = 2000;
            this.axis.pivot.to(50.00, delay);
            this.axis.stand.to(151.50, delay);
            this.axis.shoulder.to(58.20, delay);
            this.axis.elbow.to(94.80, delay);
            this.axis.wrist.to(93.02, delay);
            this.axis.claw.min(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            this.axis.claw.max(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            // center all axes except the claw
            this.axis.pivot.center(delay);
            this.axis.stand.center(delay);
            this.axis.shoulder.center(delay);
            this.axis.elbow.center(delay);
            this.axis.wrist.center(delay);
            setTimeout(next, timeout);
        })
        // turn left
        .then(function(next) {
            var delay = 2000;
            this.axis.pivot.to(122.00, delay);
            this.axis.stand.to(151.40, delay);
            this.axis.shoulder.to(58.00, delay);
            this.axis.elbow.to(96.00, delay);
            this.axis.wrist.to(90.00, delay);
            this.axis.claw.max(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            this.axis.claw.min(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            this.axis.claw.max(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            // center all axes except the claw
            this.axis.pivot.center(delay);
            this.axis.stand.center(delay);
            this.axis.shoulder.center(delay);
            this.axis.elbow.center(delay);
            this.axis.wrist.center(delay);
            setTimeout(next, timeout);
        })
        .then(function(next) {
            var delay = 2000;
            this.axis.pivot.to(50.00, delay);
            this.axis.stand.to(151.50, delay);
            this.axis.shoulder.to(58.20, delay);
            this.axis.elbow.to(94.80, delay);
            this.axis.wrist.to(93.02, delay);
            setTimeout(next, timeout);
        });

    robotarm.play({
        loop: true // You can set loop to true to execute continuously.
    });

    /*
    setTimeout(function() {
        robotarm.stop(); // Stop robotarm after 20 seconds.
    }, 20 * 1000);
    */
});
