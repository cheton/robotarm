# RobotArm
JavaScript Powered Robot Arm with Johnny-Five

```js
var five = require('johnny-five');
var board = new five.Board();
var RobotArm = require('robotarm');

board.on('ready', function() {
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
            // Move all axes to the center position.
            this.axis.base.center();
            this.axis.bottom.center();
            this.axis.middle.center();
            this.axis.top.center();
            this.axis.wrist.center();
            this.axis.claw.center();
            
            setTimeout(next, 2000);
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
    
    robotarm.run({
        loop: true // Set loop to true to execute continuously.
    });
});
```
