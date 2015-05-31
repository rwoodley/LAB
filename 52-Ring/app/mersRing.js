var MersRing = function(div, angleGuage, positionGuage) {
    var _that = this;
    this._container = div;
    this._width = div.offsetWidth;
    this._height = div.offsetHeight;
    _that._camera = new THREE.PerspectiveCamera( 60, _that._width / _that._height, .1, 20000 );    

    this._angleGuage = angleGuage;
    this._angleGuage.showArrow(_that._camera);
    this._positionGuage = positionGuage;
    
    //_that._controls = new THREE.OrbitControls( _that._camera, _that._container );

    _that._scene = new THREE.Scene();
    var pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
    this._scene.add( pointLight );
    this._navigator = new cameraNavigator(_that._camera, pointLight);

    _that._renderer =  new THREE.WebGLRenderer();
    _that._renderer.setSize( _that._width, _that._height );
    _that._renderer.setClearColor( 0x000000 );
    _that._container.appendChild( _that._renderer.domElement );
	_that._renderer.shadowMapEnabled = true;
	_that._renderer.shadowMapCullFace = THREE.CullFaceBack;        
    if ( ! Detector.webgl ) {
        Detector.addGetWebGLMessage();
        div.innerHTML = "No WebGL";
        return;
    }
    
    init();
    animate();
    
    function init() {
    
        _that._camera.position.x = 40; _that._camera.position.y = 10; _that._camera.position.z = 0;
        //_that._camera.position.x = 150; _that._camera.position.y = 90; _that._camera.position.z = 0;
        //_that._camera.rotateX(-1.63); _that._camera.rotateY(1); _that._camera.rotateZ(1.65);
        //_that._camera.rotateY( Math.PI/2);
        var axes = new THREE.AxisHelper( 1 );
        _that._scene.add(axes);
        
        _that._positionGuage.addMesh(buildRingMeshOld());
        buildRingMesh(_that._scene);

        var grid = new THREE.GridHelper(100, 10);
        _that._scene.add(grid);       

        _that._positionGuage.showCameraHelper(_that._camera);
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 10000 ),
                                   new THREE.MeshBasicMaterial( { color: 0xffffff, opacity: 0.5, transparent: true } ) );
        plane.receiveShadow = true;
                                   
        _that._scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
    	_that._scene.add( new THREE.AmbientLight( 0xaaaaaa ) );
        _that._scene.add(shadowLighting(plane));

        plane.rotation.x = -1.57;
        plane.position.y = -20;
        _that._scene.add( plane );
        //postProcessing();
        _that._renderer.render( _that._scene, _that._camera );


    }
    function shadowLighting(floor) {
        // add spotlight for the shadows
        var spotLight = new THREE.SpotLight( 0xff0000 );
        spotLight.position.set( -40, 60, -10 );
        spotLight.castShadow = true;
        spotLight.shadowCameraVisible = true;
        spotLight.angle = 2.0;
        //spotLight.intensity = 30;
        spotLight.distance=400;
        spotLight.shadowCameraNear = 2;
        spotLight.shadowCameraFar = 300;
        spotLight.shadowCameraFov = 500;
        spotLight.shadowDarkness = 1;
        spotLight.target = floor;
        return spotLight;
    }
    function buildRingMesh(scene) {
		var material = new THREE.MeshLambertMaterial( { 
                                                     map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ) } );

        for (var i = 0; i < 9; i++) {
            var color = chroma.scale('RdYlBu').mode('lab')(i/9).hex();
            var material =  new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } );
            var geometry1 = getWedgeGeo(i*Math.PI/4.5, Math.PI/4.5);
            var mesh = new THREE.Mesh( geometry1, material ); 
            mesh.rotateX(Math.PI/2);
            mesh.castShadow = true;
            scene.add(mesh);
        }
        return mesh;
    }
    function getWedgeGeo(startTheta, thetaLength) {
        var height = 20;
        var segments = 9;
        var innerRadius = 30;
        var outerRadius = 50;

        var geometry1 = new THREE.RingGeometry( innerRadius, outerRadius, segments, 8, startTheta, thetaLength);
        var bottomgeo = new THREE.RingGeometry( innerRadius, outerRadius, segments, 8, startTheta, thetaLength);
        bottomgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height));
        geometry1.merge(bottomgeo);
        var cylgeo = new THREE.CylinderGeometry(innerRadius, innerRadius, height, segments, 8, true, startTheta, thetaLength);
        cylgeo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        cylgeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/2));
        cylgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height/2));
        geometry1.merge(cylgeo);

        var cylgeo = new THREE.CylinderGeometry(outerRadius, outerRadius, height, segments, 8, true, startTheta, thetaLength);
        cylgeo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        cylgeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/2));
        cylgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height/2));
        geometry1.merge(cylgeo);

        // start theta rect
        var rectGeo1 = rectangleShape(height,outerRadius - innerRadius);
        rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        rectGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(innerRadius, 0, 0));
        rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationZ(startTheta));
        geometry1.merge(rectGeo1);

        // end rect
        var rectGeo1 = rectangleShape(height,outerRadius - innerRadius);
        rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
        rectGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(innerRadius, 0, 0));
        rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationZ(startTheta+thetaLength));
        geometry1.merge(rectGeo1);
                
        return geometry1;
    }
    function rectangleShape(rectLength, rectWidth) {
        var rectShape = new THREE.Shape();
        rectShape.moveTo( 0,0 );
        rectShape.lineTo( 0, rectWidth );
        rectShape.lineTo( rectLength, rectWidth );
        rectShape.lineTo( rectLength, 0 );
        rectShape.lineTo( 0, 0 );
        
        var rectGeom = new THREE.ShapeGeometry( rectShape );
        return rectGeom;
    }
    function buildRingMeshOld() {
        //if (material == undefined) {
        //    material = new THREE.MeshNormalMaterial();
        //    material.side = THREE.DoubleSide;
        //}
		var material = new THREE.MeshLambertMaterial( { 
                                                     map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ) } );
        material.side = THREE.DoubleSide;
        var pts = [
                    new THREE.Vector3(15,0,5),//top left
                    new THREE.Vector3(20,0,5),//top right
                    new THREE.Vector3(20,0,-5),//bottom right
                    new THREE.Vector3(15,0,-5),//bottom left
                    new THREE.Vector3(15,0,5)//back to top left - close square path
                   ];   //xxxx
        var geometry = new THREE.LatheGeometry( pts, 900 )
        var mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI/2);
        return mesh;
    }
    function buildRingMeshExtrude() {
		var material = new THREE.MeshLambertMaterial( { 
                                                     map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ) } );
        material.side = THREE.DoubleSide;
        var geometry1 = new THREE.RingGeometry( 30, 50, 9, 128, 0, Math.PI/4.5);
        //geometry1.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
        //var geometry2 = new THREE.RingGeometry( 30, 50, 32);
        //geometry2.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0,-40));
        //THREE.GeometryUtils.merge(geometry1, geometry2);

        var mesh = new THREE.Mesh( geometry1, material ); 
        mesh.rotateX(Math.PI/2);

        var extrudeSettings = {
            amount			: 20,
            steps			: 50,
            material		: 1,
            extrudeMaterial : 0,
            bevelEnabled	: false,
        };
        
        var pts = [];
        for (var i = 0; i < geometry1.vertices.length; i++) {
            pts.push(new THREE.Vector2(geometry1.vertices[i].x, geometry1.vertices[i].y));
            console.log(pts[pts.length-1]);
        }
        var shape = new THREE.Shape(pts);
        var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        
        //var material = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
        var mesh = new THREE.Mesh( geometry, material ); 
        return mesh;
        
    }
    function postProcessing() {
        _that._renderer.autoClear = false;
        
        var renderModel = new THREE.RenderPass( _that._scene, _that._camera );
        var effectBloom = new THREE.BloomPass( 0.25 );
        var effectFilm = new THREE.FilmPass( 0.5, 0.125, 2048, false );
        
        effectFilm.renderToScreen = true;
        
        _that._composer = new THREE.EffectComposer( _that._renderer );
        
        _that._composer.addPass( renderModel );
        //_that._composer.addPass( effectBloom );
        _that._composer.addPass( effectFilm );
    }
    function animate() {
        requestAnimationFrame( animate );    
        render();
    }
    var _tick = 0;
    function render() {
        //rotateCameraY(Math.PI/256);
    
        _that._renderer.render( _that._scene, _that._camera );
        _that._angleGuage.render();
        _that._positionGuage.render();
        
        document.getElementById('text1').innerHTML = "<nobr>("
                + Math.floor(_that._camera.position.x) + ","
                + Math.floor(_that._camera.position.y) + ","
                + Math.floor(_that._camera.position.z) + ")</nobr>" ;
		//_that._controls.update( clock.getDelta() );

    }
    var _radians = 0;
    function rotateCameraY(radians) {
        var x = _that._camera.position.x;	var y = _that._camera.position.y;	var z = _that._camera.position.z;
        var signx = x > 0 ? 1 : -1;
    
        // get current radians from z and x coords.
        _radians = x == 0 ? Math.PI/2 : Math.atan(z/x);
        if (signx == -1) _radians += Math.PI;
    
        _radians += radians;
        if (_radians > Math.PI*2) _radians = _radians%(Math.PI*2);
        while (_radians < 0) _radians += Math.PI*2;
    
        var radius = Math.sqrt(x*x + z*z);
        _that._camera.position.x = radius * Math.cos(_radians);
        _that._camera.position.z = radius * Math.sin(_radians);
        //__that._camera.position.y = 4;
        _that._camera.lookAt(new THREE.Vector3(0,0,0));
    }
}