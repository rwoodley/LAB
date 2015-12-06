innerWorld = function() {
    this.init = function(camera, renderer) {
        this.scene = this.innerWorldScene(camera, renderer);
        return this.scene;
    }
    this.render = function() {
        this.water.material.uniforms.time.value += 1.0 / 60.0;
        this.water.render();    // calls render on the underlying Mirror.
    }
    this.innerWorldScene = function(camera, renderer) {    
        var scene = new THREE.Scene();
        //var ambientLight = new THREE.AmbientLight(0xfff);
        //scene.add(ambientLight);
        
        camera.position.x = -40; camera.position.y = 3; camera.position.z = -5;
        var axes = new THREE.AxisHelper( 5000 );
        //scene.add(axes);
        
        //===== Begin sphere shader code
        //var geometry = new THREE.SphereGeometry(5, 40, 40);
        //var mesh = new THREE.Mesh(geometry, new THREE.MeshNormalMaterial());
        //scene.add(mesh);
        //
        this.doWater(scene, renderer, camera);
          
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
        mirrorMesh.position.y = -10;
        scene.add( mirrorMesh );
        loadSkyBox(scene);
    }
    function loadSkyBox(scene) {
            var aCubeMap = THREE.ImageUtils.loadTextureCube([
              'textures/px.jpg',
              'textures/nx.jpg',
              'textures/py.jpg',
              'textures/ny.jpg',
              'textures/pz.jpg',
              'textures/nz.jpg'
            ]);
            aCubeMap.format = THREE.RGBFormat;
    
            var aShader = THREE.ShaderLib['cube'];
            aShader.uniforms['tCube'].value = aCubeMap;
    
            var aSkyBoxMaterial = new THREE.ShaderMaterial({
              fragmentShader: aShader.fragmentShader,
              vertexShader: aShader.vertexShader,
              uniforms: aShader.uniforms,
              depthWrite: false,
              side: THREE.BackSide
            });
    
            var aSkybox = new THREE.Mesh(
              new THREE.BoxGeometry(10000, 10000, 10000),
              aSkyBoxMaterial
            );
            
            scene.add(aSkybox);
    }
}