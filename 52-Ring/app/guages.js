var CameraGuage = function(div, mode, cameraPos) {
    var _that = this;
    this._container = div;
    this._mode = mode;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

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
    
    function init() {
    
        _that._camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
        var axes = new THREE.AxisHelper( 1 );
        _that._scene.add(axes);
        _that._scene.add( new THREE.AmbientLight( 0xaaaaaa ) );

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
            _that._arrowMinusZ = new THREE.ArrowHelper(direction.clone().normalize(), sourcePos, direction.length(), 0x00ffff);
            _that._scene.add(_that._arrowMinusZ);
            _that._arrowPlusX = new THREE.ArrowHelper(direction.clone().normalize(), sourcePos, direction.length(), 0xff0000);
            _that._scene.add(_that._arrowPlusX);
            _that._arrowPlusY = new THREE.ArrowHelper(direction.clone().normalize(), sourcePos, direction.length(), 0x00ff00);
            _that._scene.add(_that._arrowPlusY);
            _that._arrowPlusZ = new THREE.ArrowHelper(direction.clone().normalize(), sourcePos, direction.length(), 0x0000ff);
            _that._scene.add(_that._arrowPlusZ);
        }
    
        _that._container.appendChild( _that._renderer.domElement );

        _that._camera.lookAt(new THREE.Vector3(0,0,0));
        _that._renderer.render( _that._scene, _that._camera );
    
    }
    
    _that._render = function() {
    
        _that._renderer.render( _that._scene, _that._camera );

        if (_that._clientCamera != undefined) {
            _that._arrowMinusZ.setDirection(getDirectionVector(new THREE.Vector3( 0, 0, -1 )));
            _that._arrowPlusZ.setDirection(getDirectionVector(new THREE.Vector3( 0, 0, 1 )));
            _that._arrowPlusY.setDirection(getDirectionVector(new THREE.Vector3( 0, 1, 0 )));
            _that._arrowPlusX.setDirection(getDirectionVector(new THREE.Vector3( 1, 0, 0 )));
        }

    }
    var _radians = 0;
    return {
        render: function() {
            _that._render();
        },
        showArrow: function(camera) {
            _that._clientCamera = camera;
        },
        updatePoint: function(pos) {
        },
        showCameraHelper: function(camera) {
            var cameraHelper = new THREE.CameraHelper(camera);
            _that._scene.add(cameraHelper);
        },
        addMesh: function(mesh) {
            _that._scene.add(mesh);
        }
    }
    function getDirectionVector(vector) {
        // see: http://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector/15697227#15697227
        var pWorld = vector.applyMatrix4( _that._clientCamera.matrixWorld );
        var direction = pWorld.sub( _that._clientCamera.position ).normalize();
        return direction;
    }
}
