function buildRingMesh(scene) {

    for (var i = 0; i < 9; i++) {
        //var color = chroma.scale('RdYlBu').mode('lab')(i/9).hex();
        //var material =  new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } );
        var material = getMaterial(i);
        var geometry1 = getWedgeGeo(i*Math.PI/4.5, Math.PI/4.6);  // the 4.6 ensures a tiny gap between wedges
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
    var outerLowerRadius = 45;
    var outerUpperRadius = 50;

    // top ring
    var geometry1 = new THREE.RingGeometry( innerRadius, outerUpperRadius, segments, 8, startTheta, thetaLength);
    var bottomgeo = new THREE.RingGeometry( innerRadius, outerLowerRadius, segments, 8, startTheta, thetaLength);
    bottomgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height));
    geometry1.merge(bottomgeo);
    var cylgeo = new THREE.CylinderGeometry(innerRadius, innerRadius, height, segments, 8, true, startTheta, thetaLength);
    cylgeo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
    cylgeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/2));
    cylgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height/2));
    geometry1.merge(cylgeo);

    var cylgeo = new THREE.CylinderGeometry(outerUpperRadius, outerLowerRadius, height, segments, 8, true, startTheta, thetaLength);
    cylgeo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
    cylgeo.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/2));
    cylgeo.applyMatrix(new THREE.Matrix4().makeTranslation(0,  0, -height/2));
    geometry1.merge(cylgeo);

    // start theta rect
    var rectGeo1 = rectangleShape(height,outerUpperRadius - innerRadius, outerLowerRadius - innerRadius);
    rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    rectGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(innerRadius, 0, 0));
    rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationZ(startTheta));
    geometry1.merge(rectGeo1);

    // end rect
    var rectGeo1 = rectangleShape(height,outerUpperRadius - innerRadius, outerLowerRadius - innerRadius);
    rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    rectGeo1.applyMatrix(new THREE.Matrix4().makeTranslation(innerRadius, 0, 0));
    rectGeo1.applyMatrix(new THREE.Matrix4().makeRotationZ(startTheta+thetaLength));
    geometry1.merge(rectGeo1);
            
    return geometry1;
}
function rectangleShape(rectLength, topWidth, bottomWidth) {
    var rectShape = new THREE.Shape();
    rectShape.moveTo( 0,0 );
    rectShape.lineTo( 0, rectLength );
    rectShape.lineTo( bottomWidth, rectLength );
    rectShape.lineTo( topWidth, 0 );
    rectShape.lineTo( 0, 0 );
    
    var rectGeom = new THREE.ShapeGeometry( rectShape );
    return rectGeom;
}
function getMaterial(room) {
    return getMaterialByName('Shader1');
}
function getMaterialByName(name) {
    if (name == 'normal')
        return new THREE.MeshNormalMaterial({side: THREE.DoubleSide });
    if (name == 'Shader1') {
        var uniforms={
            baseTexture:{ type:"t", value:THREE.ImageUtils.loadTexture( 'textures/water.jpg') },
            baseSpeed:{  type:"f",  value:.6 },
            noiseTexture: { type:"t", value:THREE.ImageUtils.loadTexture( 'textures/noise.jpg') },
            noiseScale:{ type:"f", value:.1 },
            alpha:{ type:"f", value:.8 },
            time:{ type:"f", value:1},
            offsetX:{ type:"f", value:.9 },
            offsetY:{ type:"f", value:.85},
            tint:{type:"c", value:(new THREE.Color).setHex(16770000) }
        }
        
        return new THREE.ShaderMaterial(
            {
                uniforms: uniforms,
                vertexShader:document.getElementById("shader1Vertex").textContent,
                fragmentShader:document.getElementById("shader1Fragment").textContent,
                side: THREE.DoubleSide
            }
            );
            this.waterMaterial.depthTest=!0;
            var f=new THREE.PlaneGeometry(1000,1000);
            _that._watermesh=new THREE.Mesh(f,this.waterMaterial);
            _that._scene.add(_that._watermesh);
    }
    if (name == 'texture') {
        return new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ) } );
    }
    if (name == 'color') {
        return  new THREE.MeshPhongMaterial( { color: 'blue', side: THREE.DoubleSide } );
    }
}
