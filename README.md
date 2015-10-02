# RobotArm [![build status](https://travis-ci.org/cheton/robotarm.svg?branch=master)](https://travis-ci.org/cheton/robotarm) [![Coverage Status](https://coveralls.io/repos/cheton/browserify-css/badge.svg)](https://coveralls.io/r/cheton/robotarm)

[![NPM](https://nodei.co/npm/robotarm.png?downloads=true&stars=true)](https://nodei.co/npm/robotarm/)

JavaScript Powered Robot Arm with Johnny-Five

## Demo
#### Roadshow
File: [examples/robotarm-show.js](examples/robotarm-roadshow.js)<br>
[![IMAGE ALT TEXT](http://img.youtube.com/vi/aYJ7rFvTvoU/0.jpg)](https://www.youtube.com/watch?v=aYJ7rFvTvoU "JavaScript Powered Robot Arm with Johnny-Five")

#### Automation
File: [examples/robotarm-automation.js](examples/robotarm-automation.js)<br>
[![IMAGE ALT TEXT](http://img.youtube.com/vi/9-F1qE_ZfTo/0.jpg)](https://www.youtube.com/watch?v=9-F1qE_ZfTo "JavaScript Powered Robot Arm with Johnny-Five")

You can check out the [examples](https://github.com/cheton/robotarm/blob/master/examples/) for above videos.

## Examples

```js
var five = require('johnny-five');
var board = new five.Board();

board.on('ready', function() {
    var RobotArm = require('robotarm');
    var robotarm = new RobotArm({
        axis: {
            pivot: new five.Servo(3), // attached to pin 3
            stand: new five.Servo(5),
            shoulder: new five.Servo(6),
            elbow: new five.Servo(9),
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
            this.axis.pivot.center(1000);
            this.axis.stand.center(1000);
            this.axis.shoulder.center(1000);
            this.axis.elbow.center(1000);
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
