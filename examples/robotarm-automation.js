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

    robotarm
        .then(function(next) {
            to(30, 2000); // Move all axes to 30 degrees in 2000ms.

            setTimeout(next, 2500);
        })
        .then(function(next) {
            to(150, 2000); // Move all axes to 150 degrees in 2000ms.

            setTimeout(next, 2500);
        })
        .then(function(next) {
            this.axis.pivot.to(10, 2000); // Move axis.pivot to 10 degrees in 2000ms.
            this.axis.claw.to(175, 2000); // Move axis.claw to 175 degrees in 2000ms.

            setTimeout(next, 2500);
        })
        .then(function(next) {
            this.axis.pivot.to(150, 2000); // Move axis.pivot to 150 degrees in 2000ms.
            this.axis.claw.to(130, 2000); // Move axis.claw to 130 degrees in 2000ms.

            setTimeout(next, 2500);
        })
        .then(function(next) {
            center(1000); // Move all axes to the center position.

            setTimeout(next, 2500);
        });

    _.each(['pivot', 'stand', 'shoulder', 'elbow', 'wrist'], function(axis, index) {
        var pin = index;

        this.analogRead(pin, _.throttle(function(value) {
            if (value < 250) {
                robotarm.axis[axis].step(-2); // -2 degree per step
                console.log('axis=%s, value=%d', axis, robotarm.axis[axis].value);
            }
            if (value > 750) {
                robotarm.axis[axis].step(2); // 2 degree per step
                console.log('axis=%s, value=%d', axis, robotarm.axis[axis].value);
            }
        }, 50)); // Only invoke func at most once per every 25ms.
    }.bind(this));

    this.analogRead(5, function(value) {
        value = five.Fn.scale(value, 0, 1023, 135, 175);
        robotarm.axis.claw.to(value);
    });

    //robotarm.play({
    //    loop: true // You can set loop to true to execute continuously.
    //});

    /*
    setTimeout(function() {
        robotarm.stop(); // Stop robotarm after 20 seconds.
    }, 20 * 1000);
    */
});
