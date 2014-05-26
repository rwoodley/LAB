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

flatDisk = function(u,v) { return       dumpling(u, v, 1, 0, 0, 0, 8, 8); }
funcLeaves = function(u,v) { return     dumpling(u, v, -1, 0.5, .5, .8, 16, 7); }
funcCup = function(u,v) { return        dumpling(u, v, 1, 1, 3, 1.7, 8, 4); }
funcMuladhara = function(u,v) { return  dumpling(u, v, 1, 1.5, 2.5, .2, 4, 7); }
funcFlatChakra = function(u,v) { return dumpling(u, v, 0, .1, 2, 1, 4, 12); }
funcCupChakra = function(u,v) { return  dumpling(u, v, 2, 0.1, 3, 1.7, 4, 7); }
funcGetCupFunc = function(nPetals) {
    //return function(u,v) { return  dumpling(u, v, 2, 1, 3, 1.7, nPetals, 7); };
    return function(u,v) { return dumpling(u, v, 1, 1, 3, 1.7, nPetals, 4); };
}
funcGetFlatFunc = function(nPetals, flatness, size) {
    return function(u,v) { return dumpling(u, v, 0, flatness, 2, 1, nPetals, size); };
}

dumpling = function(u,v, openOrClose, overallHeight, petalPeak, petalTrough, nPetals, scale) {
    // openOrClose: 0 to 1:1=dumpling,-1=Z func only,0=petals.

    var theta = u * 2 * Math.PI;
    var radius = v * 2; // see note below on why we have x2 here.
    var zdelta = 0;
    // this bit of code folds the object back on itself and makes it a solid instead of a plane, so both sides cast a shadow.
    // see http://stackoverflow.com/questions/20463247/three-js-doublesided-material-doesnt-cast-shadow-on-both-sides-of-planar-parame
    if (radius > 1) {
      radius = 2 - radius;
      zdelta = 0.01;
    }
    
    var x = radius*Math.cos(theta*nPetals/2);
    var y = radius*Math.sin(theta*nPetals/2);
    var z = zdelta +  overallHeight * (petalPeak*x*x + petalTrough*y*y)/1.5;
    //var z = 1;
    var temprad = radius;
    if (openOrClose == 1) {
        var temprad = Math.sin(Math.PI * radius);     // dumpling effect
    }
    if (openOrClose == 0) {     // flat petals, pow function makes them rounder.
        //var temprad =  radius * Math.exp(Math.abs(Math.cos(theta*nPetals/2)));
        temprad =  radius * Math.pow(Math.abs(Math.cos(theta*nPetals/2)),.25);
        //var temprad =  Math.exp(radius);
    }
    if (openOrClose == -1) {    // classic, flat petals: 'rose flower'
        temprad = radius*Math.cos(theta * nPetals/2 );
    }
    if (openOrClose == 2) {     // nicely folded flower bud with pointy petals
        var x = radius*Math.cos(theta*nPetals/2);
        var y = radius*Math.sin(theta*nPetals/2);
        //var x = Math.exp(radius)*Math.cos(theta*nPetals/2);
        //var y = Math.exp(radius)*Math.sin(theta*nPetals/2);
        var z = zdelta +  overallHeight * (petalPeak*x*x + petalTrough*y*y)/1.5;
        //temprad = radius*Math.sin(theta * nPetals);
        temprad =  Math.exp(radius) * Math.cos(theta*nPetals/2);
        var maxTempRad = Math.exp(1);
        temprad = Math.sin(Math.PI * Math.abs(temprad/maxTempRad));     // dumpling
    }
    x = temprad*Math.cos(theta);
    y = temprad*Math.sin(theta);

    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
