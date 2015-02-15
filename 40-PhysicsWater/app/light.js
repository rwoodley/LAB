function addLight(scene, material) {
    //scene.add(new THREE.AmbientLight(0xff9999));
    var back_light = new THREE.PointLight(0xffffff, 1.5);
    back_light.position.set(100, 100, -20);
    scene.add(back_light);
    var back_light2 = new THREE.PointLight(0xffffff, 1.5);
    back_light2.position.set(-100, 0, 20);
    scene.add(back_light2);
    
    var geo = new THREE.CylinderGeometry(1,1,5,32);
    var mesh = new THREE.Mesh(geo, material);
    scene.add(mesh);
    mesh.rotation.x = Math.PI/2;
    mesh.position.z = +7;
    mesh.position.y = 10;
    addLensFlare(_scene, mesh.position.x, mesh.position.y, mesh.position.z-2.7);

    // vertical bar
    var bar = new THREE.CylinderGeometry(.125,.125,mesh.position.y);
    var barmesh = new THREE.Mesh(bar, material);
    barmesh.position.y = mesh.position.y/2; 
    barmesh.position.z = mesh.position.z;
    scene.add(barmesh);

    return back_light;
}
function addLensFlare(scene, x, y, z) {
    var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0.png" );
    var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare2.png" );
    var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare3.png" );

    addLight( 0.55, 0.9, 0.5, x,y,z );
    //addLight( 0.08, 0.8, 0.5,    0, 0, -1000 );
    //addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );

    function addLight( h, s, l, x, y, z ) {

        var light = new THREE.PointLight( 0xffffff, 1.5, 10 );
        light.color.setHSL( h, s, l );
        light.position.set( x, y, z );
        scene.add( light );

        var flareColor = new THREE.Color( 0xffffff );
        flareColor.setHSL( h, s, l + 0.5 );

        var lensFlare = new THREE.LensFlare( textureFlare0, 200, 0.0, THREE.AdditiveBlending, flareColor );

        //lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
        //lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
        //lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );

        //lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
        //lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
        //lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
        //lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
        //
        //lensFlare.customUpdateCallback = lensFlareUpdateCallback;
        lensFlare.position.copy( light.position );

        scene.add( lensFlare );

    }
}
function lensFlareUpdateCallback( object ) {

    var f, fl = object.lensFlares.length;
    var flare;
    var vecX = -object.positionScreen.x * 2;
    var vecY = -object.positionScreen.y * 2;


    for( f = 0; f < fl; f++ ) {

           flare = object.lensFlares[ f ];

           flare.x = object.positionScreen.x + vecX * flare.distance;
           flare.y = object.positionScreen.y + vecY * flare.distance;

           flare.rotation = 0;

    }

    object.lensFlares[ 2 ].y += 0.025;
    object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );

}
