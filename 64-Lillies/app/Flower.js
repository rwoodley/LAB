function flowerFactory(scene) {
    this._scene = scene;
    this._meshes = [];

    this.updateFlowers = function(tick) {
        for (var i = 0; i < this._meshes.length; i++) {
            var obj = this._meshes[i];
            //obj._mesh.rotation.y += .004;
            obj.doMorph(tick);        
        }
    }
    this.addMorphMesh = function(x,y,z, geometry, material, morphStart, morphEnd, morphDelta, morphOscillate, scale) {
        // morphInfluence = 0 means show func1, = 1 means show morphFunc
        mesh = new THREE.Mesh( geometry, material );
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.scale.z = scale;
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        this._scene.add( mesh );
        var obj = { _x: x, _y : y, _z: z, _mesh: mesh,
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
                        mi = obj._morphStart + tick * obj._morphDelta * obj._morphDirection;
                        if ((mi > obj._morphEnd && mi > obj._morphStart) || (mi < obj._morphEnd && mi < obj._morphStart)) {
                            // if (obj._morphOscillate)
                            //     obj._morphDirection *= -1;
                            // else
                            mi = obj._morphInfluence;
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
    this.flower = function(x,y,z, scale) {
        var retval = {}
        var leafGeo = new THREE.ParametricGeometry(funcLeaves, 90, 90, false);
    	var leafMat = new THREE.MeshPhongMaterial({color: 0xff28ff, opacity: 1 });
        this._material1 = leafMat;
        mesh = new THREE.Mesh( leafGeo, leafMat );    
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        mesh.scale.set(scale, scale, scale);
        this._scene.add(mesh);
        retval.mesh1 = mesh;

        var petalsGeo = new THREE.ParametricGeometry(funcPetals, 90, 90, false);
    	var petalsMat = new THREE.MeshPhongMaterial({color: 0x0065ff, opacity: 1 });
        mesh = new THREE.Mesh( petalsGeo, petalsMat );    
        mesh.position.x = x;
        mesh.position.y = y-1;
        mesh.position.z = z;
        mesh.scale.set(scale, scale, scale);
        this._scene.add(mesh);
        retval.mesh2 = mesh;

        var speed = .5;
        //var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x007765, specular: 0x00ffff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
        var material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x5100ff, specular: 0x00ffff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
        var flat2CupGeo = this.morphGeo(flatDumpling, funcCup);
        var mesh = this.addMorphMesh(x,y,z, flat2CupGeo, material, 1,.4, -0.1 * speed, false, 1.4);
        mesh.scale.set(scale, scale, scale);
        retval.mesh3 = mesh;
        return retval;
    }
}
