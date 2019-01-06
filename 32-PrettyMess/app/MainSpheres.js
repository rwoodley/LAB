
if ( ! Detector.webgl ) {

	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";

}

var _container;

var _camera, _controls, _scene, _renderer;
var _shaderMaterial;
var mesh, texture;

var worldWidth = 512, worldDepth = 512,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

init();
animate();

function init() {
    _container = document.getElementById( 'container' );

    _camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

    _scene = new THREE.Scene();
    _controls = new THREE.OrbitControls( _camera, _container.domElement );
    _renderer =  new THREE.WebGLRenderer();

    _camera.position.x = 50; _camera.position.y =10; _camera.position.z = 50;
    var axes = new THREE.AxisHelper( 5000 );
    _scene.add(axes);

	var spotLight = new THREE.SpotLight( 0xaa00ff ); 
	spotLight.position.set( 100, 1000, 100 ); 
	spotLight.shadowCameraNear = 500; spotLight.shadowCameraFar = 4000; spotLight.shadowCameraFov = 30; 
	_scene.add(spotLight);

	var fog = new THREE.Fog( 0xffffff, -100, 3000 );
	var texture = THREE.ImageUtils.loadTexture("cloud10.png");
    _shaderMaterial = new THREE.ShaderMaterial({
		uniforms: //THREE.UniformsUtils.merge([	// see: https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/ 
		        {
		            "map": { type: "t", value: texture },
		            "fogColor" : { type: "c", value: fog.color },
		            "fogNear" : { type: "f", value: fog.near },
		            "fogFar" : { type: "f", value: fog.far },
				    ambientLightColor : { type: "fv", value: [] },
                    directionalLightDirection : { type: "fv", value: [] },
                    directionalLightColor : { type: "fv", value: [] },
                    hemisphereLightDirection : { type: "fv", value: [] },
                    hemisphereLightSkyColor : { type: "fv", value: [] },
                    hemisphereLightGroundColor : { type: "fv", value: [] },
                    pointLightColor : { type: "fv", value: [] },
                    pointLightPosition : { type: "fv", value: [] },
                    pointLightDistance : { type: "fv1", value: [] },
                    spotLightColor : { type: "fv", value: [] },
                    spotLightPosition : { type: "fv", value: [] },
                    spotLightDirection : { type: "fv", value: [] },
                    spotLightDistance : { type: "fv1", value: [] },
                    spotLightAngleCos : { type: "fv1", value: [] },
                    spotLightExponent : { type: "fv1", value: [] }		        },
		// ]),
        vertexShader: document.getElementById( 'vs' ).textContent,
        fragmentShader: document.getElementById( 'fs' ).textContent,
        depthWrite: false,
        depthTest: false,
		transparent: true,
		lights: true,
		WrapS: THREE.RepeatWrapping,
		WrapT: THREE.RepeatWrapping,
    } );
    _shaderMaterial.needsUpdate = true;

	cloudGeo = createCloud();
	for (var x = 0; x < 1; x++) {
		for (var y = 0; y < 1; y++) {
			var cloudMesh = new THREE.Mesh(cloudGeo, _shaderMaterial);
			cloudMesh.position.x = x*50; cloudMesh.position.y = y*50;
		    _scene.add(cloudMesh);
		}
	}


	doFloor();

    _renderer.setClearColor( 0xbfd1ff );
    _renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById( 'container' ).innerHTML = "";
    _container.appendChild( _renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {

	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();

	_renderer.setSize( window.innerWidth, window.innerHeight );

}
function createCloud()
{

	var cloudGeo = new THREE.Geometry();

	var tx = 10;
	var ty = 10;
	var tz = 10;
    var material = new THREE.MeshNormalMaterial();
	for (i = 0; i < 20; i++) {
		var radius = lnRandomScaled(3,30);
		if (radius < 1) radius = 1;
		//console.log(radius);
		//var radius = (Math.random() * 1 + 1) * 8;
	    var sphere = new THREE.SphereGeometry(radius, 50, 50);
		var particle = jiggleVec(tx, tz, ty, 15);
		var distance = Math.sqrt(Math.pow(tx-particle.x, 2) + Math.pow(ty-particle.y, 2) + Math.pow(tz-particle.z, 2))
		var scalar = 3*radius/distance;
		var sphereMesh = new THREE.Mesh(sphere, material);
		sphereMesh.position.x = scalar * (particle.x-tx) + tx;
		sphereMesh.position.y = scalar * (particle.y-ty) + ty;
		sphereMesh.position.z = scalar * (particle.z-tz) + tz;
		sphereMesh.rotation.x = Math.random() * Math.PI *2;
		sphereMesh.rotation.y = Math.random() * Math.PI *2; 
		sphereMesh.rotation.z = Math.random() * Math.PI *2;
		sphereMesh.updateMatrix();
	    cloudGeo.merge(sphereMesh.geometry, sphereMesh.matrix)
	}
	var amount = 2.;
	for( vi in cloudGeo.vertices) {
		var vertex = cloudGeo.vertices[vi];
		for (var i = 0; i < 10; i++) {
			vertex.x += Math.random()*amount-amount/2.;
			vertex.y += Math.random()*amount-amount/2.;
			vertex.z += Math.random()*amount-amount/2.;
		}
	}
    return cloudGeo;
}
function createCloudPlane()
{
	var cloudGeo = new THREE.Geometry();
	var texture = THREE.ImageUtils.loadTexture( 'cloud10.png', null, animate );
	texture.magFilter = THREE.LinearMipMapLinearFilter;
	texture.minFilter = THREE.LinearMipMapLinearFilter;

	var fog = new THREE.Fog( 0xffffff, - 100, 3000 );
	var tx = 10;
	var ty = 10;
	var tz = 10;
    var material = new THREE.MeshNormalMaterial();
	for (i = 0; i < 100; i++) {
		var radius = lnRandomScaled(8,30);
		if (radius < 1) radius = 1;
		var particle = jiggleVec(tx, tz, ty, 165);
		var distance = Math.sqrt(Math.pow(tx-particle.x, 2) + Math.pow(ty-particle.y, 2) + Math.pow(tz-particle.z, 2))
		var scalar = .8*radius/distance;

		var plane = new THREE.Mesh( new THREE.PlaneGeometry( radius, radius ), _shaderMaterial );
		plane.position.x = scalar * (particle.x-tx) + tx;
		plane.position.y = scalar * (particle.y-ty) + ty;
		plane.position.z = scalar * (particle.z-tz) + tz;
		THREE.GeometryUtils.merge( cloudGeo, plane );
	}
	return cloudGeo;
}
function jiggleVec(x,y,z, jiggleAmount) {
	x *= 1 + jiggleAmount*(Math.random() - .5);
	y *= 1 + jiggleAmount*(Math.random() - .5);
	z *= 1 + jiggleAmount*(Math.random() - .5);
	return new THREE.Vector3(x,y,z);
}
function animate() {

	requestAnimationFrame( animate );

	render();
}
function doFloor() {
        //var floorMaterial = new THREE.MeshLambertMaterial( { color: _floorColor, side:THREE.DoubleSide } );
        var floorMaterial = new THREE.MeshPhongMaterial( { color: 0x77ff00, side:THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(750, 750,50,50);
        var _floor = new THREE.Mesh(floorGeometry, floorMaterial);
        _floor.rotation.x = Math.PI / 2;
        _floor.position.y = -50;
        _floor.receiveShadow = true;
        _scene.add(_floor);
        return _floor;
}
function render() {

	_controls.update( clock.getDelta() );
	_renderer.render( _scene, _camera );
    var camPos = new THREE.Vector3(_camera.position.x, _camera.position.y, _camera.position.z);
    rotateCameraY(.02);
    _camera.lookAt(new THREE.Vector3(0,0,0));
}
var _radians = 0;
var _radiusIncr = -1.0;
function rotateCameraY(radians) {
	if (_radiusIncr == undefined) _radiusIncr = -1;
    var x = _camera.position.x;	
    var y = _camera.position.y;	
    var z = _camera.position.z;
    var signx = x > 0 ? 1 : -1;

    // get current radians from z and x coords.
    _radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
    if (signx == -1) _radians += Math.PI;

    _radians += radians;
    if (_radians > Math.PI*2) _radians = _radians%(Math.PI*2);
    while (_radians < 0) _radians += Math.PI*2;

    //console.log( _radians);

    var radius = Math.sqrt(x*x + z*z);
    radius += _radiusIncr;
    if (radius < 10) _radiusIncr = 1;
    if (radius > 500) _radiusIncr = -1;
    _camera.position.x = radius * Math.cos(_radians);
    _camera.position.z = radius * Math.sin(_radians);
    //__camera.position.y = 4;
}
