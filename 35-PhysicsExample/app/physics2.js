var _groundMaterial;
function makeMesh(w,h,d,x,y,z) {
    var geo = new THREE.BoxGeometry(w,h,d);
    var mesh = new Physijs.BoxMesh(geo, _groundMaterial, 0);
    mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
    return mesh;
}
physicsBox = function(x, y) {
    if (_groundMaterial == undefined) {
        _ground_material = Physijs.createMaterial(
                new THREE.MeshNormalMaterial(),
                .4, // high friction
                .4 // low restitution
        );
    }

    var ground = makeMesh(12, 2, 10, x, y, 0);
    ground.receiveShadow = true;

    var borderLeft = makeMesh(2, 6, 10, -7, +2, 0);
    ground.add(borderLeft);

    var borderRight = makeMesh(2, 6, 10, +7, +2, 0);
    ground.add(borderRight);

    var borderBottom = makeMesh(16, 6, 2, 0, +2, 6);
    ground.add(borderBottom);

    var borderTop = makeMesh(16, 6, 2, 0, +2, -6);
    ground.add(borderTop);
    
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
                                    opacity: 0.8,
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
    }
    ;
};
