var _shipMesh;
function doSkyBox(textureName, radius, aSide, material) {
    var skyGeometry = new THREE.SphereGeometry(radius,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture(textureName);
    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: aSide });
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    return skyBox;
}
function doSkyBoxWithShaderMaterial(textureName, radius, aSide, objectCache) {
    var skyGeometry = new THREE.SphereGeometry(radius,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture(textureName);
    var skyMaterial =
                new THREE.ShaderMaterial( {
                    uniforms: {
                        iChannel0: { type: 't', value: texture },
                        iChannelZ: { type: 't', value: objectCache.getService('Guage').getRTTexture() }
                    },
                    vertexShader: SHADERCODE.maskShader_vs(),
                    fragmentShader: SHADERCODE.maskShader_fs(),
                    side: aSide,
                    transparent: true,
                } );
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    _shipMesh = skyBox;     // this may have to go in the objectCache at some point.
    skyGeometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
    skyGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-.1*Math.PI/2));
    return skyBox;
}
var MainScene = function(containingDiv, objectCache, cameraPanel) {
    // a pilot is sitting in the ship. the headCamera is his eyes. He can look around using the mouse.
    // thus the head camera represents which way the pilot is looking. it can turn freely but its position must always
    // equal ship position.
    // the cameraForOrbitControl holds the rotation indicated by the mouse moves. It is not used for rendering.
    // The shipCamera is not used for rendering. It just holds position and rotation info and is used to store
    // where the ship is in space and where it is pointed. It could be used later for rendering maybe.
    // The headCamera is a child of the ship camera. That way its rotation is always relative to the ship!
    // the cameraPanel allows the user to indicate which way the ship is pointing.
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        containingDiv.innerHTML = "No WebGL";
        return;
    }

    var _that = this;
    this._containingDiv = containingDiv;
    var aspectRatio = window.innerWidth/window.innerHeight;
    _that._headCamera = new THREE.PerspectiveCamera( 45, aspectRatio, .1, 20000000 );
    objectCache.ship._camera.add(_that._headCamera);
    _that._cameraForOrbitControl = new THREE.PerspectiveCamera( 75, aspectRatio, .1, 20000000 );
    _that._cameraForOrbitControl.position.set(0,0,1);
    objectCache.controlPanelCamera = _that._cameraForOrbitControl;
    _that._cameraPanel = cameraPanel;
    
    _that._clock = new THREE.Clock();
 
    _that._scene = new THREE.Scene();
    //_that._scene.add(objectCache.ship._mesh);

    _that._renderer =  new THREE.WebGLRenderer({ antialias: true});
    _that._renderer.sortObjects = false;
    _that._renderer.setClearColor( 0x000000 );
	_that._renderer.shadowMapEnabled = true;
	_that._renderer.shadowMapCullFace = THREE.CullFaceBack;

    console.log(window.innerWidth + "," + window.innerHeight);
    _that._renderer.setSize( containingDiv.offsetWidth, containingDiv.offsetHeight );
    _that._containingDiv.innerHTML = "";
    _that._containingDiv.appendChild( _that._renderer.domElement );
    _that._controls = new THREE.OrbitControls( _that._cameraForOrbitControl, _that._containingDiv.domElement );
    _that._controls.keys = {};    // this disable arrow keys which are now used for moving the texture.
    // _that._controls.enableDamping = true;
    // _that._controls.dampingFactor = 0.07;
    _that._controls.rotateSpeed = 0.1;
    _that._controls.minAzimuthAngle = -Math.PI/2;
    _that._controls.maxAzimuthAngle = Math.PI/2;
    // _that._headCamera.lookAt(new THREE.Vector3(0,0,0));
        
    var deepSpace = 100 * AUk;
    console.log('deep space = ' + deepSpace);

    _that._scene.add( doSkyBox('textures/eso_dark.jpg', deepSpace, THREE.BackSide) );
    // _that._scene.add( doSkyBoxWithShaderMaterial('textures/cockpit_orange.jpg', 20, THREE.DoubleSide, objectCache) );
    // _that._scene.add( doSkyBoxWithShaderMaterial('textures/bridge.png', 20, THREE.DoubleSide, objectCache) );
    _that._scene.add( doSkyBoxWithShaderMaterial('textures/Vattalus2048.png', 20, THREE.DoubleSide, objectCache) );
    
    var axisHelper = new THREE.AxisHelper( 500000 );
    // _that._scene.add( axisHelper );

    addPlanets(_that._scene, objectCache);

    var boxMaterial = new THREE.MeshBasicMaterial({map:objectCache.getService('Guage').getRTTexture()});
    // var boxMaterial = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
    var rr = 1;
    var boxGeometry2 = new THREE.BoxGeometry( rr,rr,rr );
    _that._mainBoxObject = new THREE.Mesh(boxGeometry2,boxMaterial);
    // _that._scene.add(_that._mainBoxObject);

    _that._frame = 0;
    this.render = function() {
        _that._frame += .001;
        updatePlanetPhysics(_that._frame, objectCache.dt);
        objectCache.ship._camera.position.set(
            objectCache.ship._mesh.position.x,
            objectCache.ship._mesh.position.y,
            objectCache.ship._mesh.position.z
            );
        objectCache.ship.sendUpdates();     // update guage.
        var status = _that._cameraPanel.lookAtTarget();
        objectCache.ship._camera.rotateX(objectCache.ship._yVelocity);
        objectCache.ship._camera.rotateY(objectCache.ship._xVelocity);
        objectCache.ship._camera.updateMatrixWorld();

        // make sure ship points same direction as ship camera.
        // _shipMesh is a sphere with a texture on it.
        var o1 = objectCache.ship._camera.rotation;
        _shipMesh.rotation.set(o1.x, o1.y, o1.z);
        var o = objectCache.ship._camera.position;
        _shipMesh.position.set(o.x, o.y, o.z);

        _that._mainBoxObject.position.set(o.x,o.y,o.z-10);

        // update head camera.
        _that._controls.update( _that._clock.getDelta() ); 
        _that._headCamera.rotation.copy(_that._cameraForOrbitControl.rotation);

        _that._renderer.render( _that._scene, _that._headCamera);
        _stats.update();
    }
}

