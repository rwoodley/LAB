var _groundMaterial;
function makeMesh(w,h,d,x,y,z) {
    var geo = new THREE.BoxGeometry(w,h,d);
    var mesh = new Physijs.BoxMesh(geo, _groundMaterial, 0);
    mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
    return mesh;
}
physicsBox = function(scene, x, y, l, w, h, t) {
    scene.setGravity(new THREE.Vector3(0, -10, 0));
    var pivotMaterial = Physijs.createMaterial(new THREE.MeshLambertMaterial({color: 0xff0000 }),.9,.6);
    var _boxPivotPoint = new Physijs.SphereMesh(new THREE.SphereGeometry(1,10,20),
                                        pivotMaterial, 0);

    _groundMaterial = Physijs.createMaterial(
            new THREE.MeshLambertMaterial({opacity:0.02, transparent: true }),
            .9, // high friction
            .6 // low restitution
    );
    var ground = makeMesh(w, t, l, x, y, 0);
    ground.receiveShadow = true;

    var borderLeft = makeMesh(t, h, l, x-w/2+t/2, h/2+t/2, y);
    ground.add(borderLeft);

    var borderRight = makeMesh(t, h, l, x+w/2-t/2, h/2+t/2, y);
    ground.add(borderRight);

    var borderBottom = makeMesh(w-t-t, h, t, x, h/2+t/2, y-l/2+t/2);
    ground.add(borderBottom);

    var borderTop = makeMesh(w-t-t, h, t, x, h/2+t/2, y+l/2-t/2);
    ground.add(borderTop);
    //
    _boxPivotPoint.add(ground);
    _boxPivotPoint.position.y = -20;
    scene.add(_boxPivotPoint);
    return ground;
}
var _balls = [];
var 
shootBall = function(waterY, scene, x, y, width, w, dx, dy, material) {
    var ball;
    for (var i = 0; i < _balls.length; i++) {   // see if we can reuse a ball
        if (_balls[i].position.y < waterY) {
            ball = _balls[i];
            console.log("Reuse!");
            break;
        }
    }
    if (ball == undefined) {
        console.log("New....");
        ball = new Physijs.SphereMesh(
                 new THREE.SphereGeometry(width*5, 20),
                 Physijs.createMaterial(
                         //new THREE.MeshPhongMaterial(
                         //        {   color: 0x00f,
                         //            opacity: 0.2,
                         //            transparent: true
                         //        }),
                         material,
                         .4, // controls.sphereFriction,
                         .4  // controls.sphereRestitution
                 ),
                 10
         );
        _balls.push(ball);
    }
    ball.position.set(
            x + Math.random() * w - w/2,
            y + Math.random() * w - w/2,
            Math.random() * w - w/2
    );
    scene.add(ball);
    var force_vector = new THREE.Vector3(dx, dy, 0);
    ball.applyCentralImpulse(force_vector);
}
function doDroplets(waterY, radians, tick, scene, material) {
  if (tick%50 > 20) return;
  if (tick%5 != 0) return;
  var rad = (radians)%Math.PI/8;
  var radius = 10;
  var rotation = Math.PI/2+Math.PI/4+Math.PI/8;
  var x = radius*Math.cos(rad+rotation);
  var y = radius*Math.sin(rad+rotation);
  for (var i = 0; i < 3; i++) {
    shootBall(waterY, scene, x, y, .02, 1.5, 75, 125, material);
  }
}