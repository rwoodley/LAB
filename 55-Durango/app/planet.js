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
    var dt = 1150;
    //var dt = 60;
    for (var i = 0; i < _planets.length; i++) {
        for (var j = 0; j < _planets.length; j++) {
            if (i != j)
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
    //plutoMesh.position.set(_plutoCenter.x, _plutoCenter.y, _plutoCenter.z);
    scene.add(plutoMesh);
    objectCache.plutoMesh = plutoMesh;

    var radiusNeptune = 635;    // km
    var neptuneGeometry = new THREE.SphereGeometry( radiusPluto, 32, 32 );
    neptuneTexture = THREE.ImageUtils.loadTexture('textures/ganymede.jpg');
    var neptuneMaterial = new THREE.MeshBasicMaterial({map: neptuneTexture, side: THREE.DoubleSide });
    var neptuneMesh = new THREE.Mesh( neptuneGeometry, neptuneMaterial );
    //neptuneMesh.position.set(_plutoCenter.x -  AUm * .5, _plutoCenter.y, _plutoCenter.z);
    scene.add(neptuneMesh);
    objectCache.neptuneMesh = neptuneMesh;
    
    _planets.push(new Planet({
        'name': 'charon',
        'mass': 2*1.52e21,
        'radius': 1000 * 1000,
        'startPosition': new Cart3(19640 * 1000, 0, 0),
        'startVelocity': new Cart3(0, 0, 210),
        'mesh': neptuneMesh
    }));
    _planets.push(new Planet({
        'name': 'pluto',
        'mass': 2*1.27e22,
        'radius': 1137 * 1000,
        'startPosition': new Cart3(0, 0, 0),
        'startVelocity': new Cart3(0, 0, -26),
        'mesh': plutoMesh
    }));
    _physics = new engine(_planets);
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