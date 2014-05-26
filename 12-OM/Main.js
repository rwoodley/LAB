var _camera, _scene, _renderer, _system;
var _pointLight,_pointLightSphere;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _controls;
var _ukey;
var _pointLightColor = 0xffffff;
var _flowerColor = 0x00ffff;
var _flowerFactory;
var _tick = 0;
var _mesh_OM;

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
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
    var dis = .75;  
	_camera.position.x = 20*dis;
	_camera.position.y = 24*dis;
	_camera.position.z = -45*dis;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
		
	var ambientLight = new THREE.AmbientLight(0x333333);
	_scene.add(ambientLight);

	_pointLight = new THREE.PointLight( _pointLightColor, 1, 1 );
	_pointLight.position.set(0, -10, 0 );
    _pointLight.distance = 60;
	_scene.add( _pointLight );

	var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
	var _pointLightSphere = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: _pointLightColor } ) );
	_pointLightSphere.position = _pointLight.position;
	//_scene.add( _pointLightSphere );
    
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0,15,-10);
    spotLight.intensity=3;
    _scene.add(spotLight);

	//doFloor();        
	//drawCoords();

    _flowerFactory = new flowerFactory(_scene);
    
	var flower5 = _flowerFactory.flower(0,0,0);

    _mesh_OM = createMesh(geo_OM());
    _scene.add(_mesh_OM);
     
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('keydown', function (e) { eventHandler(null, 'keydown', e) }, false);
}
function createMesh(geom) {
//    THREE.GeometryUtils.scale(geom, new THREE.Vector3(s,s,s));
    geom.applyMatrix(new THREE.Matrix4().makeTranslation(-.5, -1.3, 0));
    geom.applyMatrix(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3( 1, 0, 0 ), Math.PI));
    geom.applyMatrix(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3( 0, 1, 0 ), Math.PI));
    
    // assign two materials
    //var meshMaterial = new THREE.MeshNormalMaterial({transparent: true, opacity: 0.7});
    var meshMaterial = new THREE.MeshPhongMaterial( { color: 0x0019ff, specular:0xffff00,  shininess: 10, side:THREE.DoubleSide } );
    
    // create a multimaterial
    var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMaterial]);
    var s = 5;
    mesh.scale.set(s,s,s);
    
    return mesh;
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
    //if (tick > 0) {
    //    _pointLight.distance += .065;
    //    if (_pointLight.distance > 60) _pointLight.distance = 60;
    //}
    if (_mesh_OM.position.y < 3)
        _mesh_OM.position.y += 0.03;
    
	_renderer.render( _scene, _camera );
	_controls.update();
    _tick++;
}
function doFloor() {
	//var floorMaterial = new THREE.MeshLambertMaterial( { color: _floorColor, side:THREE.DoubleSide } );
	var floorMaterial = new THREE.MeshPhongMaterial( { color: 0x77ff00, side:THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(250, 250,50,50);
	var _floor = new THREE.Mesh(floorGeometry, floorMaterial);
	_floor.rotation.x = Math.PI / 2;
	_floor.position.y = -50;
	_floor.receiveShadow = true;
	_scene.add(_floor);
    alert('x');
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
	

