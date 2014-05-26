var SCREEN_WIDTH = window.innerWidth - 100;
var SCREEN_HEIGHT = window.innerHeight - 100;

var camera, scene;
var canvasRenderer, webglRenderer;

var container, mesh, geometry, floor;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 200;
    camera.lookAt({x: 0,y: 0,z: 0});

    scene = new THREE.Scene();

	//var floorTexture = new THREE.ImageUtils.loadTexture( 'textures/checkerboard.jpg' );
	//floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	//floorTexture.repeat.set( 10, 10 );
	//// Note the change to Lambert material.
	//var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide } );

//	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
//        var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side:THREE.DoubleSide  });
//	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
//	floor.position.y = -0.5;
//	floor.rotation.x = Math.PI / 2;
//	// Note the mesh is flagged to receive shadows
//	floor.receiveShadow = true;
//	scene.add(floor);

    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side:THREE.DoubleSide  });
    floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000,10,10), floorMaterial);
    //var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    //var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side:THREE.DoubleSide  });
    //floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -0;
    floor.receiveShadow = true;
    scene.add(floor);

    var light;
    light = new THREE.SpotLight(0x008888);
    light.position.set(0, 40, 0);
    light.lookAt(floor);
    light.angle = Math.PI/16;
    light.intensity = 30;
    light.distance=0;
    scene.add(light);
        
    // RENDERER
    webglRenderer = new THREE.WebGLRenderer();
    webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    webglRenderer.domElement.style.position = "relative";

    container.appendChild(webglRenderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    webglRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.lookAt(scene.position);
    webglRenderer.render(scene, camera);
}