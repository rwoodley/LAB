var _camera, _scene, _renderer, _system;
var _pointLight,_pointLightSphere;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _spotLight;
var _controls;
var _floor;
var _ukey;
var _spotLightColor = 0xaa0000;
var _pointLightColor = 0x0000aa;
var _floorColor = 0x00ff00;
var _flowerColor = 0x00ffff;
var _flowerFactory;
var _tick = 0;

init();
animate();
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function init() {

	_renderer = new THREE.WebGLRenderer();
	_renderer.setSize( window.innerWidth, window.innerHeight );
	_renderer.shadowMapEnabled = true;
	//_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	_renderer.setClearColor( 0x111166 );
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 49;
	_camera.position.y = 43;
	_camera.position.z = 0;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
		
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x770000);
	_scene.add(ambientLight);

	_pointLight = new THREE.PointLight( _pointLightColor, 1, 1 );
	_pointLight.position.set(0, -10, 0 );
	_scene.add( _pointLight );

	var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
	var _pointLightSphere = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: _pointLightColor } ) );
	_pointLightSphere.position = _pointLight.position;
	//_scene.add( _pointLightSphere );

	//var floor = doFloor();        
	//drawCoords();

	//for (var i = 0; i < 3; i++) {
	//    drawCubRandom(flower);
	//}

    _flowerFactory = new flowerFactory(_scene);
    
	var flower5 = _flowerFactory.flower(0,0,0);

	// add spotlight for the shadows
	var _spotLight = new THREE.SpotLight( _spotLightColor );
	_spotLight.position.set( -40, 60, -10 );
	_spotLight.castShadow = true;
	//_spotLight.shadowCameraVisible = true;
	_spotLight.angle = 2.0;
	//_spotLight.intensity = 30;
	_spotLight.distance=400;
	_spotLight.shadowCameraNear = 2;
	_spotLight.shadowCameraFar = 300;
	_spotLight.shadowCameraFov = 500;
	_spotLight.shadowDarkness = 1;
	//_spotLight.shadowCameraVisible = true;
	//// change the direction this spotlight is facing
	var lightTarget = new THREE.Object3D();
	lightTarget.position.set(0,	0,0);
	_scene.add(lightTarget);
	_spotLight.target = flower5;
	_scene.add( _spotLight );
     
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('keydown', function (e) { eventHandler(null, 'keydown', e) }, false);
}

function animate() {
	requestAnimationFrame( animate );
	render();	
}
function render() {

	_camera.lookAt(_scene.position);
//    _pointLight.position.y += .03;
    var tick = _tick - 20;             // delay to set up lice.    
    if (tick <= -1) tick = -1;
    //console.log(_tick + " " + tick);
    _flowerFactory.updateFlowers(tick);
    if (tick > 0) {
        _pointLight.distance += .065;
        if (_pointLight.distance > 60) _pointLight.distance = 60;
    }
	_renderer.render( _scene, _camera );
	_controls.update();
    _tick++;
}
function doFloor() {
	//var floorMaterial = new THREE.MeshLambertMaterial( { color: _floorColor, side:THREE.DoubleSide } );
	var floorMaterial = new THREE.MeshPhongMaterial( { color: _floorColor, side:THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(250, 250,50,50);
	_floor = new THREE.Mesh(floorGeometry, floorMaterial);
	_floor.rotation.x = Math.PI / 2;
	_floor.position.y = -50;
	_floor.receiveShadow = true;
	_scene.add(_floor);
	return _floor;
}
function drawCoords() {
	drawLine(1000,0,0,'purple');
	drawLine(0,1000,0,'purple');
	drawLine(0,0,1000,'purple');
}
function drawLine(x,y,z,color1) { drawLineFrom(0,0,0,x,y,z,color1); }
function drawCoordsFrom(x,y,z,len) {
	drawLineFrom(x,y,z,x+len,y,z,'blue');
	drawLineFrom(x,y,z,x,y+len,z,'red');
	drawLineFrom(x,y,z,x,y,z+len,'yellow');
}
function drawLineFrom(x1,y1,z1,x2,y2,z2,color1) {
	var lineGeometry = new THREE.Geometry();
	var vertArray = lineGeometry.vertices;
	vertArray.push( new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2) );
	lineGeometry.computeLineDistances();
	var lineMaterial = new THREE.LineBasicMaterial( { color:color1 } );
	var line = new THREE.Line( lineGeometry, lineMaterial );
	_scene.add(line);
}
function onWindowResize() {
	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();
	_renderer.setSize( window.innerWidth, window.innerHeight );
}

function eventHandler(canvas, res, e) {
	// z = 90, a=65, x=88, s = 83, c= 67, d = 68, v= 86, f =70
    if (res == 'keydown') {
		console.log(e.keyCode);
		if (e.keyCode == 67) {
			alert(
			_camera.position.x + "," +
			_camera.position.y + "," +
			_camera.position.z);
		}
	}
}
	

