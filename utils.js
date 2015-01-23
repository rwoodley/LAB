function onWindowResize() {

    _camera.aspect = window.innerWidth / window.innerHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( window.innerWidth, window.innerHeight );

}
function doFloor(scene) {
        //var floorMaterial = new THREE.MeshLambertMaterial( { color: _floorColor, side:THREE.DoubleSide } );
        var floorMaterial = new THREE.MeshPhongMaterial( { color: 0x77ff00, side:THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(750, 750,50,50);
        var _floor = new THREE.Mesh(floorGeometry, floorMaterial);
        _floor.rotation.x = Math.PI / 2;
        _floor.position.y = -50;
        _floor.receiveShadow = true;
        scene.add(_floor);
        return _floor;
}

var _radians = 0;
function rotateCameraY(camera, radians) {
    var x = camera.position.x;	var y = camera.position.y;	var z = camera.position.z;
    var signx = x > 0 ? 1 : -1;

    // get current radians from z and x coords.
    _radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
    if (signx == -1) _radians += Math.PI;

    _radians += radians;
    if (_radians > Math.PI*2) _radians = _radians%(Math.PI*2);
    while (_radians < 0) _radians += Math.PI*2;

    //console.log( _radians);

    var radius = Math.sqrt(x*x + z*z);
    camera.position.x = radius * Math.cos(_radians);
    camera.position.z = radius * Math.sin(_radians);
    //_camera.position.y = 4;
}
var _radiansZ = 0;
function rotateCameraZ(camera, radians) {
    var x = camera.position.x;	var y = camera.position.y;	var z = camera.position.z;
    var signy = y > 0 ? 1 : -1;

    _radiansZ = y==  0 ? Math.PI/2 : Math.atan(x/y);
    if (signy == -1) _radiansZ += Math.PI;

    _radiansZ += radians;
    if (_radiansZ > Math.PI*2) _radiansZ = _radiansZ%(Math.PI*2);
    while (_radiansZ < 0) _radiansZ += Math.PI*2;

    //console.log( _radians);

    var radius = Math.sqrt(y*y + x*x);
    camera.position.y = radius * Math.cos(_radiansZ);
    camera.position.x = radius * Math.sin(_radiansZ);
    //_camera.position.y = 4;
}
var _radiansX = 0;
function rotateCameraX(camera, radians) {
    var x = camera.position.x;	var y = camera.position.y;	var z = camera.position.z;
    var signy = y > 0 ? 1 : -1;
    //var signy = 1;
    // get current radians from z and x coords.
    _radiansX = y == 0 ? Math.PI/2 : Math.atan(z/y);
    if (signy == -1) _radiansX += Math.PI;

    _radiansX += radians;
    if (_radiansX > Math.PI*2) _radiansX = _radiansX%(Math.PI*2);
    while (_radiansX < 0) _radiansX += Math.PI*2;

    //console.log( _radians);

    var radius = Math.sqrt(y*y + z*z);
    camera.position.y = radius * Math.cos(_radiansX);
    camera.position.z = radius * Math.sin(_radiansX);
    //_camera.position.y = 4;
}

function drawAxes(size,position, rotation) {
    size = size || 1;
    var vertices = new Float32Array( [
    0, 0, 0, size, 0, 0,
    0, 0, 0, 0, size, 0,
    0, 0, 0, 0, 0, size
    ] );
    var colors = new Float32Array( [
    1, 0, 0, 1, 0.6, 0,
    0, 1, 0, 0.6, 1, 0,
    0, 0, 1, 0, 0.6, 1
    ] );
    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    var mesh = new THREE.Line(geometry, material, THREE.LinePieces );
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    return mesh;
}



// see: http://stackoverflow.com/questions/4878145/javascript-and-webgl-external-scripts
function loadShaderFile(url, data, callback, errorCallback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText, data)
            } else { // Failed
                errorCallback(url);
            }
        }
    };

    request.send(null);    
}

function loadShaderFiles(urls, callback, errorCallback) {
    var numUrls = urls.length;
    var numComplete = 0;
    var result = [];

    // Callback for a single file
    function partialCallback(text, urlIndex) {
        result[urlIndex] = text;
        numComplete++;

        // When all files have downloaded
        if (numComplete == numUrls) {
            callback(result);
        }
    }

    for (var i = 0; i < numUrls; i++) {
        loadShaderFile(urls[i], i, partialCallback, errorCallback);
    }
}

var gl;
// -------------
function doSkyDome(pathToTexture) {
    var skyGeometry = new THREE.SphereGeometry(5000,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture(pathToTexture);

    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });
    _skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    _skyBox.material.fog = false;
    _skyBox.position.set(0,0,0);
    _skyBox.scale.set(-1,1,1);
    //_skyBox.rotation.x = Math.PI/4;
    _scene.add( _skyBox );
}
