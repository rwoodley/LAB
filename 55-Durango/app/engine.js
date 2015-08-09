var engine = function() {
    var _that = this;
    this.G = 6.6742e-11; // universal gravitational constant

    this.planets = [];
    //this.planets.push({
    //    'name': 'sun',
    //    'mass': 3000,   // in units of earth. should really be 333,000
    //    'position': new Cart3(0,0,0)        
    //});
    this.addPlanet = function(obj) {
        //var ob = new OrbitBody(fields[0], vals[1], pos, vel, 1e9, color);
        var v = ((Math.random() * 200) + 100) * 50.0;
        //v = (i % 2 == 1) ? -v : v;
        v /= -100;
        var vel = new Cart3(0, 0, 47900);

        var ob = new OrbitBody(obj.name, obj.radius, obj.pos, vel, obj.mass, undefined);
        this.planets.push(ob);
    }
    this.updateOrbit = function(pa, pb, dt, lambda) {
      // don't compute self-gravitation
      if (pa != undefined && pb != undefined && pa != pb) {
        // this trig-free method does this:
        // 1. vel += dt * radius * -G * mass * radius.abs()^-3
        // 2. pos += dt * vel
        // including an optional dark energy constant (lambda)
        
        // compute radius of separation
        var radius = pa.pos.sub(pb.pos);
        // update velocity with gravitational acceleration
        pa.vel.addTo(radius.mult(dt * (lambda - _that.G * pb.mass * radius.invSumCube())));
        // update position with velocity
        pa.pos.addTo(pa.vel.mult(dt));
      }
    }
    this.updateObjects = function(dt) {
        dt = 115200;
      // compute gravitation only wrt the sun, not wrt all other bodies
//      for (var i = 0;i < array.length;i++) {
        _that.updateOrbit(_that.planets[0], _that.planets[1], dt, 0);
//      }
    }
}

OrbitBody = function(name, radius, pos, vel, mass, color) {
  this.name = name; // string
  this.radius = radius; // scalar
  this.mass = mass; // scalar
  this.pos = pos; // Cart3 3D vector
  this.vel = vel; // Cart3 3D vector
  this.color = color; // string
}

function Cart3(x,y,z) {
  this.x = 0;
  this.y = 0;
  this.z = 0;
  if(x instanceof Cart3) {
    this.x = x.x;
    this.y = x.y;
    this.z = x.z;
  }
  else {
    if(x != undefined) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }
  this.sub = function(a) {
    return new Cart3(this.x - a.x, this.y - a.y, this.z - a.z);
  }
  
  this.mult = function(m) {
    return new Cart3(this.x * m, this.y * m, this.z * m);
  }
  
  this.addTo = function(a) {
    this.x += a.x;
    this.y += a.y;
    this.z += a.z;
    return this;
  }
  
  this.invSumCube = function() {
    return Math.pow(this.x*this.x + this.y*this.y + this.z*this.z,-1.5);
  }
  
  this.abs = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }
  
  this.toString = function() {
    return this.x + "," + this.y + "," + this.z;
  }
}
