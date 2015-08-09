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
    plutoTexture = THREE.ImageUtils.loadTexture('textures/ganymede.jpg');
    var plutoMaterial = new THREE.MeshBasicMaterial({map: plutoTexture, side: THREE.DoubleSide });
    var plutoMesh = new THREE.Mesh( plutoGeometry, plutoMaterial );
    plutoMesh.position.set(AUm * 40,0,0);
    _that._scene.add(plutoMesh);
    objectCache.plutoMesh = plutoMesh;

    var radiusNeptune = 1236/AUm;
    var neptuneGeometry = new THREE.SphereGeometry( radiusPluto * 2, 32, 32 );
    neptuneTexture = THREE.ImageUtils.loadTexture('textures/pluto.jpg');
    var neptuneMaterial = new THREE.MeshBasicMaterial({map: neptuneTexture, side: THREE.DoubleSide });
    var neptuneMesh = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
    neptuneMesh.position.set(AUm * 40.5,2.5,0);
    _that._scene.add(neptuneMesh);
    objectCache.neptuneMesh = neptuneMesh;
    
    _that._physics = new engine();
    // positions, everything is in AUm/Divisor
    var ff = AUDivisor/AUm;      // fudge factor
    _that._physics.addPlanet({
        'name': 'pluto',
        'mass': 1e20,   // in units of earth. should really be 333,000
        'radius': 2440000,
        'pos': new Cart3(-57900000000, 0, 0),
//        'pos': new Cart3(plutoMesh.position.x*ff,plutoMesh.position.y*ff,plutoMesh.position.z*ff)        
    });
    _that._physics.addPlanet({
        'name': 'neptune',
        'mass': 1.989e30,   // in units of earth. should really be 333,000
        'radius': 2440000,
        'pos': new Cart3(0, 0, 0),
//        'pos': new Cart3(neptuneMesh.position.x*ff,neptuneMesh.position.y*ff,neptuneMesh.position.z*ff)        
    });



    var spotLight = new THREE.SpotLight( 0xaaaa00 );
    spotLight.position.set( 0, 0, 0 );
    _that._scene.add(spotLight);

    _that._renderer.render( _that._scene, _that._camera );
    _that._frame = 0;
    this.render = function() {
        _that._frame += .001;
        _that._physics.updateObjects(_that._frame);
        var ff = 1e12;
        for (var i = 0; i < 2; i++)
            console.log(_that._physics.planets[i].pos.x/ff,_that._physics.planets[i].pos.y/ff,_that._physics.planets[i].pos.z/ff);
        var ff2 = ff/900;
        objectCache.neptuneMesh.position.set(
            _that._physics.planets[0].pos.x/ff2 + objectCache.plutoMesh.position.x,
            _that._physics.planets[0].pos.y/ff2 + objectCache.plutoMesh.position.y,
            _that._physics.planets[0].pos.z/ff2 + objectCache.plutoMesh.position.z
            );
        //_that._controls.update( _that._clock.getDelta() );
        _that._renderer.render( _that._scene, _that._camera );

    }
}

