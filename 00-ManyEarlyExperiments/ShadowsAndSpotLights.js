var _camera, _scene, _renderer;
var _meshes = [];
var _pointLight,_pointLightSphere;
var _verticalMirror, _verticalMirrorMesh, _groundMirror, _groundMirrorMesh, _leftMirror, _leftMirrorMesh;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _spotLight;
var _controls;
var _floor;
var _ukey;
var _morphInfluence = .1;
var _planeMesh;
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
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 100;
	_camera.position.z = 100;
	_camera.position.y = 100;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
        
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x004400);
        //_scene.add(ambientLight);

        _pointLight = new THREE.PointLight( 0xff0000, 5, 10 );
        _pointLight.position.set(0,0.1, 0 );
        _scene.add( _pointLight );

        var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
        var _pointLightSphere = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) );
        _pointLightSphere.position = _pointLight.position;
        _scene.add( _pointLightSphere );

        var sphere2 = new THREE.SphereGeometry( 10, 16, 8 );
        var smesh = new THREE.Mesh( sphere2, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
        smesh.position.set(0,-30,0);
        _scene.add( smesh );
        smesh.castShadow = true;

        var floor = doFloor();
        
	drawCoords();
        

        //for (var i = 0; i < 3; i++) {
        //    drawCubRandom(flower);
        //}
        //var flower = drawCube(0,0,0, dumpling2, dumpling0);
        //flower.castShadow = true;
        _spotLight = new THREE.SpotLight(0x0000ff);
	_spotLight.position.set(24, 20, 0);
        _spotLight.lookAt(floor);    
        _spotLight.castShadow = true;
        _spotLight.angle = .8;
        _spotLight.intensity = 30;
        _spotLight.distance=0;
        _spotLight.shadowCameraNear = 2;
        _spotLight.shadowCameraFar = 100;
        _spotLight.shadowCameraFov = 100;
        _spotLight.shadowDarkness = 1;
        _spotLight.shadowCameraVisible = true;
//        _spotLight.lookAt(new THREE.Vector3(0,100,0));
	_scene.add(_spotLight);
                    
        var sphere3 = new THREE.SphereGeometry( 1, 16, 8 );
        var smesh3 = new THREE.Mesh( sphere3, new THREE.MeshLambertMaterial( { color: 0xffff00 } ) );
        smesh3.position = _spotLight.position;
        _scene.add( smesh3 );
        
        var planeGeo = new THREE.PlaneGeometry(20,20,20,20)
        _planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial( { color: 0x00ffaa, side:THREE.DoubleSide } ) );
        _planeMesh.castShadow = true;
        _scene.add( _planeMesh );

	window.addEventListener( 'resize', onWindowResize, false );
}

function doFloor() {
	// FLOOR
	//var floorTexture = new THREE.ImageUtils.loadTexture( 'grid_circles_metal_dark_texture_36214_256x256.jpg' );
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	//floorTexture.repeat.set( 10, 10 );
	var floorMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, side:THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(200, 200, 10, 10);
	_floor = new THREE.Mesh(floorGeometry, floorMaterial);
	_floor.rotation.x = Math.PI / 2;
        _floor.position.y = -40;
        _floor.receiveShadow = true;
	_scene.add(_floor);
        return _floor;
}
//function drawCubRandom(func) {
//		var x = Math.random() * 200 - 100;
//		var y = Math.random() * 200 - 100;
//		var z = Math.random() * 200 - 100;
//		drawCube(x,y,z, func);
//}
function drawCube(x,y,z, func1, func2) {
	var geometry = new THREE.ParametricGeometry(func2, 60, 60, false);
//        geometry.dynamic = true;
	var geometry2 = new THREE.ParametricGeometry(func1, 60, 60, false);
        //var material = new THREE.MeshPhongMaterial({specular: 0x0000ff, color: 0xff9900, shininess: 100, metal: true, morphTargets: true});
        var material = new THREE.MeshLambertMaterial({color: 0x999999   , morphTargets: true});
        
	material.side = THREE.DoubleSide;
	
        geometry.morphTargets.push( { name: "target0", vertices: geometry2.vertices } );
        //geometry.verticesNeedUpdate = true;        
        geometry.computeMorphNormals();
        mesh = new THREE.Mesh( geometry, material );
	var size = 20;
	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = y;
	_scene.add( mesh );
	var obj = { _x: x, _y : y, _z: z, _mesh: mesh };
	_meshes.push(obj);
	//drawCoordsFrom(x,y,z,20);
        return mesh;
}

function onWindowResize() {
	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();
	_renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	requestAnimationFrame( animate );
	render();	
}
var _camRadius = 400;
var _radians = 0;

function render() {
	var origin = new THREE.Vector3(0,0,0);
	_camera.lookAt(_scene.position);
	//_spotLight.position.set(_camera.position.x, _camera.position.y, _camera.position.z).normalize();
	var camPos = new THREE.Vector3(_camera.position.x, _camera.position.y, _camera.position.z);
	yTick = 100; zTick = 100;
	for (var i =0; i < _meshes.length; i++) {
		var obj = _meshes[i];
		if (yTick <= 100)
			obj._mesh.position.y = (yTick/100)*obj._y;
		if (zTick <= 100)
			obj._mesh.position.z = (zTick/100)*obj._z;
                //obj._mesh.lookAt(camPos);
                obj._mesh.rotation.y += .04;
                var morph = Math.abs(Math.sin(obj._mesh.rotation.y/4));
                obj._mesh.morphTargetInfluences [ 0 ] = 1-_morphInfluence;
	}
        _morphInfluence = Math.pow(_morphInfluence,.992);
        //console.log(_morphInfluence);
        _pointLight.position.y += .1;
        _pointLight.distance = _pointLight.position.y*5;
        //_spotLight.target = _pointLightSphere;
        _planeMesh.rotation.y += 0.04;

        if (_pointLight.distance > 40) _pointLight.distance = 40;
	_renderer.render( _scene, _camera );
	_controls.update();
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

	

