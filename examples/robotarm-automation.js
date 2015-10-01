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

    var motion = {
        openClaw: {
            claw: 'min',
        },
        closeClaw: {
            claw: 'max'
        },
        center: {
            pivot: 'center',
            stand: 'center',
            shoulder: 'center',
            elbow: 'center',
            wrist: 'center'
        },
        turnRightDown: {
            pivot: 50.00,
            stand: 151.50,
            shoulder: 58.00,
            elbow: 96.00,
            wrist: 90.00
        },
        turnLeftDown: {
            pivot: 122.00,
            stand: 151.50,
            shoulder: 58.00,
            elbow: 96.00,
            wrist: 90.00
        }
    };
    var go = function(m, delay) {
        _.each(m, function(value, axis) {
            if ( ! _.isNumber(value)) {
                var method = value;
                robotarm.axis[axis][method](delay);
                return;
            }

            robotarm.axis[axis].to(value, delay);
        });
    };

    robotarm
        // turn right down and open the claw
        .then(function(next) {
            go(motion.turnRightDown, 2000);
            go(motion.openClaw, 2000);
            setTimeout(next, 2500);
        })
        // close the claw
        .then(function(next) {
            go(motion.closeClaw, 1500);
            setTimeout(next, 2000);
        })
        // center all except the claw
        .then(function(next) {
            go(motion.center, 1500);
            setTimeout(next, 2000);
        })
        // turn left down
        .then(function(next) {
            go(motion.turnLeftDown, 2000);
            setTimeout(next, 2500);
        })
        // open the claw
        .then(function(next) {
            go(motion.openClaw, 1500);
            setTimeout(next, 2000);
        })
        // close the claw
        .then(function(next) {
            go(motion.closeClaw, 1500);
            setTimeout(next, 2000);
        })
        // center all except the claw
        .then(function(next) {
            go(motion.center, 1500);
            setTimeout(next, 2000);
        })
        // turn right down
        .then(function(next) {
            go(motion.turnRightDown, 2000);
            setTimeout(next, 2500);
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
