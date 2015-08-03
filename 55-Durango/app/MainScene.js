// the main camera always looks forward.
// 
var MainScene = function(containingDiv, canvas, camera, objectCache) {
    var _that = this;
    this._containingDiv = containingDiv;
    _that._camera = camera;
    
    _that._clock = new THREE.Clock();
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._containingDiv );

    _that._scene = new THREE.Scene();

    _that._renderer =  new THREE.WebGLRenderer({antialias: true, canvas: canvas});
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
    
    var axes = new THREE.AxisHelper( 1 );
    _that._scene.add(axes);
    
    var grid = new THREE.GridHelper(1000, 10);
    grid.setColors('red',0xbbbbbb);
    //_that._scene.add(grid);       

    var deepSpace = 100 * AUm;
    console.log('deep space = ' + deepSpace);
    var skyGeometry = new THREE.SphereGeometry(deepSpace,50,50);
    var texture;
    texture = THREE.ImageUtils.loadTexture('textures/eso_dark.jpg');
    var skyMaterial = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide });
    var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.set(0,0,0);
    skyBox.rotation.x = Math.PI/4;
    _that._scene.add( skyBox );

    var radiusPluto = 736/AUm;
    var plutoGeometry = new THREE.SphereGeometry( radiusPluto * 2, 32, 32 );
    var material = new THREE.MeshNormalMaterial();
    var plutoMesh = new THREE.Mesh( plutoGeometry, material );
    plutoMesh.position.set(AUm * 40,0,0);
    console.log(plutoMesh.position);
    _that._scene.add(plutoMesh);
    objectCache.plutoMesh = plutoMesh;

    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 180, 160, 0 );
    _that._scene.add(spotLight);
    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( -80, 160, 0 );
    _that._scene.add(spotLight);

    _that._renderer.render( _that._scene, _that._camera );
    this.render = function() {
    
        //_that._controls.update( _that._clock.getDelta() );
        _that._renderer.render( _that._scene, _that._camera );

    }
}

