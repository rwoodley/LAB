innerWorld = function() {
    this.init = function(camera, renderer, waterY) {
        // if the camera goes below the waterY, then the water disappears. so don't do that.
        this.outerCamera = camera;
        this.mirrorCamera = new THREE.PerspectiveCamera( 
            170, window.innerWidth / window.innerHeight, 
            1, 
            20000 );
         this.waterY = waterY;
        this.scene = this.innerWorldScene(this.mirrorCamera, renderer);
        // this.scene.fog=new THREE.Fog( 0xffffff, 0.015, 18000 );
         return this.scene;
    }
    this.render = function(lookAtVector) {
        this.mirrorCamera.position.x = this.outerCamera.position.x;
        this.mirrorCamera.position.y = this.outerCamera.position.y;
        this.mirrorCamera.position.z = this.outerCamera.position.z;

        // if mirror camera goes below lookAt.y, then water goes black.
        if (this.mirrorCamera.position.y <= lookAtVector.y)
            this.mirrorCamera.position.y = lookAtVector.y + 1;

        this.mirrorCamera.lookAt(lookAtVector);
        this.water.material.uniforms.time.value += 1.0 / 80.0;
        this.water.render();    // calls render on the underlying Mirror.
    }
    this.innerWorldScene = function(camera, renderer) {    
        var scene = new THREE.Scene();
        
        this.doWater(scene, renderer, camera);
          
        return scene;
    }
    this.doWater = function(scene, renderer, camera) {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(-60, 30, 60);
        scene.add(directionalLight);    
        waterNormals = new THREE.ImageUtils.loadTexture( 'textures/waternormals.jpg' );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
    
        this.water = new THREE.Water( renderer, camera, scene, {
            textureWidth: 512, 
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha:  1.0,
            sunDirection: directionalLight.position.clone().normalize(),
            sunColor: 0XFFFFFF,
            waterColor: 0x001e0f,
            distortionScale: 40.0,      // nice param. how agitated the water
            eye: camera.position
        } );
    
        mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( 2000*500, 2000*500, 10, 10 ),
            this.water.material
        );
    
        mirrorMesh.add( this.water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        mirrorMesh.position.y = this.waterY;
        scene.add( mirrorMesh );
    }

}