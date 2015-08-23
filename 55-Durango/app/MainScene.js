// the main camera always looks forward.
// 
var MainScene = function(containingDiv, canvas, camera, objectCache) {
    var _that = this;
    this._containingDiv = containingDiv;
    _that._camera = camera;
    
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._containingDiv );

    _that._scene = new THREE.Scene();
    //_that._scene.add(objectCache.ship._mesh);

    _that._renderer =  new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    _that._renderer.sortObjects = false;
    _that._renderer.setClearColor( 0x0000ff );
	_that._renderer.shadowMapEnabled = true;
	_that._renderer.shadowMapCullFace = THREE.CullFaceBack;

    console.log(window.innerWidth + "," + window.innerHeight);
    _that._renderer.setSize( containingDiv.offsetWidth, containingDiv.offsetHeight );
    _that._containingDiv.innerHTML = "";
    _that._containingDiv.appendChild( _that._renderer.domElement );
    
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        containingDiv.innerHTML = "No WebGL";
        return;
    }
    
    var deepSpace = 100 * AUk;
    console.log('deep space = ' + deepSpace);
    var skyGeometry = new THREE.SphereGeometry(deepSpace,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture('textures/eso_dark.jpg');
    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    _that._scene.add( skyBox );

    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 0, 0, 0 );
    _that._scene.add(spotLight);

    addPlanets(_that._scene, objectCache);
    
    _that._renderer.render( _that._scene, _that._camera );
    _that._frame = 0;
    this.render = function() {
        _that._frame += .001;
        updatePlanetPhysics(_that._frame);
        objectCache.ship._camera.position.set(
            objectCache.ship._mesh.position.x,
            objectCache.ship._mesh.position.y,
            objectCache.ship._mesh.position.z
            );
        objectCache.ship.sendUpdates();     // update guage.
        objectCache.ship._camera.lookAt(objectCache.plutoMesh.position);
        _that._renderer.render( _that._scene, _that._camera );
    }
}

