# RobotArm [![build status](https://travis-ci.org/cheton/robotarm.svg?branch=master)](https://travis-ci.org/cheton/robotarm) [![Coverage Status](https://coveralls.io/repos/cheton/browserify-css/badge.svg)](https://coveralls.io/r/cheton/robotarm)

[![NPM](https://nodei.co/npm/robotarm.png?downloads=true&stars=true)](https://nodei.co/npm/robotarm/)

JavaScript Powered Robot Arm with Johnny-Five

[Demo Video](https://www.youtube.com/watch?v=aYJ7rFvTvoU&feature=youtu.be)

## Examples

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
    var RobotArm = require('robotarm');
    var robotarm = new RobotArm({
        axis: {
            base: new five.Servo(3), // attached to pin 3
            bottom: new five.Servo(5),
            middle: new five.Servo(6),
            top: new five.Servo(9),
            wrist: new five.Servo(10),
            claw: new five.Servo(11)
        }
    });
    
    // Allows direct command line access
    this.repl.inject({
        robotarm: robotarm
    });
    
    robotarm
        .then(function(next) {
            // Move all axes to the center position in 1000ms.
            this.axis.base.center(1000);
            this.axis.bottom.center(1000);
            this.axis.middle.center(1000);
            this.axis.top.center(1000);
            this.axis.wrist.center(1000);
            this.axis.claw.center(1000);
            
            setTimeout(next, 1500);
        })
        .then(function(next) {
            // Move claw axis to 10 degrees in 2000ms.
            this.axis.claw.to(10, 2000);
            
            setTimeout(next, 2000);
        })
        .then(function(next) {
            // Move claw axis to 170 degrees in 2000ms.
            this.axis.claw.to(170, 2000);
            
            setTimeout(next, 2000);
        })
        .then(function(next) {
            // Do other stuff
            next();
        });
    
    robotarm.play({
        loop: true // Set loop to true to execute continuously.
    });
    
    setTimeout(function() {
        robotarm.stop(); // Stop robotarm after 20 seconds.
    }, 20 * 1000);
});
```
