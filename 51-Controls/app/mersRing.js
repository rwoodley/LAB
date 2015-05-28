var MersRing = function(div, angleGuage, positionGuage) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    
 
    this._angleGuage = angleGuage;
    this._angleGuage.showArrow(_that._camera);
    this._positionGuage = positionGuage;
    this._navigator = new cameraNavigator(_that._camera);
    
    _that._scene = new THREE.Scene();

    _that._renderer =  new THREE.WebGLRenderer();
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x000000 );
    _that._container.appendChild( _that._renderer.domElement );
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    init();
    animate();
    
    function init() {
    
        _that._camera.position.x = 30; _that._camera.position.y = 3; _that._camera.position.z = 3;
        var axes = new THREE.AxisHelper( 1 );
        _that._scene.add(axes);
        
        _that._positionGuage.addMesh(buildRingMesh());
        _that._scene.add(buildRingMesh());

        var grid = new THREE.GridHelper(100, 10);
        _that._scene.add(grid);       

        _that._camera.lookAt(new THREE.Vector3(0,0,0));
        _that._positionGuage.showCameraHelper(_that._camera);
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ),
                                   new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } ) );

        _that._scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
        
        var dirLight = new THREE.DirectionalLight( 0xff0000, 0.125 );
        dirLight.position.set( 0, 0, 1 );
        dirLight.position.normalize();
        _that._scene.add( dirLight );

        plane.rotation.x = -1.57;
        plane.position.y = -20;
        _that._scene.add( plane );
        _that._renderer.render( _that._scene, _that._camera );
    }
    function buildRingMesh() {
        var pts = [
                    new THREE.Vector3(15,0,5),//top left
                    new THREE.Vector3(20,0,5),//top right
                    new THREE.Vector3(20,0,-5),//bottom right
                    new THREE.Vector3(15,0,-5),//bottom left
                    new THREE.Vector3(15,0,5)//back to top left - close square path
                   ];
        var geometry = new THREE.LatheGeometry( pts, 64 )
        var material = new THREE.MeshNormalMaterial();
        material.side = THREE.DoubleSide;
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    function animate() {
        requestAnimationFrame( animate );    
        render();
    }
    function render() {
    
        _that._renderer.render( _that._scene, _that._camera );
        _that._angleGuage.render();
        _that._positionGuage.render();
        

    }
}
