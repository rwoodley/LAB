var SCREEN_WIDTH = window.innerWidth - 100;
var SCREEN_HEIGHT = window.innerHeight - 100;

var camera, scene, _planeMesh;
var canvasRenderer, webglRenderer;

var container, mesh, geometry, plane;

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


	var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
    
    var groundMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff, side:THREE.DoubleSide 
    });
    plane = new THREE.Mesh(new THREE.PlaneGeometry(2000,2000,10,10), groundMaterial);
	plane.rotation.x = Math.PI / 2;
    plane.position.y = -40;
    plane.receiveShadow = true;

    scene.add(plane);

    // LIGHTS
    //scene.add(new THREE.AmbientLight(0x660000));

    var light;

    light = new THREE.SpotLight(0x00aaaa);
    light.position.set(0, 40, 0);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.lookAt(plane);    
    light.castShadow = true;
    light.angle = .45;
    light.intensity = 30;
    light.distance=0;
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 100;
    light.shadowCameraFov = 100;
    light.shadowDarkness = 1;
    light.shadowCameraVisible = true;
    scene.add(light);

    var planeGeo = new THREE.PlaneGeometry(20,20,20,20)
    _planeMesh = new THREE.Mesh(planeGeo, new THREE.MeshLambertMaterial( { color: 0xff00aa, side:THREE.DoubleSide } ) );
    _planeMesh.castShadow = true;
    scene.add( _planeMesh );
    

    // RENDERER
    webglRenderer = new THREE.WebGLRenderer();
    webglRenderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    webglRenderer.domElement.style.position = "relative";
    webglRenderer.shadowMapEnabled = true;
    webglRenderer.shadowMapSoft = true;

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
        _planeMesh.rotation.x += 0.04;
    camera.lookAt(scene.position);
    webglRenderer.render(scene, camera);
}