var cameraNavigator = function(rightCamera, listener) {
    this._camera = rightCamera;
    this._utils = new utils();
    this._matrix = new THREE.Matrix4();
    this._listener = listener;

    _that = this;
    var _vector = new THREE.Vector3();
    $(document).keydown(function(e){
        var incr = Math.PI/32;
        console.log("key " + e.ctrlKey + " " + e.keyCode);
        if (e.keyCode==40) {
            rotateCameraY(Math.PI/256);
        }
        if (e.keyCode==38) {
            rotateCameraY(-Math.PI/256);
        }
        if (e.keyCode == 90) {          // Z
            rotateCameraY(-Math.PI/64);
        }
        if (e.keyCode == 87) {          // W
            rotateCameraY(-Math.PI/256);
        }
        if (e.keyCode == 83) {          // S
            rotateCameraY(Math.PI/256);
        }
        _that._camera.updateMatrixWorld();
    });
    function rotateCameraY(increment) {
        var radians = _that._utils.rotateCameraY(increment, _that._camera);
        _that._listener(radians);
    }
    this.forwards = function() {
            rotateCameraY(-Math.PI/256);
    }
    this.backwards = function() {
            rotateCameraY(Math.PI/256);
    }
    // Camera initialization
    _that._camera.rotateY(Math.PI*.05);       // rotate along camera axis
    rotateCameraY(-0.1);     // rotate along world axis
}