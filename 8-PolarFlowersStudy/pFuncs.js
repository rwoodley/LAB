funcCone = function(u,v) { return funcGen(u,v,1); }
funcCup = function(u,v) { return funcGen(u,v,2); }
funcDumpling = function(u,v) { return funcGen(u,v,3); }
funcPolarCone = function(u,v) { return funcGen(u,v,4); }
funcPolarCup = function(u,v) { return funcGen(u,v,5); }
funcPolarDumpling = function(u,v) { return funcGen(u,v,6); }
funcDisc = function(u,v) { return funcGen(u,v,7); }
funcPolarDisc = function(u,v) { return funcGen(u,v,8); }
funcPetals = function(u,v) { return funcGen(u,v,9); }
funcPolarPetals = function(u,v) { return funcGen(u,v,10); }
funcKiss = function(u,v) { return funcGen(u,v,11); }
funcPolarKiss = function(u,v) { return funcGen(u,v,12); }
funcGen = function(u,v, kind) {
    var theta = u * 2 * Math.PI;
    var radius = v * 2; // see note below on why we have x2 here.
    var zdelta = 0.001;
    if (radius > 1) {
      radius = 2 - radius;
      zdelta = 0.01;
    }
    if (kind == 1)
        return algoCone(theta, radius, zdelta);
    if (kind == 2)
        return algoCup(theta, radius, zdelta,8);
    if (kind == 3)
        return algoDumpling(theta, radius, zdelta,8);
    if (kind == 4)
        return algoCone(theta, Math.exp(radius)/Math.exp(1), zdelta);
    if (kind == 5)
        return algoCup(theta, Math.exp(radius)/Math.exp(1), zdelta,8);
    if (kind == 6)
        return algoDumpling(theta, Math.exp(radius)/Math.exp(1), zdelta,8);
    if (kind == 7)
        return algoCone(theta, radius, -zdelta);
    if (kind == 8)
        return algoCone(theta, Math.exp(radius)/Math.exp(1), -zdelta,8);
    if (kind == 9)
        return algoPetals(theta, radius, zdelta, 8);
    if (kind == 10)
        return algoPetals(theta, Math.exp(radius)/Math.exp(1), zdelta, 8);
    if (kind == 11)
        return algoKiss(theta, radius, zdelta);
    if (kind == 12)
        return algoKiss(theta, Math.exp(radius)/Math.exp(1), zdelta);
}
algoCone = function(theta, radius, zdelta, nPetals) {
    var x = radius*Math.cos(theta);
    var y = radius*Math.sin(theta);
    var z = zdelta +  (x*x + y*y);
    if (zdelta < 0) z = -zdelta;    // hack
    var scale = 10;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
algoPetals = function(theta, radius, zdelta, nPetals) {
    var x = radius*Math.cos(theta*nPetals/2);
    var y = radius*Math.sin(theta*nPetals/2);
    var z = zdelta +  (1.5*x*x + y*y);
    if (zdelta < 0) z = -zdelta;    // hack
    radius = radius*Math.cos(theta * nPetals/2 );
    x = radius*Math.cos(theta);
    y = radius*Math.sin(theta);
    var scale = 10;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
algoCup = function(theta, radius, zdelta, nPetals) {
    var x = radius*Math.cos(theta*nPetals/2);
    var y = radius*Math.sin(theta*nPetals/2);
    var z = zdelta +  (1.5*x*x + y*y);
    if (zdelta < 0) z = -zdelta;    // hack
    x = radius*Math.cos(theta);
    y = radius*Math.sin(theta);
    var scale = 10;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
algoDumpling = function(theta, radius, zdelta, nPetals) {
    var x = radius*Math.cos(theta*nPetals/2);
    var y = radius*Math.sin(theta*nPetals/2);
    var z = zdelta +  (1.5*x*x + y*y);
    radius = Math.sin(Math.PI * radius);
    x = radius*Math.cos(theta);
    y = radius*Math.sin(theta);
    var scale = 10;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}
algoKiss = function(theta, radius, zdelta) {
    var x = radius*Math.cos(theta);
    var y = radius*Math.sin(theta);
    var z = zdelta +  (x*x + y*y);
    radius = Math.sin(Math.PI * radius);
    x = radius*Math.cos(theta);
    y = radius*Math.sin(theta);
    var scale = 10;
    return new THREE.Vector3(x*scale, z*scale, y*scale);
}

