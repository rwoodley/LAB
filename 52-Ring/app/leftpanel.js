var LeftPanel = function(div, leftCanvas, cameraPos) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    this._utils = new utils();
    _that._cameraPos = cameraPos;
    _that._renderer2 = null;
    _that._camera2 = null;

    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    _that._scene = new THREE.Scene();
    _that.leftRing = new mersRing(0);
    _that.leftRing.buildRingMesh(_that._scene, false, _paramsSmall, false);

    _that._renderer =  new THREE.WebGLRenderer({antialias: true, alpha: true, canvas: leftCanvas });
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x000000 );
    _that._renderer.autoClear = false;

    _that._camera.position.set(_that._cameraPos.x, _that._cameraPos.y, _that._cameraPos.z);
    _that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    var grid = new THREE.GridHelper(1000, 10);
    grid.setColors(0x222222,0x222222);
    _that._scene.add(grid);
    _that._scene.fog = new THREE.Fog( 0x444, 150.0, 300 );
    
    _that._pointLight = new THREE.PointLight( 0xff0000, 1000, 4);
    _that._pointLight.position.y = 12;
    //_that._scene.add( _that._pointLight );
    
    var geometry = new THREE.SphereGeometry( 2, 32, 32 );
    geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0,0,0) );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, emissive: 0xffffff, side: THREE.DoubleSide} );
    var material2 = new THREE.MeshPhongMaterial( {
            color: 0xffffff,
            emissive: 0x000000,
            specular: 0xff0000,
            shininess: 10,
            shading: THREE.SmoothShading, side: THREE.DoubleSide
             } );
    _that._sphere = new THREE.Mesh( geometry, material2); // new THREE.MeshNormalMaterial() );
    _that._sphere.position.y = _that._pointLight.position.y;
    _that._sphere.position.y = 12;
    _that._sphere.renderOrder = -20;
    _that._scene.add(_that._sphere);

    var dir = new THREE.Vector3( 0, -1, 0 );
    var origin = new THREE.Vector3( 0, -6, 0 );
    var length = 4;
    var hex = 0xffffff;
    
    //_that._pointLight.add(sphere);
    var spotLight = new THREE.SpotLight( 0xffffff );
    _that._scene.add(spotLight);
    spotLight.position.set(40,50,-180 );
    //_that._container.appendChild( _that._renderer.domElement );

    _that._camera.lookAt(new THREE.Vector3(0,0,0));
    //_that._renderer.render( _that._scene, _that._camera );
    _that.render =  function(lightPosition) {
            //_that.pointLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
            _that._renderer.render( _that._scene, _that._camera );
            //_that._renderer.clearDepth();
            //_that._renderer.render(_that._scene2, _that._camera2);
        };
    _that.showCameraHelper = function(camera) {
            var cameraHelper = new THREE.CameraHelper(camera);
            _that._scene.add(cameraHelper);
        };
    _that.listener =  function(radians) {
            var radius =  _paramsSmall.innerRadius + 2.3*(_paramsSmall.outerLowerRadius - _paramsSmall.innerRadius)/2.0;
            _that._utils.setPositionForRadiansRadius(_that._pointLight, radians, radius*.90);
            _that._utils.setPositionForRadiansRadius(_that._sphere, radians, radius*.8);
            _that.leftRing.listener(radians);
        };
}
