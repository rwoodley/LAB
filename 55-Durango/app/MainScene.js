// the main camera always looks forward.
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
function doSkyBoxWithShaderMaterial(textureName, radius, aSide) {
    var skyGeometry = new THREE.SphereGeometry(radius,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture(textureName);
    var skyMaterial =
                new THREE.ShaderMaterial( {
                    uniforms: {
                        iChannel0:  { type: 't', value: texture }
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

    _that._scene.add( doSkyBox('textures/eso_dark.jpg', deepSpace, THREE.BackSide) );

    _that._scene.add( doSkyBoxWithShaderMaterial('textures/bridge.png', 20, THREE.DoubleSide) );

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
        var o = objectCache.ship._camera.rotation;
        _shipMesh.rotation.set(o.x, o.y, o.z);
        var o = objectCache.ship._camera.position;
        _shipMesh.position.set(o.x, o.y, o.z);

        _that._renderer.render( _that._scene, _that._camera );
        _stats.update();
    }
}

