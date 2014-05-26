var _camera, _scene, _renderer, _system;
var _meshes = [];
var _spheres = [];
var _pointLight,_pointLightSphere;
var _verticalMirror, _verticalMirrorMesh, _groundMirror, _groundMirrorMesh, _leftMirror, _leftMirrorMesh;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _spotLight;
var _controls;
var _floor;
var _ukey;
var _morphInfluence = 0.1;
var _morphDirection = -1;
var _tinySphereMat, _tinySphereGeo;
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
	_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 90;
	_camera.position.z = 90;
	_camera.position.y = 40;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
        
	_tinySphereGeo = new THREE.SphereGeometry( 0.25, 16, 8 );
	_tinySphereMat = new THREE.MeshBasicMaterial( { color: 0xff0040 } );
		
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x440000);
	_scene.add(ambientLight);

	_pointLight = new THREE.PointLight( 0xff0000, 5, 30 );
	_pointLight.position.set(0, 3, 0 );
//	_scene.add( _pointLight );

	var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
	var _pointLightSphere = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) );
	_pointLightSphere.position = _pointLight.position;
	_scene.add( _pointLightSphere );

	//var sphere2 = new THREE.SphereGeometry( 10, 16, 8 );
	//var smesh = new THREE.Mesh( sphere2, new THREE.MeshLambertMaterial( { color: 0xffffff } ) );
	//smesh.position.set(0,70,0);
	//_scene.add( smesh );
	//smesh.castShadow = true;
	//smesh.receiveShadow = true;

	var floor = doFloor();
        
	drawCoords();

	//for (var i = 0; i < 3; i++) {
	//    drawCubRandom(flower);
	//}
	var flower = drawCube(0,0,0, dumpling2, dumpling0);
	flower.castShadow = true;
	flower.receiveShadow = true;
	
	_spotLight = new THREE.SpotLight(0x00ffff);
	_spotLight.position.set(0, 1, 0);
	_spotLight.castShadow = true;
	_spotLight.angle = 2.0;
	_spotLight.intensity = 30;
	_spotLight.distance=200;
	_spotLight.shadowCameraNear = 2;
	_spotLight.shadowCameraFar = 100;
	_spotLight.shadowCameraFov = 600;
	_spotLight.shadowDarkness = 1;
	_spotLight.shadowCameraVisible = true;
	// change the direction this spotlight is facing
	var lightTarget = new THREE.Object3D();
	lightTarget.position.set(0,100,0);
	_scene.add(lightTarget);
	_spotLight.target = lightTarget;
	_scene.add(_spotLight);
     
       //var sphere3 = new THREE.SphereGeometry( 1, 16, 8 );
        //var smesh3 = new THREE.Mesh( sphere3, new THREE.MeshLambertMaterial( { color: 0xffff00 } ) );
        //smesh3.position = _spotLight.position;
        //_scene.add( smesh3 );
	
	_scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

	window.addEventListener( 'resize', onWindowResize, false );
}

function doFloor() {
	var floorMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, side:THREE.DoubleSide } );
	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
	_floor = new THREE.Mesh(floorGeometry, floorMaterial);
	_floor.rotation.x = Math.PI / 2;
	_floor.position.y = -60;
	_floor.receiveShadow = true;
	_scene.add(_floor);
	return _floor;
}
function drawCube(x,y,z, func1, func2) {
	var geometry = new THREE.ParametricGeometry(func2, 60, 60, false);
	var geometry2 = new THREE.ParametricGeometry(func1, 60, 60, false);
	var material = new THREE.MeshPhongMaterial({specular: 0xff00ff, color: 0xff00ff, shininess: 100, metal: true, morphTargets: true});
	//var material = new THREE.MeshLambertMaterial({color: 0xffffff, morphTargets: true, opacity: 1 });
        
	material.side = THREE.DoubleSide;
	
	geometry.morphTargets.push( { name: "target0", vertices: geometry2.vertices } );
	geometry.computeMorphNormals();
	mesh = new THREE.Mesh( geometry, material );

	var size = 20;
	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = y;
	_scene.add( mesh );
	var obj = { _x: x, _y : y, _z: z, _mesh: mesh };
	_meshes.push(obj);
	releaseSpheres(x,y+20,z,size);
	return mesh;
}
function releaseSpheres(x,y,z,width) {
    var range = width; var npart = 80;
    for (var i = 0; i < npart; i++) {
		var tinySphere = new THREE.Mesh( _tinySphereGeo, _tinySphereMat );
		tinySphere.receiveShadow = true;
		tinySphere.position = new THREE.Vector3(x+Math.random() * range - range / 2, y+Math.random() * range - range / 2, z+Math.random() * range - range / 2);
		_scene.add(tinySphere);
		_spheres.push(tinySphere);
    }
}
function releaseParticles(x,y,z,width) {
		createParticles(x,y,z,width,10,20)
}
function createParticles(x,y,z,width,npart,size) {

    var geom = new THREE.Geometry();
	var myTexture = new THREE.ImageUtils.loadTexture( 'icon-info.png' );

    var material = new THREE.ParticleBasicMaterial({
	size: size,
	transparent: true,
	opacity: .6,
	map: myTexture,
	sizeAttenuation: true,
	});

    var range = width;
    for (var i = 0; i < npart; i++) {
		var particle = new THREE.Vector3(x+Math.random() * range - range / 2, y+Math.random() * range - range / 2, z+Math.random() * range - range / 2);
		particle.velocityY = 0.1 + Math.random() / 5;
		particle.velocityX = (Math.random() - 0.5) / 3;
		geom.vertices.push(particle);
    }

    _system = new THREE.ParticleSystem(geom, material);
    _system.sortParticles = true;
    _system.name = "particles";
    _scene.add(_system);
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

	_camera.lookAt(_scene.position);
	for (var i = 0; i < _spheres.length; i++) {
		var sphere = _spheres[i];
		sphere.position.x += Math.random() - .5;
		sphere.position.y += Math.random() - .5;
		sphere.position.z += Math.random() - .5;
	}
	for (var i = 0; i < _meshes.length; i++) {
		var obj = _meshes[i];
		obj._mesh.rotation.y += .04;
		var morph = Math.abs(Math.sin(obj._mesh.rotation.y/4));
		obj._mesh.morphTargetInfluences [ 0 ] = 1-_morphInfluence;

		//_system.rotation.x += .1;
		//_system.rotation.z += .1;
	}
	_morphInfluence += _morphDirection * .01;
	if (_morphInfluence < 0.1) _morphDirection = 1;
	if (_morphInfluence > 1) _morphDirection = -1;
	//_morphInfluence = Math.pow(_morphInfluence,.992);
	//console.log(_morphInfluence);
	//_pointLight.position.y += .1;
	//_pointLight.distance = _pointLight.position.y*5;
	//_spotLight.target = _pointLightSphere;

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

	

