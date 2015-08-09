// following three.js conventions, the ship always looks now the Z axis
// it has a forward facing camera. So the camera === the ship. so we only need a camera to contain
// the orientation and position info of the ship. just need 1 object.
// the navigator changes orientation and position of the ship/camera.
var Ship = function(locator, aspectRatio) {
    var _that = this;
    this._listeners = {};
    //this._locator.getService('ManualNavigator').addListener('KeyCode', this.updateOrientation);
    // FOV is vertical FOV, see: http://stackoverflow.com/a/26665260
    _that._camera = new THREE.PerspectiveCamera( 45, aspectRatio, .1, 20000 );
    _that._camera.position.set(AUm*41,AUm*1.5,0);
    _that._camera.lookAt(new THREE.Vector3(AUm*40,0,0));
    this.getCamera = function() { return _that._camera; }
    this.Orientation = {
        'Position': _that._camera.position,
        'MatrixWorld': _that._camera.matrixWorld
    };
    this.addListener = function(category, callBack) {
        _that._listeners[category] = callBack;
    };
    this.sendUpdates = function() {
        _that._listeners['Orientation'](_that.Orientation);
    };
    this.updateOrientation = function(e) {
        var incr = Math.PI/32;
        console.log("posx = " + _that._camera.position.x);
        console.log(e.ctrlKey + " " + e.keyCode);
        if (e.keyCode==37) {
            _that._camera.rotateY( - incr );
        }
        if (e.keyCode==39) {
            _that._camera.rotateY( + incr );
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
            console.log(_that._camera.position);
        }
        _that.sendUpdates();
    }
    
}