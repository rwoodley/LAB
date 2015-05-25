

if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

var _container;
var _camera, _controls, _scene, _renderer;
var mesh, texture;
var _windowWidth=200, _windowHeight=200;

var clock = new THREE.Clock();
init();
animate();

function init() {
    _container = document.getElementById( 'container' );

    _camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

    _scene = new THREE.Scene();
    _controls = new THREE.OrbitControls( _camera, _container.domElement );
    _renderer =  new THREE.WebGLRenderer();

    _camera.position.x = 5; _camera.position.y = -5; _camera.position.z = 0;
    var axes = new THREE.AxisHelper( 5000 );
    _scene.add(axes);
    
    var geometry = new THREE.SphereGeometry(1,32,32);
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    _scene.add(mesh);

    _renderer.setClearColor( 0xbfd1ff );
    _renderer.setSize( _container.innerWidth, _container.innerHeight );

    document.getElementById( 'container' ).innerHTML = "";
    _container.appendChild( _renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    onWindowResize();
}
function onWindowResize() {

    _camera.aspect = _windowWidth / _windowHeight;
    _camera.updateProjectionMatrix();

    _renderer.setSize( _windowWidth, _windowHeight );

}

function animate() {

    requestAnimationFrame( animate );

    render();
}

function render() {

    _controls.update( clock.getDelta() );
    _renderer.render( _scene, _camera );
    _camera.lookAt(new THREE.Vector3(0,0,0));
    var camPos = new THREE.Vector3(_camera.position.x, _camera.position.y, _camera.position.z);
    rotateCameraY(.02);
}
var _radians = 0;
function rotateCameraY(radians) {
    var x = _camera.position.x;	var y = _camera.position.y;	var z = _camera.position.z;
    var signx = x > 0 ? 1 : -1;

    // get current radians from z and x coords.
    _radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
    if (signx == -1) _radians += Math.PI;

    _radians += radians;
    if (_radians > Math.PI*2) _radians = _radians%(Math.PI*2);
    while (_radians < 0) _radians += Math.PI*2;

    //console.log( _radians);

    var radius = Math.sqrt(x*x + z*z);
    _camera.position.x = radius * Math.cos(_radians);
    _camera.position.z = radius * Math.sin(_radians);
    //__camera.position.y = 4;
}
