
function createCloud()
{

	var cloudGeo = new THREE.Geometry();

	var tx = 10;
	var ty = 10;
	var tz = 10;
    var material = new THREE.MeshNormalMaterial();
	for (i = 0; i < 7; i++) {
		var radius = lnRandomScaled(15,10);
		if (radius < 1) radius = 1;
		//console.log(radius);
		//var radius = (Math.random() * 1 + 1) * 8;
	    var sphere = new THREE.SphereGeometry(radius, 20, 20);
		var particle = jiggleVec(tx, tz, ty, 15);
		var distance = Math.sqrt(Math.pow(tx-particle.x, 2) + Math.pow(ty-particle.y, 2) + Math.pow(tz-particle.z, 2))
		var scalar = 1*radius/distance;
		var sphereMesh = new THREE.Mesh(sphere, material);
		sphereMesh.position.x = scalar * (particle.x-tx) + tx;
		sphereMesh.position.y = .5*scalar * (particle.y-ty) + ty;
		sphereMesh.position.z = scalar * (particle.z-tz) + tz;
		sphereMesh.rotation.x = .5*Math.PI;	// rotate so texture seam is hidden on the side
		sphereMesh.rotation.y = Math.random() * Math.PI *2; 
		// sphereMesh.rotation.z = Math.random() * Math.PI *2;
		sphereMesh.updateMatrix();
	    cloudGeo.merge(sphereMesh.geometry, sphereMesh.matrix)
	}
	// put a y floor on the verices
	var amount = 1.;
	for( vi in cloudGeo.vertices) {
		var vertex = cloudGeo.vertices[vi];
		for (var i = 0; i < 10; i++) {
			vertex.y = Math.max(10., vertex.y);
		}
	}
    return cloudGeo;
}
function jiggleVec(x,y,z, jiggleAmount) {
	x *= 1 + jiggleAmount*(Math.random() - .5);
	y *= 1 + jiggleAmount*(Math.random() - .5);
	z *= 1 + jiggleAmount*(Math.random() - .5);
	return new THREE.Vector3(x,y,z);
}
