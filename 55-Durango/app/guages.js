var CameraGuage = function(div, locator) {
    var _that = this;
    _that._locator = locator;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    _that._scene = new THREE.Scene();

    _that._renderer =  new THREE.WebGLRenderer();
    var border = getComputedStyle(div).getPropertyValue('border-width').replace('px','');
    console.log(border);
    _that._renderer.setSize( _that._width-border*2, _that._height-border*2 );
    _that._renderer.setClearColor( 0x000000 );

    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }

    _that._camera.position.set(1.3,1.3,1.3);
    var axes = new THREE.AxisHelper( 1 );
    _that._scene.add(axes);
    
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

    _that._container.appendChild( _that._renderer.domElement );

    _that._camera.lookAt(new THREE.Vector3(0,0,0));
    _that._renderer.render( _that._scene, _that._camera );
    
    this.animate = function() {
    
        requestAnimationFrame( _that.animate );
        _that._render();
    }
    _that._render = function() {
    
        if (_that._position != undefined && _that._matrixWorld != undefined) {
            _that._arrowMinusZ.setDirection(getDirectionVector(new THREE.Vector3( 0, 0, -1 )));
            _that._arrowPlusZ.setDirection(getDirectionVector(new THREE.Vector3( 0, 0, 1 )));
            _that._arrowPlusY.setDirection(getDirectionVector(new THREE.Vector3( 0, 1, 0 )));
            _that._arrowPlusX.setDirection(getDirectionVector(new THREE.Vector3( 1, 0, 0 )));
        }
        _that._renderer.render( _that._scene, _that._camera );

    }
    this.updatePanel = function(orientation) {
        _that._matrixWorld = orientation['MatrixWorld'];
        _that._position = orientation['Position'];
        _that._render();
    }
    function getDirectionVector(vector) {
        // see: http://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector/15697227#15697227
        var pWorld = vector.applyMatrix4( _that._matrixWorld );
        var direction = pWorld.sub( _that._position ).normalize();
        return direction;
    }
    this._locator.getService('Ship').addListener('Orientation', this.updatePanel);
    _that.animate();
}
