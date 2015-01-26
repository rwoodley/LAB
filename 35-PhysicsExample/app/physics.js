var _wheel;
boxGeo = function(w,h,d, x, y, z) {
    var geo = new THREE.BoxGeometry(w,h,d);
    geo.applyMatrix(new THREE.Matrix4().makeTranslation(x,y,z));
    return geo;
}
physicsBox = function(scene, x, y) {
    // Materials
    ground_material = Physijs.createMaterial(
            //new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('../assets/textures/general/floor-wood.jpg') }),
            new THREE.MeshNormalMaterial(),
            .9, // high friction
            .6 // low restitution
    );

    // Ground
    ground = new Physijs.BoxMesh(
            boxGeo(12, 2, 10, x, y, 0),
            ground_material,
            0 // mass
    );
    ground.receiveShadow = true;


    var borderLeft = new Physijs.BoxMesh(
            boxGeo(1, 6, 10, x-6, y+2, 0),
            ground_material,
            0 // mass
    );
    ground.add(borderLeft);

    var borderRight = new Physijs.BoxMesh(
            boxGeo(1, 6, 10, x+6, y+2, 0),
            ground_material,
            0 // mass
    );

    ground.add(borderRight);


    var borderBottom = new Physijs.BoxMesh(
            boxGeo(12, 6, 1, x, y+2, 5),
            ground_material,
            0 // mass
    );

    ground.add(borderBottom);

    var borderTop = new Physijs.BoxMesh(
            boxGeo(12, 6, 1, x, y+2, -5),
            ground_material,
            0 // mass
    );

    ground.add(borderTop);
    var bbox = new THREE.BoundingBoxHelper( ground, 0xff0000 );
    bbox.update();
    scene.add( bbox );

    return ground;
}
var meshes = [];
addSpheres = function (scene, scale, x, y, w) {
    var colorSphere = scale(Math.random()).hex();
    for (var i = 0; i < 5; i++) {
        box = new Physijs.SphereMesh(
                new THREE.SphereGeometry(.4, 20),
                Physijs.createMaterial(
                        new THREE.MeshPhongMaterial(
                                {   color: colorSphere,
                                    opacity: 0.8,
                                    transparent: true
                                }),
                        .1, // controls.sphereFriction,
                        .9  // controls.sphereRestitution
                )
        );
        box.position.set(
                x + Math.random() * w - w/2,
                y,
                Math.random() * w - w/2
        );
        meshes.push(box);
        scene.add(box);
    }
    ;
};
