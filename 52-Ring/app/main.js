var MainApp = function(div, angleGuage, positionGuage) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    this._composer = null;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    this._angleGuage = angleGuage;
    this._angleGuage.showArrow(_that._camera);
    this._positionGuage = positionGuage;
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    _that._scene = new THREE.Scene();
    var pointLight = new THREE.PointLight( 0xaaaaaa, 1, 100 );
    this._scene.add( pointLight );

    //_that._camera.position.x = -11; _that._camera.position.y = -110; _that._camera.position.z = 282;
    //_that._camera.rotateX(-1.63); _that._camera.rotateY(1); _that._camera.rotateZ(1.65);
    //_that._camera.rotateY( Math.PI/2);
    //_that._camera.lookAt(new THREE.Vector3(0,0,0));

    //var jellyGoggles = new THREE.Mesh( new THREE.PlaneGeometry( 10, 10 ),
    //                           new THREE.MeshBasicMaterial( { color: 'red', opacity: .5, transparent: true } ) );
    _that._goggleMaterial = getShaderMaterialByName('Shader2');
    var jellyGoggles = new THREE.Mesh( new THREE.SphereGeometry( 2, 32, 32 ),
            _that._goggleMaterial);
            //new THREE.MeshNormalMaterial({side: THREE.DoubleSide}));
              //new THREE.MeshBasicMaterial( {side: THREE.DoubleSide, color: 'red', opacity: .5, transparent: true } ) );
    _that._scene.add(jellyGoggles);
    
    _that._camera.position.x = 40; _that._camera.position.y = 10; _that._camera.position.z = 0;
    this._navigator = new cameraNavigator(_that._camera, pointLight, jellyGoggles);

    _that._renderer =  new THREE.WebGLRenderer({antialias: true});
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x000000 );
    _that._container.appendChild( _that._renderer.domElement );
	_that._renderer.shadowMapEnabled = true;
	_that._renderer.shadowMapCullFace = THREE.CullFaceBack;        
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    init();
    animate();
    
    function init() {
    
        var axes = new THREE.AxisHelper( 1 );
        _that._scene.add(axes);
        
        _that._positionGuage.addMesh(buildRingMesh);
        buildRingMesh(_that._scene);

        var grid = new THREE.GridHelper(100, 10);
        _that._scene.add(grid);       

        _that._positionGuage.showCameraHelper(_that._camera);
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ),
                                   new THREE.MeshBasicMaterial( { color: 0xaaaaaa } ) );
        plane.receiveShadow = true;
        //_that._scene.fog = new THREE.Fog( 0xffffff, .10, 100 );
    	_that._scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
        _that._scene.add(shadowLighting(plane));

        plane.rotation.x = -1.57;
        plane.position.y = -20;
        _that._scene.add( plane );
        //postProcessing();
        //_that._composer = setupShaderDotScreen( _that._renderer, _that._scene, _that._camera);
        _that._renderer.render( _that._scene, _that._camera );


    }
    function shadowLighting(floor) {
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight( 0xff0000 );
        spotLight.position.set( -40, 60, -10 );
        spotLight.castShadow = true;
        spotLight.shadowCameraVisible = true;
        spotLight.angle = 2.0;
        //spotLight.intensity = 30;
        spotLight.distance=400;
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 300;
        spotLight.shadowCameraFov = 500;
        spotLight.shadowDarkness = 1;
        spotLight.shadowMapWidth = 2048;
        spotLight.shadowMapHeight = 2048;
        spotLight.target = floor;
        return spotLight;
    }
    function postProcessing() {
        _that._renderer.autoClear = false;
        
        var renderModel = new THREE.RenderPass( _that._scene, _that._camera );
        var effectBloom = new THREE.BloomPass( 0.25 );
        var effectFilm = new THREE.FilmPass( 0.5, 0.125, 2048, false );
        
        effectFilm.renderToScreen = true;
        
        _that._composer = new THREE.EffectComposer( _that._renderer );
        
        _that._composer.addPass( renderModel );
        //_that._composer.addPass( effectBloom );
        _that._composer.addPass( effectFilm );
    }
    function animate() {
        requestAnimationFrame( animate );    
        render();
    }
    var _tick = 0;
    function render() {
        _that._renderer.render( _that._scene, _that._camera );
        _that._angleGuage.render();
        _that._positionGuage.render();
        if (_that._composer != null)
            _that._composer.render();
        document.getElementById('text1').innerHTML = "<nobr>("
                + Math.floor(_that._camera.position.x) + ","
                + Math.floor(_that._camera.position.y) + ","
                + Math.floor(_that._camera.position.z) + ")</nobr>" ;
        renderMaterials(_that._clock.getDelta());
        _that._goggleMaterial.uniforms.time.value += _that._clock.getDelta();
//        _that.uniforms.time.value += 1;
//        _that._watermesh.material.uniforms.time.value += _that._clock.getDelta();
    }
}