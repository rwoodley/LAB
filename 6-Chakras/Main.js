var _camera, _scene, _renderer, _system;
var _pointLight,_pointLightSphere;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _spotLight;
var _controls;
var _floor;
var _ukey;
var _pointLightColor = 0xbbbbbb;
var _flowerColor = 0x00ffff;
var _flowerFactory;
var _tick = 0;
var _kSphere;
var _particleSystem;
var _particleSystemRadius = 5;
var _cameraFocus;
init();
animate();
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function init() {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
    
	_renderer = new THREE.WebGLRenderer();
	_renderer.setSize( window.innerWidth, window.innerHeight );
	_renderer.shadowMapEnabled = true;
    _renderer.sortObjects = false; // see http://stackoverflow.com/questions/15994944/transparent-objects-in-threejs
	//_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 0;
	_camera.position.y = 0;
	_camera.position.z = 40;
    _cameraFocus = new THREE.Vector3(0,0,0);
    _camera.lookAt(_cameraFocus);
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
//	_camera.lookAt(_scene.position);
    //_camera.lookAt(new THREE.Vector3(100, 90, 0));

	// add subtle ambient lighting
	var ambientLight = new THREE.AmbientLight(0x777777);
	_scene.add(ambientLight);

    _kSphere = new THREE.Mesh( 
        new THREE.SphereGeometry(0.25,16,8),
        new THREE.MeshBasicMaterial( { color: 0xffff00 } ) );
    _kSphere.position.y = -90;
    _scene.add(_kSphere);
    _camera.lookAt(_kSphere.position);
    //var floor = doFloor();        
	//drawCoords();
    doShader();
    
    _scene.fog = new THREE.FogExp2( 0xaa00FF, 0.001 );
    
    _flowerFactory = new flowerFactory(_scene);
    
//	var flower5 = _flowerFactory.testPlot(0,0,0);
	var flower1 = _flowerFactory.chakra(0,-90,0,4,0xff0000,1.0, 1, 0, 15, 0, true);
	var flower2 = _flowerFactory.chakra(0,-60,0,6,0xD9603B,1.0, 2, .1, 7, 0, true);
	var flower3 = _flowerFactory.chakra(0,-30,0,10,0xffff00,1.0, 3, .1, 7, 0, true);
	var flower4 = _flowerFactory.chakra(0,0,0,12,0x00ff00,1.0, 4, .1, 10, 0, true);
	var flower5 = _flowerFactory.chakra(0,30,0,16,0x00FFEF,1.0, 5, .1, 7, 0, true);
	var flower6 = _flowerFactory.chakra(0,60,0,2,0x2E08ff,1.0, 6, .1, 7, 0, true);
	var flower7 = _flowerFactory.chakra(0,90,0,8,0xBF5FFF,1.0, 7, .0, 20, 0, true);
	var flower7 = _flowerFactory.chakra(0,90,0,8,0xBF5FFF,1.0, 7, .2, 20, Math.PI/24, false);
	var flower7 = _flowerFactory.chakra(0,90,0,8,0xBF5FFF,1.0, 7, .4, 20, 2*Math.PI/24 , false);

    var particleGeometry = new THREE.Geometry();
	for (var j = -90; j < 90; j+=3) {
        var _particleSystemRadius = 5; var i = (j/30) * Math.PI;
		particleGeometry.vertices.push( new THREE.Vector3(_particleSystemRadius*Math.cos(i),0,_particleSystemRadius*Math.sin(i) ) );
		particleGeometry.vertices.push( new THREE.Vector3(-_particleSystemRadius*Math.cos(i),0,-_particleSystemRadius*Math.sin(i)) );
		particleGeometry.vertices.push( new THREE.Vector3(0,0,0) );
    }
        var discTexture = THREE.ImageUtils.loadTexture( 'Textures/disc.png' );
//    var discTexture = new THREE.Texture( generateTexture( ) );
//    discTexture.needsUpdate = true; // important
//    var tempMat = new THREE.MeshBasicMaterial( { map: discTexture, color: 0xffffff, opacity: 1.0} );
    var particleMaterial = new THREE.ParticleBasicMaterial({ map: discTexture, size: 3, color: 0xffff00, transparency: true, alphaTest: 0.5 });
    _particleSystem = new THREE.ParticleSystem( particleGeometry, particleMaterial );
	_particleSystem.position.set(0, 0, 0);
    _particleSystem.dynamic = true;
    _particleSystem.translateZ(-_particleSystemRadius);
	_scene.add( _particleSystem );

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('keydown', function (e) { eventHandler(null, 'keydown', e) }, false);
}
function generateTexture( ) {

    // draw a circle in the center of the canvas
    var size = 128;
    
    // create canvas
    var canvas = document.createElement( 'canvas' );
    canvas.width = size;
    canvas.height = size;
    
    // get context
    var context = canvas.getContext( '2d' );
    
    // draw circle
    var centerX = size / 2;
    var centerY = size / 2;
    var radius = size / 2;

    context.beginPath();
    context.arc( centerX, centerY, radius, 0, 2 * Math.PI, false );
    context.fillStyle = "#FFFFFF";
    context.fill();

    return canvas;

}
function animate() {
	requestAnimationFrame( animate );
	render();	
}
function render() {
    _kSphere.position.y += .08;
    _kSphere.position.x = Math.sin(_tick * .05)*10;
    var particleGeometry = _particleSystem.geometry;
    _camera.position.y = _kSphere.position.y;
    _camera.position.z += .2;
    if (_camera.position.z > 400) _camera.position.z = 400;
    _cameraFocus.y = _kSphere.position.y;
    if (_cameraFocus.y > 0) _cameraFocus.y = 0;
    _camera.lookAt(_cameraFocus);
    //_particleSystem.translateZ(_particleSystemRadius);
    _particleSystem.rotation.y += 0.01;
    //_particleSystem.translateZ(-_particleSystemRadius);
	for( var v = 0; v < particleGeometry.vertices.length; v++ ) 
	{
        // there should be 180 points. The y pos is v/2.
        var ypos = 3*v/3-90;
        if (ypos > _kSphere.position.y)
            ypos = -90;
        else
            // only the inner channel (v%3 == 2) goe past the 6th chakra.
            if (v%3 != 2 && ypos > 60) ypos = -90;
        var particle = particleGeometry.vertices[v];
        particle.y = ypos;
	}
    
    particleGeometry.verticesNeedUpdate = true;
    
    var tick = _tick - 2;             // delay to set up lice.    
    if (tick <= -1) tick = -1;
    _flowerFactory.updateFlowers(tick, _kSphere);
    //if (tick > 0) {
    //    _pointLight.distance += .065;
    //    if (_pointLight.distance > 60) _pointLight.distance = 60;
    //}
	_renderer.render( _scene, _camera );
	_controls.update();
    _tick++;
}
function doShader(x,y,z,radius, color) {
    var sphereGeom = new THREE.SphereGeometry(radius, 32, 16);
    //var tempMat = new THREE.MeshBasicMaterial( { color: color, opacity: 0.5, alphaTest: 0.5, transparent: true } );
    var customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
			"c":   { type: "f", value: 1.0 },
			"p":   { type: "f", value: 1.4 },
			glowColor: { type: "c", value: new THREE.Color(color) },
			viewVector: { type: "v3", value: _camera.position }
		},
		vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	});
	var moonGlow = new THREE.Mesh( sphereGeom, customMaterial);
    moonGlow.position.y = y;
	//moonGlow.scale.multiplyScalar(1.2);
	_scene.add( moonGlow );
    return moonGlow;
}

