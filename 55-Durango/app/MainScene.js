// the main camera always looks forward.
// 
var MainScene = function(containingDiv, canvas, camera) {
    var _that = this;
    this._containingDiv = containingDiv;
    this._width = this._containingDiv.offsetWidth;
    this._height = this._containingDiv.offsetHeight;
    //_that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    
    _that._camera = camera;
    
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._containingDiv );

    _that._scene = new THREE.Scene();

    _that._camera.position.x = 100; _that._camera.position.y = 10; _that._camera.position.z = 0;

    _that._renderer =  new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    _that._renderer.sortObjects = false;
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x0000ff );
	_that._renderer.shadowMapEnabled = true;
	_that._renderer.shadowMapCullFace = THREE.CullFaceBack;        
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        containingDiv.innerHTML = "No WebGL";
        return;
    }
    
    var axes = new THREE.AxisHelper( 1 );
    _that._scene.add(axes);
    
    var grid = new THREE.GridHelper(1000, 10);
    grid.setColors('red',0xbbbbbb);
    _that._scene.add(grid);       

    var skyGeometry = new THREE.SphereGeometry(5000,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture('textures/eso_dark.jpg');
    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    _that._scene.add( skyBox );


    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 180, 160, 0 );
    _that._scene.add(spotLight);
    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( -80, 160, 0 );
    _that._scene.add(spotLight);
        
    _that._renderer.render( _that._scene, _that._camera );
    this.animate = function() {
    
        requestAnimationFrame( _that.animate );
    
        _that.render();
    }
    this.render = function() {
    
        //_that._controls.update( _that._clock.getDelta() );
        _that._renderer.render( _that._scene, _that._camera );

    }
    _that.animate();
}

