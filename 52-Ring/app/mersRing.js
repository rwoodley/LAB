var _paramsBig = {
    base: 0,
    height: 20,
    innerRadius: 90,
    outerLowerRadius: 105,
    outerUpperRadius: 110
}
var _paramsSmall = {
    base: 0,
    height: 20,
    innerRadius: 30,
    outerLowerRadius: 45,
    outerUpperRadius: 50
}

function buildRingMesh(scene, showBoundingBox, params, addParticles) {

    for (var i = 0; i < 9; i++) {
        //var color = chroma.scale('RdYlBu').mode('lab')(i/9).hex();
        //var material =  new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } );
        var material = getMaterial(i);
        var geometry1 = getWedgeGeo(
                                    i*Math.PI/4.5,
                                    Math.PI/4.51,            // the 4.51 ensures a tiny gap between wedges
                                    params.base,
                                    params.height,
                                    9,
                                    params.innerRadius,
                                    params.outerLowerRadius,
                                    params.outerUpperRadius
                                    );  
        var mesh = new THREE.Mesh( geometry1, material ); 
        mesh.rotateX(Math.PI/2);
        mesh.castShadow = true;
        scene.add(mesh);
        
        if (addParticles)
            fillWedgeWithParticles(i, scene, 50,
                                        _mersColors[i],
                                        i*Math.PI/4.5,
                                        Math.PI/4.6,            // the 4.6 ensures a tiny gap between wedges
                                        params.base,
                                        params.height,
                                        9,
                                        params.innerRadius,
                                        params.outerLowerRadius,
                                        params.outerUpperRadius
                                );

        
        if (i == 0 && showBoundingBox) {
            var bbox = new THREE.BoundingBoxHelper( mesh, 0xff0000 );
            bbox.update();
            scene.add( bbox );
        }
    }
    return mesh;
}
function fillWedgeWithBubbles(room, scene, n, color, startTheta, thetaLength, base, height, segments, innerRadius, outerLowerRadius, outerUpperRadius) {
    console.log(color + "," + chroma(color).darken());
    var material = new THREE.MeshPhongMaterial( {
            color: color,
            emissive: chroma(color).brighten(10).hex(),
            specular: color,
            shininess: 10,
            shading: THREE.SmoothShading,
            opacity: .2, transparent: true } );
    //var material = getShaderMaterialByName('Shader2');
    for (var i = 0; i < n; i++) {
        var size  = Math.min(2.75,lnRandomScaled(.42,3));
        var y = Math.random() * (height-size*2) + base + size *2;
        var radius = Math.random() * (outerLowerRadius - innerRadius - size * 2) + innerRadius + size *2;
        var theta = Math.random() * thetaLength + startTheta;
        var x = radius * Math.cos(theta);
        var z = radius * Math.sin(theta);
        var mesh = new THREE.Mesh( new THREE.SphereGeometry( size, 16 , 16 ), material);
        mesh.position.set(x,y,z);
        //console.log(x + "," + y + "," + z);
        scene.add(mesh);
    }
}
function fillWedgeWithParticles(room, scene, n, color, startTheta, thetaLength, base, height, segments, innerRadius, outerLowerRadius, outerUpperRadius) {
        var radius = 200;
        var geometry = new THREE.Geometry();
        //var material = new THREE.MeshPhongMaterial( {
        //        color: color,
        //        emissive: chroma(color).brighten(10).hex(),
        //        specular: color,
        //        shininess: 10,
        //        shading: THREE.SmoothShading,
        //        opacity: .2, transparent: true } );
        var material = getShaderMaterialByName('ShaderParticle');
        for ( var i = 0; i < 10000; i ++ ) {

            var size  = Math.min(2.75,lnRandomScaled(.42,3));
            var y = Math.random() * (height-size*2) + base + size *2;
            var radius = Math.random() * (outerLowerRadius - innerRadius - size * 2) + innerRadius + size *2;
            var theta = Math.random() * thetaLength + startTheta;
            var x = radius * Math.cos(theta);
            var z = radius * Math.sin(theta);
            var vertex = new THREE.Vector3();
            vertex.x = x;
            vertex.y = y;
            vertex.z = z;

            geometry.vertices.push( vertex );

        }

        sphere = new THREE.PointCloud( geometry, material );

        var vertices = sphere.geometry.vertices;
        var values_size = attributes.size.value;
        var values_color = attributes.customColor.value;

        for ( var v = 0; v < vertices.length; v++ ) {
            var size  = Math.min(0.75,lnRandomScaled(.1,.3));
        
            values_size[ v ] = size;
            values_color[ v ] = new THREE.Color( color );
        
            if ( vertices[ v ].x < 0 )
                values_color[ v ].setHSL( 0.5 + 0.1 * ( v / vertices.length ), 0.7, 0.5 );
            else
                values_color[ v ].setHSL( 0.0 + 0.1 * ( v / vertices.length ), 0.9, 0.5 );
        
        }

        scene.add( sphere );
}
function getWedgeGeo(startTheta, thetaLength, base, height, segments, innerRadius, outerLowerRadius, outerUpperRadius) {

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
    //if (room == 8)
    //    return getMaterialByName('Shader2');
    //if (room == 2)
    //    return getMaterialByName('normal');
    //if (room == 3)
    //    return getMaterialByName('texture');
    //else
    //    return getMaterialByName('color');
    
    //var color = chroma.scale('RdYlBu').mode('lab')(room/9).hex();
    _mersColors = [0x45BCFF,0x45D6FF,0xFFFF9A,0x22D6FF,0x45CDFF,0x00C76D,0x45BCFF,0x904100,0x45C5FF];
    var color = _mersColors[room];
    return getMaterialByName('color', color);
}
_materials = [];
function getMaterialByName(name, color) {
    if (name == 'normal')
        return new THREE.MeshNormalMaterial({side: THREE.DoubleSide });
    if (name == 'Shader1') {
        var material = getShaderMaterialByName(name);
        _materials.push(material);
        return material;
    }
    if (name == 'Shader2') {
        var material = getShaderMaterialByName(name);
        _materials.push(material);
        return material;
    }
    if (name == 'texture') {
        return new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ), side: THREE.DoubleSide } );
    }
    if (name == 'color') {
        //console.log(color);
        return  new THREE.MeshPhongMaterial( {
            color: color,
            side: THREE.DoubleSide,
            emissive: chroma(color).darken(10).hex(),
            specular: color,
            shininess: 1,
            shading: THREE.SmoothShading,
            opacity: .85, transparent: true } );
    }
}
function renderMaterials(clockDelta) {
    for (var i = 0; i < _materials.length; i++) {
        _materials[i].uniforms.time.value += clockDelta;
    }
}
