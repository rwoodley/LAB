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
var _tinySphereMat, _tinySphereGeo;
var _spotLightColor = 0xff0000;
var _pointLightColor = 0xff00ff;
var _floorColor = 0x00ff00;
var _flowerColor = 0x00ffff;
var _flowerSpecularColor = 0xaaaaaa;
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
	_camera.position.x = -100;
	_camera.position.y = 40;
	_camera.position.z = -60;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
        
	_tinySphereGeo = new THREE.SphereGeometry( 0.25, 16, 8 );
	_tinySphereMat = new THREE.MeshBasicMaterial( { color: 0x00ff40 } );
		
	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x2222ff);
	_scene.add(ambientLight);

	_pointLight = new THREE.PointLight( _pointLightColor, 1, 60 );
	_pointLight.position.set(0, -10, 0 );
	//_scene.add( _pointLight );

	var sphere = new THREE.SphereGeometry( 0.25, 16, 8 );
	var _pointLightSphere = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: _pointLightColor } ) );
	_pointLightSphere.position = _pointLight.position;
	//_scene.add( _pointLightSphere );

	var floor = doFloor();
        
	drawCoords();

	//for (var i = 0; i < 3; i++) {
	//    drawCubRandom(flower);
	//}
	//var material = new THREE.MeshPhongMaterial({specular: _flowerSpecularColor, color: _flowerColor, shininess: 10, metal: false, morphTargets: true});
	//var material = new THREE.MeshLambertMaterial({color: _flowerColor, morphTargets: true, opacity: 1 });
    var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xffffff, specular: 0xffffff, shininess: 50,
											   shading: THREE.SmoothShading, morphTargets: true }  );
	material.side = THREE.DoubleSide;

    var cup2FlatGeo = morphGeo(funcCup, flatDumpling);
    var flat2CupGeo = morphGeo(flatDumpling, funcCup);
    var flat2FlatGeo = morphGeo(flatDumpling, flatDumpling);
    
	var flower = drawCube(-20,0,-20, cup2FlatGeo, material, 0, 0, 0, false);
	var flower2 = drawCube(0,0,-20, flat2CupGeo, material, 0,0,0,false);
	var flower3 = drawCube(20,0,-20, flat2FlatGeo, material,0,0,0,false);

	var flower4 = drawCube(-20,0,0, cup2FlatGeo, material, 1, 1, 0, false);
	var flower5 = drawCube(0,0,0, flat2CupGeo, material, 1,1,0,false);
	var flower6 = drawCube(20,0,0, flat2FlatGeo, material,1,1,0,false);
	//
	var flower7 = drawCube(-20,0,20, cup2FlatGeo, material, 0, 1, 0.01, true);
	var flower8 = drawCube(0,0,20, flat2CupGeo, material, 0,1,0.01,true);
	var flower9 = drawCube(20,0,20, flat2FlatGeo, material,0,1,0.01,true);

//	flower.castShadow = true;
//	flower2.castShadow = true;
//	flower3.castShadow = true;
	//flower.receiveShadow = true;

	// add spotlight for the shadows
	var _spotLight = new THREE.SpotLight( _spotLightColor );
	_spotLight.position.set( -40, 60, -10 );
	_spotLight.castShadow = true;
	_spotLight.shadowCameraVisible = true;
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
	_spotLight.target = floor;
	_scene.add( _spotLight );
     
	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('keydown', function (e) { eventHandler(null, 'keydown', e) }, false);
}
function morphGeo(func1, func2) {
    var func1Geo = new THREE.ParametricGeometry(func1, 60, 60, false);
    var func2Geo = new THREE.ParametricGeometry(func2, 60, 60, false);
	func1Geo.morphTargets.push( { name: "target0", vertices: func2Geo.vertices } );
	func1Geo.computeMorphNormals();
    return func1Geo;
}
function drawCube(x,y,z, geometry, material, morphStart, morphEnd, morphDelta, morphOscillate) {     // morphInfluence = 0 means show func1, = 1 means show morphFunc
	mesh = new THREE.Mesh( geometry, material );

	var size = 20;
	mesh.position.x = x;
	mesh.position.y = y;
	mesh.position.z = z;
	_scene.add( mesh );
	var obj = { _x: x, _y : y, _z: z, _mesh: mesh,
        _morphStart : morphStart, _morphEnd : morphEnd, _morphDelta : morphDelta, _morphOscillate : morphOscillate };
	_meshes.push(obj);
	//releaseSpheres(x,y+20,z,1);
	return mesh;
}

function animate() {
	requestAnimationFrame( animate );
	render();	
}
var _camRadius = 400;
var _radians = 0;
var _tick = 0;
function render() {

	_camera.lookAt(_scene.position);
	for (var i = 0; i < _meshes.length; i++) {
		var obj = _meshes[i];
		obj._mesh.rotation.y += .04;
        
        var mi;
        if (_tick == 0) {
            mi = obj._morphStart;
            obj._morphDirection = 1;
        }
        else {
            mi = obj._morphInfluence + obj._morphDelta * obj._morphDirection;
            if (mi > obj._morphEnd) {
                if (obj._morphOscillate) {
                    obj._morphDirection = -1;
                    mi = obj._morphInfluence + obj._morphDelta * obj._morphDirection;
                }
                mi = obj._morphEnd;
            }
            if (mi < obj._morphStart) {
                obj._morphDirection = 1;
                mi = obj._morphInfluence + obj._morphDelta * obj._morphDirection;
            }
        }
        obj._morphInfluence = mi;
		obj._mesh.morphTargetInfluences [ 0 ] = obj._morphInfluence;
	}
    //_pointLight.position.y += .1;
    //_pointLight.distance = _pointLight.position.y*5;
    //if (_pointLight.distance > 40) _pointLight.distance = 40;
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
	

