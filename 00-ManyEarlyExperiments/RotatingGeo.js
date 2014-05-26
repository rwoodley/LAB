var SCREEN_WIDTH = window.innerWidth - 100;
var SCREEN_HEIGHT = window.innerHeight - 100;

var camera, scene, paramGeoMesh;
var canvasRenderer, webglRenderer;

var container, mesh, geometry, floor;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  func = function(u,v) {
      var theta = u * 2 * Math.PI;
      var radius = v * 2;
      var zdelta = 0;
      if (radius > 1) {
        radius = 2 - radius;
        zdelta = 0.01;
      }
      
      var x = radius*Math.cos(theta);
      var y = radius*Math.sin(theta);
      var z = zdelta + (2*x*x + 1.5*y*y)/1.5;
      
      var scale = 16;
      return new THREE.Vector3(x*scale, z*scale, y*scale);
  }

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.x = 100;
    camera.position.y = 100;
    camera.position.z = 200;
    camera.lookAt({x: 0,y: 0,z: 0});

    scene = new THREE.Scene();

    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side:THREE.DoubleSide  });
    floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    floor.position.y = -40;
    floor.receiveShadow = true;
    scene.add(floor);

    var light;
    light = new THREE.SpotLight(0x008888);
    light.position.set(0, 40, 0);
    light.castShadow = true;
    light.shadowCameraVisible = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    light.lookAt(floor);    
    light.castShadow = true;
    light.angle = Math.PI/4;
    light.intensity = 30;
    light.distance=0;
    light.shadowCameraNear = 2;
    light.shadowCameraFar = 90;
    light.shadowCameraFov = 60;
    light.shadowDarkness = 1;
    light.shadowCameraVisible = true;
    scene.add(light);
    
    var paramGeo = new THREE.ParametricGeometry(func, 60, 60, false);
    var paramMat = new THREE.MeshLambertMaterial( { color: 0x0000aa, side:THREE.DoubleSide } );
    paramGeoMesh = new THREE.Mesh(paramGeo, paramMat  );
    paramGeoMesh.castShadow = true;
    scene.add( paramGeoMesh );
    
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
    paramGeoMesh.rotation.x += 0.04;
    camera.lookAt(scene.position);
    webglRenderer.render(scene, camera);
}