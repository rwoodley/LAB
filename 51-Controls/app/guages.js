var CameraGuage = function(div, mode, cameraPos) {
    var _that = this;
    this._container = div;
    this._mode = mode;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    _that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    _that._scene = new THREE.Scene();

    _that._renderer =  new THREE.WebGLRenderer();
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x000000 );

    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    init();
    //animate();
    
    function init() {
    
        _that._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        var axes = new THREE.AxisHelper( 1 );
        _that._scene.add(axes);
        
        if (_that._mode == 2) {
            var geometry = new THREE.SphereGeometry(2,16,16);
            var material = new THREE.MeshBasicMaterial({ wireframe: true, color: 'orange'});
            _that._sphere = new THREE.Mesh(geometry, material);
            //_that._scene.add(_that._sphere);
        }        
        if (_that._mode == 1) {
            var sourcePos = new THREE.Vector3(0, 0, 0);
            var targetPos = new THREE.Vector3(1, 1, 0);
            var direction = new THREE.Vector3().subVectors(targetPos, sourcePos);
            _that._arrow = new THREE.ArrowHelper(direction.clone().normalize(), sourcePos, direction.length(), 0x00ffff);
            _that._scene.add(_that._arrow);
        }
        //var grid = new THREE.GridHelper(5, .4);
        //_that._scene.add(grid);       
    
        _that._container.appendChild( _that._renderer.domElement );

        _that._camera.lookAt(new THREE.Vector3(0,0,0));
        _that._renderer.render( _that._scene, _that._camera );
    
    }
    
    function animate() {
        requestAnimationFrame( animate );    
        render();
    }
    
    function render() {
    
        _that._renderer.render( _that._scene, _that._camera );
        _that._camera.lookAt(new THREE.Vector3(0,0,0));
        //rotateCameraY(.02);
    }
    var _radians = 0;
    function rotateCameraY(radians) {
        var x = _that._camera.position.x;	var y = _that._camera.position.y;	var z = _that._camera.position.z;
        var signx = x > 0 ? 1 : -1;
    
        // get current radians from z and x coords.
        _radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
        if (signx == -1) _radians += Math.PI;
    
        _radians += radians;
        if (_radians > Math.PI*2) _radians = _radians%(Math.PI*2);
        while (_radians < 0) _radians += Math.PI*2;
    
        //console.log( _radians);
    
        var radius = Math.sqrt(x*x + z*z);
        _that._camera.position.x = radius * Math.cos(_radians);
        _that._camera.position.z = radius * Math.sin(_radians);
        //__that._camera.position.y = 4;
    }
    return {
        updateArrow: function(direction) {
            _that._arrow.setDirection(direction.normalize());
            render();
        },
        updatePoint: function(pos) {
            //_that._sphere.position.set(pos.x, pos.y, pos.z);
            render();
        },
        showCameraHelper: function(camera) {
            var cameraHelper = new THREE.CameraHelper(camera);
            _that._scene.add(cameraHelper);
        },
        addMesh: function(mesh) {
            _that._scene.add(mesh);
        }
    }
}