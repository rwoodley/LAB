// the main camera always looks forward.
// 
var MainScene = function(containingDiv, canvas, camera, objectCache, cameraPanel) {
    var _that = this;
    this._containingDiv = containingDiv;
    _that._camera = camera;
    _that._cameraPanel = cameraPanel;
    
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._containingDiv );

    _that._scene = new THREE.Scene();
    //_that._scene.add(objectCache.ship._mesh);

    _that._renderer =  new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas});
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
    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.BackSide });
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    _that._scene.add( skyBox );
    var axisHelper = new THREE.AxisHelper( 500000 );
    _that._scene.add( axisHelper );

    addPlanets(_that._scene, objectCache);

    _that._renderer.render( _that._scene, _that._camera );
    _that._frame = 0;
    this.render = function() {
        _that._frame += .001;
        //if (_that._frame < 0.010) {
            updatePlanetPhysics(_that._frame, objectCache.dt);
            objectCache.ship._camera.position.set(
                objectCache.ship._mesh.position.x,
                objectCache.ship._mesh.position.y,
                objectCache.ship._mesh.position.z
                );
            objectCache.ship.sendUpdates();     // update guage.
        //}
        _that._cameraPanel.lookAtTarget();
        // objectCache.ship._camera.lookAt(objectCache.plutoMesh.position);
        objectCache.ship._camera.rotateX(objectCache.ship._yVelocity);
        objectCache.ship._camera.rotateY(objectCache.ship._xVelocity);
        _that._renderer.render( _that._scene, _that._camera );
                _stats.update();
    }
}

