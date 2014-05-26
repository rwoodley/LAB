mySphere = function(u, v) {
  u *= Math.PI;
  v *= 2 * Math.PI;
  var size = 20;
  var x = size * Math.sin(u) * Math.cos(v);
  var y = size * Math.sin(u) * Math.sin(v);
  var z = size * Math.cos(u);

  return new THREE.Vector3(x, y, z);
}

klein = function (u, v) {
    u *= Math.PI;
    v *= 2 * Math.PI;

    u = u * 2;
    var x, y, z;
    if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
    }

    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

    return new THREE.Vector3(x*2, y*2, z*2);
};
flower = function(u,v) {
    //for theta = -PI to PI,    for radius = 0 to 1
    var theta = u * 2 * Math.PI - Math.PI;
    var radius = v;
    
    var x = radius*Math.cos(theta);
    var y = radius*Math.sin(theta);
    var z = (x*x + y*y)/2;
    
    radius *= Math.pow(Math.cos(4*theta),2);
    x = radius*Math.cos(theta);
    y = radius*Math.sin(theta);
    var scale = 16;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}

funcStart = function(u,v) { return dumpling(u,v,.7,1); }
funcAlmost = function(u,v) { return dumpling(u,v,.7,0.9); }
funcDiff = function(u,v) { return dumpling(u,v,.1,0); }
    
dumpling = function(u,v, zscale, maxZ) {
    //float temprad = count * abs(cos(irad*PI/2))*sqrt(irad) +(1.0-count)*irad;
    var theta = u * 2 * Math.PI;
    var radius = v * 2;
    var zdelta = 0;
    if (radius > 1) {
      radius = 2 - radius;
      zdelta = 0.01;
    }
    
    var x = radius*Math.cos(theta*3);
    var y = radius*Math.sin(theta*3);
    var z = zdelta +  zscale * (2*x*x + 1.5*y*y)/1.5;
    var temprad = radius;
    if (maxZ > 0) {
        var zScale = zscale/maxZ;
        var temprad = Math.sin(Math.PI * radius*zScale) /zScale;   
    }
    x = temprad*Math.cos(theta);
    y = temprad*Math.sin(theta);

    var scale = 8;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
