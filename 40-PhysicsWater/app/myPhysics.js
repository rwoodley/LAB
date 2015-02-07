var _groundMaterial;
function makeMesh(w,h,d,x,y,z) {
    var geo = new THREE.BoxGeometry(w,h,d);
    var mesh = new Physijs.BoxMesh(geo, _groundMaterial, 0);
    mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
    return mesh;
}
physicsBox = function(x, y, l, w, h, t) {
    //if (_groundMaterial == undefined) {
        _groundMaterial = Physijs.createMaterial(
                new THREE.MeshLambertMaterial({opacity:0.02, transparent: true }),
                .9, // high friction
                .6 // low restitution
        );
    //}

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
    return ground;
}
addSpheres = function (scene, scale, n, x, y, w) {
    var colorSphere = scale(Math.random()).hex();
    for (var i = 0; i < n; i++) {
        box = new Physijs.SphereMesh(
                new THREE.SphereGeometry(.4, 20),
                Physijs.createMaterial(
                        new THREE.MeshPhongMaterial(
                                {   color: colorSphere,
                                    opacity: 0.2,
                                    transparent: true
                                }),
                        .4, // controls.sphereFriction,
                        .4  // controls.sphereRestitution
                ),
                10
        );
        box.position.set(
                x + Math.random() * w - w/2,
                y,
                Math.random() * w - w/2
        );
        scene.add(box);
        var force_vector = new THREE.Vector3(50, 50, 0);
        box.applyCentralImpulse(force_vector);
    }
    ;
};
shootBall = function(scene, scale, x, y, width, w, dx, dy, material) {
    var colorSphere = scale(Math.random()).hex();
    box = new Physijs.SphereMesh(
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
     box.position.set(
             x + Math.random() * w - w/2,
             y,
             Math.random() * w - w/2
     );
     scene.add(box);
     var force_vector = new THREE.Vector3(dx, dy, 0);
     box.applyCentralImpulse(force_vector);
}
