var physics = function(planets) {
    var _that = this;
    this.G = 6.6742e-11; // universal gravitational constant
    this.planets = planets;

    // this.getRelativeVelocity = function(pa, pb) {
    //     // set velocity of pa relative to pb
    //     var radius = pa.position.sub(pb.position).x;
    //     var v = Math.sqrt(Math.abs(_that.G * pb.mass/radius));
    //     v *= Math.sign(radius);
    //     console.log("v, radius = " + v + "," + radius);
    //     return v;
    // }
    this.updateVelocity = function(pa, pb, dt, lambda) {

        // pa rotates around pb
        // vel for pa is updated.
        // inputs: pa.position, pb.position, pa.velocity, pb.mass

      // don't compute self-gravitation
      if (pa != undefined && pb != undefined && pa != pb) {
        // this trig-free method does this:
        // 1. vel += dt * radius * -G * mass * radius.abs()^-3
        // 2. pos += dt * vel
        // including an optional dark energy constant (lambda)
        
        // compute radius of separation
        var radius = pa.position.sub(pb.position);
        // update velocity with gravitational acceleration
        pa.velocity.addTo(radius.mult(dt * (lambda - _that.G * pb.mass * radius.invSumCube())));
      }
    }
    this.updatePosition = function(pa, dt) {
        // update position with velocity
        pa.position.addTo(pa.velocity.mult(dt));
    }
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
