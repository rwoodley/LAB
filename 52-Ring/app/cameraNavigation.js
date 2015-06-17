var cameraNavigator = function(camera, pointLight) {
    this._camera = camera;
    this._utils = new utils();
    this._matrix = new THREE.Matrix4();
    this._pointLight = pointLight;
    //this._camera.add(this._jellyGoggles);
    //this._jellyGoggles.position.set(0,0,0);
    _that = this;
    var _vector = new THREE.Vector3();
    $(document).keydown(function(e){
        var incr = Math.PI/32;
        console.log(e.ctrlKey + " " + e.keyCode);
        if (e.keyCode==37) {
            _that._camera.rotateY( + incr );
        }
        if (e.keyCode==39) {
            _that._camera.rotateY( - incr );
        }
        if (e.keyCode==40 && e.ctrlKey == false) {
            console.log('-y');
            _that._camera.rotateX( - incr );
        }
        if (e.keyCode==38  && e.ctrlKey == false) {
            console.log('+y');
            _that._camera.rotateX( + incr );
        }
        if (e.keyCode==40  && e.ctrlKey == true) {
            console.log('-z');
            _that._camera.rotateZ( - incr );
        }
        if (e.keyCode==38 && e.ctrlKey == true) {
            console.log('+z');
            _that._camera.rotateZ( + incr );
        }
        if (e.keyCode==32) {
            var amount = e.ctrlKey ? -1 : 1;
            var pLocal = new THREE.Vector3( 0, 0, -1 );
            var pWorld = pLocal.applyMatrix4( _that._camera.matrixWorld );
            var dir = pWorld.sub( _that._camera.position ).normalize();
            _that._camera.position.add(dir.clone().multiplyScalar(amount));
        }
        if (e.keyCode == 87) {          // W
            rotateCameraY(-Math.PI/256);
        }
        if (e.keyCode == 83) {          // S
            rotateCameraY(Math.PI/256);
        }
        //_that._pointLight.position.set(_that._camera.position.x,_that._camera.position.y+5,_that._camera.position.z);
        _that._camera.updateMatrixWorld();
    });
    function rotateCameraY(increment) {
            var radius =  _paramsSmall.innerRadius + (_paramsSmall.outerLowerRadius - _paramsSmall.innerRadius)/2.0;
          _that._utils.setPositionForRadiansRadius(_that._pointLight, _that._utils.rotateCameraY(increment, _that._camera), radius);  
    }
    // Camera initialization
    _that._camera.rotateY(Math.PI/8);       // rotate along camera axis
    rotateCameraY(-0.1);     // rotate along world axis
}