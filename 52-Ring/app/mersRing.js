function buildRingMesh(scene) {
    var material = new THREE.MeshLambertMaterial( { 
                                                 map: THREE.ImageUtils.loadTexture( 'textures/mers.png' ) } );

    for (var i = 0; i < 9; i++) {
        var color = chroma.scale('RdYlBu').mode('lab')(i/9).hex();
        var material =  new THREE.MeshPhongMaterial( { color: color, side: THREE.DoubleSide } );
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
