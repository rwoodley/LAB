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
shootBall = function(waterY, scene, x, y, width, w, dx, dy, material, applyForce) {
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
                 new THREE.SphereGeometry(5*width, 20),
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
    //ball.scale.x = 5*width;
    //ball.scale.y = 5*width;
    //ball.scale.z = 5*width;
    ball.position.set(   //x,y,0);
            x + Math.random() * w - w/2,
            y + Math.random() * w - w/2,
            Math.random() * w - w/2
    );
    scene.add(ball);
    if (applyForce) {
        var force_vector = new THREE.Vector3(dx, dy, 0);
        ball.applyCentralImpulse(force_vector);
    }
}
function doDroplets(waterY, radians, tick, scene, material) {
    //radians -= Math.PI/32;
  var rad = Math.abs(radians)%(Math.PI/4);
  //if (Math.abs(rad) > Math.PI/8 || Math.abs(rad) < Math.PI/16) return; // bursts
  //if (Math.abs(rad) > 7*Math.PI/32) return;
  if (tick%2 != 0) return;      // don't make too many droples!
  //console.log(radians, rad);
  var radius = 10;
  var rotation = Math.PI/2+Math.PI/8-Math.PI/8;
  var x = radius*Math.cos(rad+rotation);
  var y = radius*Math.sin(rad+rotation);

  // arc of bubbles being flung up...
  for (var i = 0; i < 1; i++) {
    var dropletDiameter = 0.03  + Math.random() * .02;
    shootBall(waterY, scene, x, y, dropletDiameter, 0.05, -75*x/radius, 125*y/radius, material, true);
  }

  // drips falling down.
  rotation += Math.PI/2;
  var x = radius*Math.cos(rad+rotation);
  var y = radius*Math.sin(rad+rotation);
  for (var i = 0; i < 1; i++) {
    var dropletDiameter = 0.01  + Math.random() * .01;
    shootBall(waterY, scene, x, y, dropletDiameter, 0.05, 0,0, material, false);
  }


}