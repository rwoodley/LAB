var _camera, _scene, _renderer, _system;
var scene;
var _windowHalfX = window.innerWidth / 2;
var _windowHalfY = window.innerHeight / 2;
var _spotLight;
var _controls;
var _tick = 0;
var _morphMesh;
var _morphDirection = 1;
var clock = new THREE.Clock();
init();
animate();
function init() {

	_renderer = new THREE.WebGLRenderer();
	_renderer.setSize( window.innerWidth, window.innerHeight );
	_renderer.shadowMapEnabled = true;
    _renderer.sortObjects = false; // see http://stackoverflow.com/questions/15994944/transparent-objects-in-threejs
	//_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 0;
	_camera.position.y = 90;
	_camera.position.z = 400                                                             ;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
    scene = _scene;
	_camera.lookAt(_scene.position);

	var ambientLight = new THREE.AmbientLight(0x777777);
	_scene.add(ambientLight);
    
    var candle =
	{
		positionStyle  : Type.CUBE,
		positionBase   : new THREE.Vector3( 0, 50, 0 ),
		positionRadius : 2,
		
		velocityStyle  : Type.CUBE,
		velocityBase   : new THREE.Vector3(0,100,0),
		velocitySpread : new THREE.Vector3(50,50,0),
		
		particleTexture : THREE.ImageUtils.loadTexture( 'textures/smokeparticle.png' ),
		
		sizeTween    : new Tween( [0, 0.3, 1.2], [20, 150, 1] ),
		opacityTween : new Tween( [0.9, 1.5], [1, 0] ),
		colorTween   : new Tween( [0.5, 1.0], [ new THREE.Vector3(0.02, 1, 0.5), new THREE.Vector3(0.05, 1, 0) ] ),

		angleBase               : 0,
		angleSpread             : 0,
		angleVelocityBase       : 0,
		angleVelocitySpread     : 0,
		
		particlesPerSecond : 10,
		particleDeathAge   : 4.5,		
		emitterDeathAge    : 60
	}
	this.engine = new ParticleEngine();
	engine.setValues( candle );
	engine.initialize();
	
    
  /*  Morph
    //var geo1 = new THREE.SphereGeometry( 64,16,16 );
    var geo1 = new THREE.CylinderGeometry( 30, 30, 180, 20, 4 );
    alert(geo1.vertices.length);
    //var geo2 = new THREE.SphereGeometry( 32,16,16 );
    //var geo2 = new THREE.TetrahedronGeometry( 40, 0 )
    var geo2 = new THREE.CylinderGeometry( 30, 30, 80, 20, 4 );
    geo1.morphTargets.push({ name: "target0", vertices: geo2.vertices });
    geo1.computeMorphNormals();
    var discTexture = THREE.ImageUtils.loadTexture( 'textures/disc.png' );
    var particleMaterial = new THREE.MeshPhongMaterial(
    { ambient: 0x00ff00, color: 0x00ff00, specular: 0x00ff00 , shininess: 10,shading: THREE.SmoothShading, morphTargets: true }  );
    
    //var particleMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.8, blending: THREE.AdditiveBlending, transparent: true } );
	//var particleMaterial = new THREE.ParticleBasicMaterial({ map: discTexture, size: 12, color: 0xff0000, transparency: true, alphaTest: 0.5 });
    //var particleCube = new THREE.ParticleSystem( morphGeo, particleMaterial );
    _morphMesh = new THREE.Mesh(geo1, particleMaterial);
    //_scene.add(_morphMesh);
*/
    /* lathe
    var points = [];
    for ( var i = 0; i < 50; i ++ ) {
        points.push( new THREE.Vector3( Math.sin( i * 0.2 ) , Math.cos(i*0.2), i ) );
    }
    var map = THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    var object = new THREE.Mesh( new THREE.LatheGeometry( points, 20 ), new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: map, side: THREE.DoubleSide } ) );
    object.position.set( 0, 0, 0 );
    _scene.add( object );
*/
	window.addEventListener( 'resize', onWindowResize, false );
}

function animate() {
	requestAnimationFrame( animate );
	render();	
}
function render() {
    //_morphMesh.morphTargetInfluences [ 0 ] += 0.05*_morphDirection;
    //if (_morphMesh.morphTargetInfluences [ 0 ] > 0.94) _morphDirection = -1;
    //if (_morphMesh.morphTargetInfluences [ 0 ] < 0.06) _morphDirection = 1;
	_renderer.render( _scene, _camera );
	_controls.update();
	var dt = clock.getDelta();
	engine.update( dt * 0.5 );	
}
function onWindowResize() {
	_camera.aspect = window.innerWidth / window.innerHeight;
	_camera.updateProjectionMatrix();
	_renderer.setSize( window.innerWidth, window.innerHeight );
}

	

