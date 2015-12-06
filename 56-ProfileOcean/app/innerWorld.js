function innerWorldScene(camera) {    
    var scene = new THREE.Scene();
    var ambientLight = new THREE.AmbientLight(0x330000);
    scene.add(ambientLight);
    
    camera.position.x = 10; camera.position.y = 10; camera.position.z = 10;
    var axes = new THREE.AxisHelper( 5000 );
    scene.add(axes);
    
    //===== Begin sphere shader code
    var geometry = new THREE.SphereGeometry(5, 40, 40);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
    scene.add(mesh);
    
    var geometry = new THREE.PlaneGeometry( 20, 20, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( geometry, material );
    //scene.add(plane);

     _grid = new THREE.GridHelper(600, 20);
      _grid.setColors( new THREE.Color(0x003333), new THREE.Color(0x003333) );
      scene.add(_grid);

    return scene;
}