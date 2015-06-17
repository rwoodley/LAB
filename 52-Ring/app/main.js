var MainApp = function(div, positionGuage) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    this._composer = null;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    this._positionGuage = positionGuage;
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    _that._scene = new THREE.Scene();

    _that._camera.position.x = 100; _that._camera.position.y = 10; _that._camera.position.z = 0;
    this._navigator = new cameraNavigator(_that._camera, positionGuage.getPointLight());

    _that._renderer =  new THREE.WebGLRenderer({antialias: true});
    _that._renderer.sortObjects = false;
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
    
    var axes = new THREE.AxisHelper( 1 );
    _that._scene.add(axes);
    
    _that._positionGuage.addMesh(buildRingMesh);
    buildRingMesh(_that._scene, false, _paramsBig, true);

    var grid = new THREE.GridHelper(1000, 10);
    _that._scene.add(grid);       

    _that._scene.fog = new THREE.Fog( 0x444, 10.0, 100 );

    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 180, 160, 0 );
    _that._scene.add(spotLight);
    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( -80, 160, 0 );
    _that._scene.add(spotLight);
        
    //postProcessing();
    //_that._composer = setupShaderDotScreen( _that._renderer, _that._scene, _that._camera);
    _that._renderer.render( _that._scene, _that._camera );

    animate();

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
        _that._positionGuage.render(_that._camera.position);
        if (_that._composer != null)
            _that._composer.render();
        renderMaterials(_that._clock.getDelta());
    }
}