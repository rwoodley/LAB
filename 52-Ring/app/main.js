var MainApp = function(div) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    this._composer = null;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    _that._scene = new THREE.Scene();

    _that._camera.position.x = 100; _that._camera.position.y = 10; _that._camera.position.z = 0;

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
    
    _that._leftRing = new mersRing(0);
    _that._rightRing = new mersRing(1);
    this._leftPanel = new LeftPanel(document.getElementById('container2'), new THREE.Vector3(90, 50, 0));
    _that._leftPanel.addMesh(_that._leftRing.buildRingMesh);
    _that._rightRing.buildRingMesh(_that._scene, false, _paramsBig, true);
    this._navigator = new cameraNavigator(_that._camera, _that._leftPanel.listener, _that._leftRing.listener);

    var grid = new THREE.GridHelper(1000, 10);
    grid.setColors('red',0xbbbbbb);
    _that._scene.add(grid);       

    _that._scene.fog = new THREE.Fog( 0x444, 10.0, 100 );

    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 180, 160, 0 );
    _that._scene.add(spotLight);
    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( -80, 160, 0 );
    _that._scene.add(spotLight);
        
    _that._renderer.render( _that._scene, _that._camera );

    animate();

    function animate() {
        requestAnimationFrame( animate );    
        render();
    }
    var _tick = 0;
    function render() {
        _that._renderer.render( _that._scene, _that._camera );
        _that._leftPanel.render(_that._camera.position);
        if (_that._composer != null)
            _that._composer.render();
        renderMaterials(_that._clock.getDelta());
    }
}