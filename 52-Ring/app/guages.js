var CameraGuage = function(div, cameraPos) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;

    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    init();
    
    function init() {
        _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    
    
        _that._scene = new THREE.Scene();
    
        _that._renderer =  new THREE.WebGLRenderer({antialias: true});
        _that._renderer.setSize( _that._width, _that._height );
        _that._renderer.setClearColor( 0x000000 );
    
        _that._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        _that._controls = new THREE.OrbitControls( _that._camera, _that._container );

        var spotLight = new THREE.SpotLight( 0xaaaa00 );
        spotLight.position.set( 180, 160, 0 );
        //_that._scene.add(spotLight);
        var spotLight = new THREE.SpotLight( 0xaaaa00 );
        spotLight.position.set( -80, 160, 0 );
        //_that._scene.add(spotLight);
        var grid = new THREE.GridHelper(1000, 10);
        _that._scene.add(grid);       
        _that._scene.fog = new THREE.Fog( 0x444, 150.0, 300 );
        
        
        _that._pointLight = new THREE.PointLight( 0xfff, 1000, 0 );
        _that._scene.add( _that._pointLight );
        var pointLightHelper = new THREE.PointLightHelper(_that._pointLight, 1);
        _that._scene.add( pointLightHelper );

        _that._container.appendChild( _that._renderer.domElement );

        _that._camera.lookAt(new THREE.Vector3(0,0,0));
        _that._renderer.render( _that._scene, _that._camera );
    }
    return {
        render: function(lightPosition) {
            //_that.pointLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
            _that._renderer.render( _that._scene, _that._camera );
        },
        showCameraHelper: function(camera) {
            var cameraHelper = new THREE.CameraHelper(camera);
            _that._scene.add(cameraHelper);
        },
        addMesh: function(callback) {
            callback(_that._scene, false, _paramsSmall);
        },
        getPointLight: function() {
            return _that._pointLight;
        }
    }
}
