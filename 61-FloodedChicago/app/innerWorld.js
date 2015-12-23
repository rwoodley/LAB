innerWorld = function() {
    this.init = function(camera, renderer, waterY) {
        // if the camera goes below the waterY, then the water disappears. so don't do that.
        // The camera lookAt.y needs to = waterY, otherwise the water goes black
        // if the camera y drops below the lookAt.y. I don't know why. Something
        // about how the shader reflects lights. So the water has to occupy the bottom
        // half of the screen always. not ideal.

        this.camera = camera;
        this.waterY = waterY;
        this.scene = this.innerWorldScene(this.camera, renderer);
        return this.scene;
    }
    this.render = function() {
        this.camera.lookAt(new THREE.Vector3(0, this.waterY,0));
        this.water.material.uniforms.time.value += 1.0 / 600.0;
        this.water.render();    // calls render on the underlying Mirror.
    }
    this.innerWorldScene = function(camera, renderer) {    
        var scene = new THREE.Scene();
        var ambientLight = new THREE.AmbientLight(0xfff);
        scene.add(ambientLight);
        
        camera.position.x = 550; camera.position.y = -150; camera.position.z = -1000;


        this.doWater(scene, renderer, camera);
        loadSkyDome(scene);
          
        return scene;
    }
    this.doWater = function(scene, renderer, camera) {
        var directionalLight = new THREE.DirectionalLight(0xffff55, 1);
        directionalLight.position.set(-600, 300, 600);
        scene.add(directionalLight);    
        waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
    
        this.water = new THREE.Water( renderer, camera, scene, {
            textureWidth: 512, 
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 	1.0,
            sunDirection: directionalLight.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0,		// nice param. how agitated the water
            eye: camera.position
        } );
        console.log(this.water.eye);
    
        mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2000*500, 2000*500, 10, 10 ),
            this.water.material
        );
    
        mirrorMesh.add( this.water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        mirrorMesh.position.y = this.waterY;
        scene.add( mirrorMesh );
    }
    function loadSkyDome(scene) {

        var skyGeometry = new THREE.SphereGeometry(10000,50,50);

        texture = THREE.ImageUtils.loadTexture('textures/1.jpg');    //custom_uv_diag

        var skyMaterial = new THREE.MeshBasicMaterial({
            map: texture, 
            side: THREE.DoubleSide });
        var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
        skyBox.scale.set(-1,1,1);
        scene.add(skyBox);
     }

}