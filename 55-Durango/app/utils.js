var utils = function() {
    this.rotateCameraY = function(incrementInRadians, camera) {
        var x = camera.position.x;	var y = camera.position.y;	var z = camera.position.z;
        var signx = x > 0 ? 1 : -1;
    
        // get current radians from z and x coords.
        var radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
        if (signx == -1) radians += Math.PI;
    
        radians += incrementInRadians;
        if (radians > Math.PI*2) radians = radians%(Math.PI*2);
        while (radians < 0) radians += Math.PI*2;
    
        var radius = Math.sqrt(x*x + z*z);
        camera.position.x = radius * Math.cos(radians);
        camera.position.z = radius * Math.sin(radians);
        camera.rotateY(-incrementInRadians);
        return radians;
    }
    this.setPositionForRadiansRadius = function(object, radians, radius) {
        object.position.x = radius * Math.cos(radians);
        object.position.z = radius * Math.sin(radians);
    }
}