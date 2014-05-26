function flowerFactory(scene) {
    this._scene = scene;
    this._meshes = [];

    this.updateFlowers = function(tick) {
        for (var i = 0; i < this._meshes.length; i++) {
            var obj = this._meshes[i];
            obj._mesh.rotation.y += .004;
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
    this.flower = function(x,y,z) {
        var leafGeo = new THREE.ParametricGeometry(funcLeaves, 90, 90, false);
    	var leafMat = new THREE.MeshLambertMaterial({color: 0x00ffdd, opacity: 1 });
        mesh = new THREE.Mesh( leafGeo, leafMat );    
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.position.z = z;
        this._scene.add(mesh);
        var speed = .25;
        var material0 = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xddddff, specular: 0xff00ff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
        this.addMorphMesh(x,y,z, this._flat2CupGeo, material0, 1,.7, -0.01 * speed, false, 1);
        var material1 = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x0000ff, specular: 0xff00ff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
        this.addMorphMesh(x,y,z, this._flat2CupGeo, material1, 1,.5, -0.01 * speed, false, 1.2);
        var material2 = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0x4444dd, specular: 0xff00ff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
        return this.addMorphMesh(x,y,z, this._flat2CupGeo, material2, 1,.4, -0.01 * speed, false, 1.4);
    }
    // ---------
    //this._cup2FlatGeo = this.morphGeo(funcCup, flatDumpling);     // metallic effect
    this._flat2CupGeo = this.morphGeo(flatDumpling, funcCup);       // nice gradient effect.
	//var material = new THREE.MeshPhongMaterial({specular: _flowerSpecularColor, color: _flowerColor, shininess: 10, metal: false, morphTargets: true});
	//var material = new THREE.MeshLambertMaterial({color: _flowerColor, morphTargets: true, opacity: 1 });
    this._material = new THREE.MeshPhongMaterial( { ambient: 0x555555, color: 0xaa0000, specular: 0xff00ff, shininess: 50,shading: THREE.SmoothShading, morphTargets: true }  );
	this._material.side = THREE.DoubleSide;


}
