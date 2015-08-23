// This really is any kind of orbital object, not just planets.
// it could be a satellite.
// Units are:
// Mass: kg
// Distance: m
// the physics engine updates the position and velocity of the objects
// This wraps the physics engine. 
var _planets = [];
var _physics;
function updatePlanetPhysics(frame) {
    var dt = 112;
    //var dt = 60;
    for (var i = 0; i < _planets.length; i++) {
        for (var j = 0; j < _planets.length; j++) {
            if (i != j && _planets[i].mass < _planets[j].mass*100) 
                _physics.updateOrbit(_planets[i], _planets[j], dt, 0);
        }
    }
    for (var i = 0; i < _planets.length; i++) {
        _planets[i].updateMeshPosition();
    }
}
function addPlanets(scene, objectCache) {
    var radiusPluto = 1186; // km
    var plutoGeometry = new THREE.SphereGeometry( radiusPluto, 32, 32 );
    plutoTexture = THREE.ImageUtils.loadTexture('textures/pluto.jpg');
    var plutoMaterial = new THREE.MeshBasicMaterial({map: plutoTexture, side: THREE.DoubleSide });
    var plutoMesh = new THREE.Mesh( plutoGeometry, plutoMaterial );
    scene.add(plutoMesh);
    objectCache.plutoMesh = plutoMesh;

    var radiusNeptune = 635;    // km
    var neptuneGeometry = new THREE.SphereGeometry( radiusPluto, 32, 32 );
    neptuneTexture = THREE.ImageUtils.loadTexture('textures/ganymede.jpg');
    var neptuneMaterial = new THREE.MeshBasicMaterial({map: neptuneTexture, side: THREE.DoubleSide });
    var neptuneMesh = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
    scene.add(neptuneMesh);
    objectCache.neptuneMesh = neptuneMesh;
    
    _planets.push(new Planet({
        'name': 'charon',
        'mass': 2*1.52e21,
        'radius': 1000 * 1000,
        'startPosition': new Cart3(19640 * 1000, 0, 0),
        'startVelocity': new Cart3(0, 0, 300),
        'mesh': neptuneMesh
    }));
    _planets.push(new Planet({
        'name': 'pluto',
        'mass': 2*1.27e22,
        'radius': 1137 * 1000,
        'startPosition': new Cart3(0, 0, 0),
        'startVelocity': new Cart3(0, 0, -37),
        'mesh': plutoMesh
    }));
    var shipPlanet = new Planet({
        'name': 'ship',
        'mass': 1*1e18,
        'radius': 11 * 1000,
        'startPosition': new Cart3(0, 40000*1000,  0),
        'startVelocity': new Cart3(0, 0, 1),
        'mesh': objectCache.ship._mesh
    });
    _planets.push(shipPlanet);
    objectCache.shipPlanet = shipPlanet;
    _physics = new engine(_planets);
//    var v = _physics.getRelativeVelocity(_planets[0], _planets[1]);
//    //_planets[0].velocity = new Cart3(0,0,v);
    //v = _physics.getRelativeVelocity(_planets[1], _planets[0]);
    //_planets[1].velocity = new Cart3(0,0,v);
//    v = _physics.getRelativeVelocity(_planets[2], _planets[0]);
//    //_planets[2].velocity = new Cart3(0,0,-v);
}
var Planet = function(obj) {
    var self = this;
    // in real space
    self.name = obj.name;
    self.mass = obj.mass;
    self.radius = obj.radius;
    self.position = obj.startPosition;  // a Cart3
    self.velocity = obj.startVelocity;   // a Cart3
    self.mesh = obj.mesh;
    self.updateMeshPosition = function() {
        // The origin of physics space is not be the origin of three.js space!
        // _physicsOriginInThreeJSSpace handles this.
        // Physics deals in meters and KG. This is fine for short distances, but
        // three.js space (for us) is modeling larger differences (sun to pluto), so
        // we don't want to use meters.
        var _physicsOriginInThreeJSSpace = new Cart3(0, 0, 0);  // put at zero to avoid rounding errors
        var _scaleAdjustment = 1000.0;    // convert from m to km.
        self.mesh.position.set(
            self.position.x/_scaleAdjustment + _physicsOriginInThreeJSSpace.x,
            self.position.y/_scaleAdjustment + _physicsOriginInThreeJSSpace.y,
            self.position.z/_scaleAdjustment + _physicsOriginInThreeJSSpace.z
        );
    }
}