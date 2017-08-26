// following three.js conventions, the ship always looks now the Z axis
// it has a forward facing camera. So the camera === the ship. so we only need a camera to contain
// the orientation and position info of the ship. just need 1 object.
// the navigator changes orientation and position of the ship/camera.
// So... this ship is really the camera. the shipPlanet is what the physic engine knows about.
// There is a ship mesh which is a sphere and is invisible, but the physics engine uses it to update position info.
// In the render() routine, the camera position is kept in sync with the mesh position.
var Ship = function(locator, objectCache) {
    var _that = this;
    this._listeners = {};
    //this._locator.getService('ManualNavigator').addListener('KeyCode', this.updateOrientation);
    // FOV is vertical FOV, see: http://stackoverflow.com/a/26665260
    _that._camera = new THREE.PerspectiveCamera( 75, 1.0, .1, 20000000 );
    _that._objectCache = objectCache;

    // the ship has velocity around its Y or X axis or both. X is horizontal axis, Y is vertical axis.
    // positive rotation around X means pushing the up arrow.
    // the ship always faces in the -z direction.
    // The x and y velocity are angular velocities and do not affect the ships position until forward thrust is applied.
    _that._yVelocity = 0;
    _that._xVelocity = 0;

    var shipGeometry = new THREE.SphereGeometry( 10, 32, 32 );
    var shipMaterial = new THREE.MeshNormalMaterial();
    var shipMesh = new THREE.Mesh( shipGeometry, shipMaterial );
    _that._mesh = shipMesh;
    
    _that._camera.position.set(0,100000,0);
    // _that._camera.lookAt(new THREE.Vector3(0,0,0));
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
        var incr = (_that._objectCache.dt/88) * Math.PI/2048;
        console.log("posx = " + _that._camera.position.x);
        console.log(e.ctrlKey + " " + e.keyCode);
        if (e.keyCode==38) {    // up arrow
            _that._yVelocity += incr;
        }
        if (e.keyCode==40) {    // down arrow
            _that._yVelocity -= incr;
        }
        if (e.keyCode==37) {    // left arrow
            _that._xVelocity += incr;
        }
        if (e.keyCode==39) {    // right arrow
            _that._xVelocity -= incr;
        }
        if (e.keyCode==32) {
            var amount = e.ctrlKey ? -1 : 1;
            var pLocal = new THREE.Vector3( 0, 0, -1 );
            var pWorld = pLocal.applyMatrix4( _that._camera.matrixWorld );
            var dir = pWorld.sub( _that._camera.position ).normalize();
            _that._camera.position.add(dir.clone().multiplyScalar(amount));
            console.log(_that._camera.position);
        }
        if (e.keyCode==90 && e.ctrlKey == false) {
            _that._objectCache.shipPlanet.velocity.z += 10;
        }
        if (e.keyCode==90 && e.ctrlKey == true) {
            _that._objectCache.shipPlanet.velocity.z -= 10;
        }
        if (e.keyCode==89 && e.ctrlKey == false) {
            _that._objectCache.shipPlanet.velocity.y += 10;
        }
        if (e.keyCode==89 && e.ctrlKey == true) {
            _that._objectCache.shipPlanet.velocity.y -= 10;
        }
        if (e.keyCode==88 && e.ctrlKey == false) {
            _that._objectCache.shipPlanet.velocity.x += 10;
        }
        if (e.keyCode==88 && e.ctrlKey == true) {
            _that._objectCache.shipPlanet.velocity.x -= 10;
        }
        if (e.keyCode==48 && e.ctrlKey == true) {       // key code  for 0
            _that._objectCache.shipPlanet.velocity.x = 0;
            _that._objectCache.shipPlanet.velocity.y = 0;
            _that._objectCache.shipPlanet.velocity.z = 0;
        }

        _that.sendUpdates();
    }
    
}