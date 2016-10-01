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
                pin: 4,
                center: true,
                range: [0, 180]
            }),
            stand: new five.Servo({
                pin: 5,
                center: true,
                range: [0, 180]
            }),
            elbow: new five.Servo({
                pin: 6,
                center: true,
                range: [0, 180]
            }),
            claw: new five.Servo({
                pin: 7,
                center: true,
                range: [0, 110]
            })
        }
    });
};

board.on('ready', function() {
    var that = this;
    var robotarm = createRobotArm();
    var axes = _(robotarm.axis)
        .keys()
        .value();

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

    var printDegrees = function() {
        var list = [];
        _.each(robotarm.axis, function(axis, name) {
            list.push(name + '=' + axis.value.toFixed(2));
        });
        console.log(list.join(' '));
    };

    this.repl.inject({
        robotarm: robotarm,
        axis: robotarm.axis,
        center: center,
        to: to
    });

    // Button: Go to center
    var button = new five.Button({
        pin: 2,
        isPullup: true
    });
    button.on('down', function(value) {
        center(1000);
    });

    (function() {
        // A0=pivot, A1=stand, A3=elbow
        var axes = _(robotarm.axis)
            .keys()
            .without('claw')
            .value();
        var pins = [0, 1, 3];

    _.each(['pivot', 'stand', 'elbow'], function(axis, index) {
            var pin = pins[index];

            that.analogRead(pin, function(value) {
                if (value < 250) {
                    robotarm.axis[axis].step(-1, 5); // -1 degree per step in 5ms
                    printDegrees();
                }
                if (value > 750) {
                    robotarm.axis[axis].step(1, 5); // 1 degree per step in 5ms
                    printDegrees();
                }
            });
        });
    })();

    // Servo: claw
    (function() {
        // A5=claw
        var axis = 'claw';
        var pin = 5;

        that.analogRead(pin, _.throttle(function(value) {
            var min = robotarm.axis[axis].range[0];
            var max = robotarm.axis[axis].range[1];

            value = five.Fn.scale(value, 0, 1023, min, max);

            if (robotarm.axis[axis].value != value) {
                robotarm.axis[axis].to(max - value);
                printDegrees();
            }
        }, 20)); // Only invoke func at most once per every 20ms.
    })();
});
