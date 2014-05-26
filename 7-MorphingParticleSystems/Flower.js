function flowerFactory(scene) {
    this._scene = scene;
    this._meshes = [];
    //this._spheres = {};


    this._lastOrbDrawn = 0;
    this.updateFlowers = function(tick) {

        for (var i = 0; i < this._meshes.length; i++) {
            var obj = this._meshes[i];
            if (tick == 0) {
                obj.doMorph(0);
            }
            else {
                obj.doMorph(tick);
            }
        }
    }
    this.addMorphMesh = function
    (x,y,z, geometry, material, morphStart, morphEnd, morphDelta, morphOscillate, scale, chakraNumber, color) {
        // morphInfluence = 0 means show func1, = 1 means show morphFunc
        mesh = new THREE.Mesh( geometry, material );
        //mesh.scale.x = scale;
        //mesh.scale.y = scale;
        //mesh.scale.z = scale;
        //mesh.position.x = x;
        //mesh.position.y = y;
        //mesh.position.z = z;
        this._scene.add( mesh );
        var obj = { _x: x, _y : y, _z: z, _mesh: mesh, _chakraNumber: chakraNumber,
            _tickDelay: 100000, _color: color,
            _morphStart : morphStart, _morphEnd : morphEnd, _morphDelta : morphDelta, _morphOscillate : morphOscillate,
            doMorph :
                function (tick) {
                    var obj = this;
                    var mi;
                    if (tick == -1) {
                        mi = obj._morphStart;   // used for delay when setting up
                    }
                    else
                    if (tick == 0) {    // first time
                        mi = obj._morphStart;
                        obj._morphDirection = obj._morphDelta < 0 ? -1 : 1;
                        obj._morphDelta = Math.abs(obj._morphDelta);
                    }
                    else {
                        mi = obj._morphInfluence + obj._morphDelta * obj._morphDirection;
                        if ((mi > obj._morphEnd && mi > obj._morphStart) || (mi < obj._morphEnd && mi < obj._morphStart)) {
                            if (obj._morphOscillate)
                                obj._morphDirection *= -1;
                            else
                                obj._morphDirection = 0;
                        }
                    }
                    obj._morphInfluence = mi;
                    //console.log(mi);
                    obj._mesh.morphTargetInfluences [ 0 ] = obj._morphInfluence;
                }
            };
        this._meshes.push(obj);
        return mesh;
    }
    this.morphGeo = function(func1, func2) {
        var func1Geo = new THREE.ParametricGeometry(func1, 90, 90, false);
        var func2Geo = new THREE.ParametricGeometry(func2, 90, 90, false);
        func1Geo.morphTargets.push( { name: "target0", vertices: func2Geo.vertices } );
        func1Geo.computeMorphNormals();
        return func1Geo;
    }
    this.chakra = function(x,y,z,nPetals, color, speed, chakraNumber, flatness, size) {
        var cupFunc = funcGetCupFunc(nPetals);
        var flatFunc = funcGetFlatFunc(nPetals, flatness, size);
        var geo = this.morphGeo(flatFunc, cupFunc);
        var material2 = new THREE.MeshPhongMaterial(
        { ambient: 0x555555, color: color, specular: color , shininess: 10,shading: THREE.SmoothShading, morphTargets: true }  );
        var mesh = this.addMorphMesh(x,y,z, geo, material2, 1,.1, -0.01 * speed, false, 1.4, chakraNumber, color);
        mesh.rotation.x = chakraNumber == 7 ? Math.PI/4 : 0;
        var pointLight = new THREE.PointLight( 0xffffff, 1, 30 );
        pointLight.position.set(x, y, z+5 );
        _scene.add( pointLight );
        //var sphere = new THREE.Mesh( 
        //     new THREE.SphereGeometry(size*3,16,8),
        //     new THREE.MeshBasicMaterial( { color: color, opacity: 0.8, blending: THREE.AdditiveBlending, transparent: true } ) );
        ////if (this._spheres.length < 7) {
        //    sphere.position.x = x;
        //    sphere.position.y = y;
        //    sphere.position.z = z;
        //    _scene.add(sphere);
        //    //this._spheres.push(sphere);
        //    this._spheres[chakraNumber] = sphere;
        ////}
    }
    this.testPlot = function(x,y,z) {
    	var mesh;
        var Mat = new THREE.MeshLambertMaterial({color: 0xaaaaaa, opacity: 1 });
        var Mat2 = new THREE.MeshLambertMaterial({color: 0xddaaaa, opacity: 1 });

        var Geo1 = new THREE.ParametricGeometry(flatDisk, 90, 90, false);
        mesh = new THREE.Mesh( Geo1, Mat );
        mesh.position.x = x - 40; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        var Geo3 = new THREE.ParametricGeometry(funcLeaves, 90, 90, false);
        mesh = new THREE.Mesh( Geo3, Mat );
        mesh.position.x = x - 20; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        var Geo2 = new THREE.ParametricGeometry(funcCup, 90, 90, false);
        var mesh = new THREE.Mesh( Geo2, Mat );
        mesh.position.x = x; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        var Geo4 = new THREE.ParametricGeometry(funcMuladhara, 90, 90, false);
        mesh = new THREE.Mesh( Geo4, Mat );
        mesh.position.x = x + 20; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        var Geo5 = new THREE.ParametricGeometry(funcFlatChakra, 90, 90, false);
        mesh = new THREE.Mesh( Geo5, Mat );
        mesh.position.x = x + 40; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        var Geo6 = new THREE.ParametricGeometry(funcCupChakra, 90, 90, false);
        mesh = new THREE.Mesh( Geo6, Mat );
        mesh.position.x = x + 60; mesh.position.y = y; mesh.position.z = z;
        this._scene.add(mesh);
        return mesh;
    }
}
