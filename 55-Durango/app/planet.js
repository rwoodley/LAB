// This really is any kind of orbital object, not just planets.
// it could be a satellite.
// Units are:
// Mass: kg
// Distance: m
// the physics engine updates the position and velocity of the objects
// This wraps the physics engine. 
var _planets = [];
var _physics;
function updatePlanetPhysics(frame, dt) {
//    var dt = 11.20;

    // First update velocities
    for (var i = 0; i < _planets.length; i++) {
        for (var j = 0; j < _planets.length; j++) {
            if (i != j ) // && _planets[i].mass < _planets[j].mass*100)
            {
                if (i == 2 || j == 2)
                    console.log('here');
                _physics.updateVelocity(_planets[i], _planets[j], dt, 0);
            }
        }
    }
    // now update positions
    for (var i = 0; i < _planets.length; i++) {
        _physics.updatePosition(_planets[i], dt);   // update internal physics position
        _planets[i].updateMeshPosition();           // update three.js position
    }
}
function calcDistance(name1, name2, objectCache) {
    var p1 = objectCache[name1];
    var p2 = objectCache[name2];
    var x = p1.position.x - p2.position.x;
    var y = p1.position.y - p2.position.y;
    var z = p1.position.z - p2.position.z;
    return Math.sqrt(x*x + y*y + z*z);
//    return p1.mesh.position.distanceTo(p2.mesh.position);
}
function planetLighting(planetMesh, scene) {
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 0, 0 );
    light.target = planetMesh;
    scene.add(light);
}
function addPlanets(scene, objectCache) {
    
    var radiusPluto = 1186; // km
    var plutoGeometry = new THREE.SphereGeometry( radiusPluto, 64, 64 );
    plutoTexture = THREE.ImageUtils.loadTexture('textures/venusmap.jpg');
    var plutoMaterial = new THREE.MeshLambertMaterial({map: plutoTexture});
    var plutoMesh = new THREE.Mesh( plutoGeometry, plutoMaterial );
    scene.add(plutoMesh);
//    planetLighting(plutoMesh, scene);
    objectCache.plutoMesh = plutoMesh;

    var radiusCharon = 635;    // km
    var charonGeometry = new THREE.SphereGeometry( radiusCharon, 64, 64 );
    charonTexture = THREE.ImageUtils.loadTexture('textures/rhea.jpg');
    var charonMaterial = new THREE.MeshLambertMaterial({map: charonTexture });
    var charonMesh = new THREE.Mesh( charonGeometry, charonMaterial );
    scene.add(charonMesh);
    planetLighting(charonMesh, scene);
    objectCache.charonMesh = charonMesh;
    
    var charonPlanet = new Planet({
        'name': 'charon',
        'mass': 2*1.52e21,
        'radius': 1000 * 1000,
        'startPosition': new Cart3(19640 * 1000, 0, 0),
        'startVelocity': new Cart3(0, 0, 300),
        'mesh': charonMesh
    });
    objectCache.charonPlanet = charonPlanet;
    _planets.push(charonPlanet);
    var plutoPlanet = new Planet({
        'name': 'pluto',
        'mass': 2*1.27e22,
        'radius': 1137 * 1000,
        'startPosition': new Cart3(0, 0, 0),
        'startVelocity': new Cart3(0, 0, -37),
        'mesh': plutoMesh
    });
    objectCache.plutoPlanet = plutoPlanet;
    _planets.push(plutoPlanet);
    var shipPlanet = new Planet({
        'name': 'ship',
        'mass': 1*1e9,
        'radius': 11 * 1000,
        'startPosition': new Cart3(19640*1000, 5000*1000,  0),      // orbit charon view
        //'startPosition': new Cart3(0, 4000*10000,  0),             // view from above
        'startVelocity': new Cart3(0, 0, 85),
        'mesh': objectCache.ship._mesh
    });
    _planets.push(shipPlanet);
    objectCache.shipPlanet = shipPlanet;
    _physics = new physics(_planets);
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
        var _physicsOriginInThreeJSSpace = new Cart3(100000, 0, 0);  // put at zero to avoid rounding errors
        var _scaleAdjustment = 1000.0;    // convert from m to km.
        self.mesh.position.set(
            self.position.x/_scaleAdjustment + _physicsOriginInThreeJSSpace.x,
            self.position.y/_scaleAdjustment + _physicsOriginInThreeJSSpace.y,
            self.position.z/_scaleAdjustment + _physicsOriginInThreeJSSpace.z
        );
    }
}