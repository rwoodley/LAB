/***
	Testing the new Parametric Surfaces Geometries
    	zz85 JS/CPU version of http://jsdo.it/c5h12/iCYB
****/
var container, stats;

var camera, scene, renderer;

var renderingMesh;
var renderingGeometry;
var geometries = [];

var interval = 4000;
var last_t = 1, t;
var current = 1, next = 0;
var pi = Math.PI

init();
animate();



function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.y = 400;
	scene.add( camera );

	var light, object, materials;

	scene.add( new THREE.AmbientLight( 0x404040 ) );

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 0, 1 );
	scene.add( light );

	materials = [
		new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, map: THREE.ImageUtils.loadTexture( 'textures/ash_uvgrid01.jpg' ) } ),
		new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 } )
	];

	var heightScale = 1;
	var p = 2;
	var q = 3;
	var radius = 150, tube = 10, segmentsR = 50, segmentsT = 20;


	
	var xsegments = 15;
	var ysegments = 15;
	var geometry;


	// Plane
	geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.plane(200, 200), xsegments, ysegments);
	geometries.push(geometry);

	// Klein
	geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.klein, xsegments, ysegments);
	geometries.push(geometry);


	// Mobius Strip
	geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius, xsegments, ysegments);
	geometries.push(geometry);

	// Mobius 3d
	geometry = new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, xsegments, ysegments);
	geometries.push(geometry);

	// Sphere
	var size = 10;
	function sphere(u, v) {
		u *= pi;
		v *= 2 * pi;
		
		var x = size * Math.sin(u) * Math.cos(v);
		var y = size * Math.sin(u) * Math.sin(v);
		var z = size * Math.cos(u);
		

		return new THREE.Vector3(x, y, z);
	}

	geometry = new THREE.ParametricGeometry(sphere, xsegments, ysegments);
	geometries.push(geometry);

	
	renderingGeometry = new THREE.ParametricGeometry(sphere, xsegments, ysegments);
	renderingGeometry.dynamic = true;

	// renderingMesh = THREE.SceneUtils.createMultiMaterialObject( renderingGeometry, materials );
	renderingMesh = new THREE.Mesh( renderingGeometry, materials[1] );
	renderingMesh.doubleSided = true; //children[ 0 ]
	renderingMesh.position.set( 0, 0, 0 );
	renderingMesh.scale.multiplyScalar(10);
	scene.add( renderingMesh );


	object = new THREE.AxisHelper();
	object.position.set( 200, 0, -200 );
	object.scale.x = object.scale.y = object.scale.z = 0.5;
	scene.add( object );


	//renderer = new THREE.CanvasRenderer(); 
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container.appendChild( renderer.domElement );
/*
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );
*/
}

//

function animate() {

	requestAnimationFrame( animate );

	render();
	//stats.update();

}

// Test geometry vertices change.
function change() {

	pick = geometries[0];

	var i,il;
	for ( i = 0, il = pick.vertices.length; i < il ; i ++ ) {
		renderingGeometry.vertices[i] = pick.vertices[i];
	}
	
	renderingGeometry.verticesNeedUpdate = true;
	console.log(renderingMesh);


}


function tween(t) {

	from = geometries[current];
	to =  geometries[next];

	var tmp = new THREE.Vector3();

	var i,il;
	for ( i = 0, il = from.vertices.length; i < il ; i ++ ) {
		
		tmp
			.copy(to.vertices[i])
			.sub(from.vertices[i])
			.multiplyScalar(t)
			.add(from.vertices[i]);

		renderingGeometry.vertices[i].copy(tmp);

	}
	
	renderingGeometry.verticesNeedUpdate = true;
	

}

function render() {

	var timer = Date.now() * 0.0001;

	camera.position.x = Math.cos( timer ) * 800;
	camera.position.z = Math.sin( timer ) * 800;


	t = Date.now() % interval / interval;

	if (last_t > t) {
		current = next;
		next = Math.floor(Math.random() * geometries.length);

	}

	// Tween
	tween(t);

	last_t = t;


	camera.lookAt( scene.position );


	renderer.render( scene, camera );

}
