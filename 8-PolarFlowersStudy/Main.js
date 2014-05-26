var _camera, _scene, _renderer, _system;
var _pointLight,_pointLightSphere;
var _spotLight;
var _controls;
var _mat;
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
    _renderer.sortObjects = false; // see http://stackoverflow.com/questions/15994944/transparent-objects-in-threejs
	//_renderer.shadowMapCullFace = THREE.CullFaceBack;        
	document.body.appendChild( _renderer.domElement );

	_camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 4000 );
	_camera.position.x = 0;
	_camera.position.y = 140;
	_camera.position.z = 400                                                             ;
	_controls = new THREE.OrbitControls( _camera, _renderer.domElement );

	_scene = new THREE.Scene();
//	_camera.lookAt(_scene.position);
    _camera.lookAt(new THREE.Vector3(100, 90, 0));

	var ambientLight = new THREE.AmbientLight(0x777777);
	_scene.add(ambientLight);

	var _spotLight = new THREE.SpotLight( 0x0000ff );
	_spotLight.position.set( 40, 390, -30);
	_spotLight.intensity = 3;
	_spotLight.distance=600;
	_scene.add( _spotLight );

	var _spotLight = new THREE.SpotLight( 0x00aaff );
	_spotLight.position.set(-40, -190, -40);
	_spotLight.intensity = 2;
	_spotLight.distance=400;
	_scene.add( _spotLight );

	doPlot();
}
function doPlot() {
    var mesh;
    var color = 0xffffff;
    //var Mat = new THREE.MeshLambertMaterial({color: 0xaaaaaa, opacity: 1 });
    //var Mat2 = new THREE.MeshLambertMaterial({color: 0xddaaaa, opacity: 1 });
    _mat = new THREE.MeshPhongMaterial(
    { ambient: 0x555555, color: color, specular: 0x0000cc    ,
      shininess: 20,shading: THREE.SmoothShading  }  );


    doShape(-60,0,0,funcDisc);
    doShape(-30,0,0,funcCone);
    doShape(0,0,0,funcPetals);
    doShape(30,0,0,funcCup);
    doShape(60,0,0,funcDumpling);
    doShape(90,0,0,funcKiss);
    
    doShape(-60,0,30,funcPolarDisc);
    doShape(-30,0,30,funcPolarCone);
    doShape(0,0,30,funcPolarPetals);
    doShape(30,0,30,funcPolarCup);
    doShape(60,0,30,funcPolarDumpling);
    doShape(90,0,30,funcPolarKiss);
}
function doShape(x,y,z,daFunc) {
    var Geo3 = new THREE.ParametricGeometry(daFunc, 90, 90, false);
    mesh = new THREE.Mesh( Geo3, _mat );
    mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
    this._scene.add(mesh);

}
function animate() {
	requestAnimationFrame( animate );
	render();	
}
function render() {
    
    	_renderer.render( _scene, _camera );
	_controls.update();
    _tick++;
}

