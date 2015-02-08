function buildWheel(scene, material) {
  var pivot = new THREE.Mesh(new THREE.SphereGeometry(1,10,20),
                                      material, 0);

  var cupRadius = 1;
  var geometry = new THREE.SphereGeometry(cupRadius, 40, 40, 
    -Math.PI, Math.PI,0, Math.PI);

  var radians = 0;
  var radius = 10;
  var cupRotation = 0;
  for (var i = 0; i < 8; i++) {
    var mat = i == 0 ? new THREE.MeshNormalMaterial() : material;
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = cupRotation;
    mesh.rotation.x = Math.PI/2;
    mesh.rotation.order = 'ZXY';
    cupRotation += Math.PI/4;

    var x = radius * Math.cos(radians);
    var y = radius * Math.sin(radians);
    mesh.position.set(x,y,0);
    radians += Math.PI/4;
    pivot.add(mesh);
    
    if (i%2 == 0) {
      // draw 4 bars with length = diameter.
      var bar = new THREE.CylinderGeometry(.125,.125,radius*2-cupRadius*2);
      var barmesh = new THREE.Mesh(bar, material);
      barmesh.rotation.z = i * Math.PI/8; 
      pivot.add(barmesh);
    }
  }
  // horizontal bar
  bar = new THREE.CylinderGeometry(.125,.125,radius);
  barmesh = new THREE.Mesh(bar, material);
  barmesh.rotation.x = Math.PI/2; 
  barmesh.position.z = radius/2;
  pivot.add(barmesh);

  // disc
  bar = new THREE.CylinderGeometry(5,5,.1,32);
  barmesh = new THREE.Mesh(bar, material);
  barmesh.rotation.x = Math.PI/2; 
  barmesh.position.z = radius/4;
  pivot.add(barmesh);


  scene.add(pivot);
  return pivot;
}