function makeProfileLatheMesh(material) {
    var svgString = $("#muffin").attr("d");
    var shape = transformSVGPathExposed(svgString);

    ////var extrudeSettings = { amount: 148, bevelEnabled: true, bevelSegments: 9, steps: 10, bevelSize: 10, bevelThickness: 10 };    
    ////
    ////var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings );
    //geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
    //assignUVs(geometry);
    ////geometry.scale(.1,.1,.1);
    ////geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-10,0));
    //geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
    //geometry.center();
    //var mesh = new THREE.Mesh( geometry, material);
    //mesh.scale.set(.3,.3,.3);
    ////return mesh;

    var points = [];
    var minx = shape[0].extractPoints(10).shape[0].x;
    var maxx = shape[0].extractPoints(10).shape[0].x;
    var minz = shape[0].extractPoints(10).shape[0].y;
    var maxz = shape[0].extractPoints(10).shape[0].y;
    for (index in shape[0].extractPoints(10).shape) {
        var vec2 = shape[0].extractPoints(10).shape[index];
        points.push(new THREE.Vector3(vec2.x,0,vec2.y));
        if (vec2.x < minx) minx = vec2.x;
        if (vec2.x > maxx) maxx = vec2.x;
        if (vec2.z < minz) minz = vec2.z;
        if (vec2.z > maxz) maxz = vec2.z;
    }
    for (index in points) {
        points[index].x = maxx - points[index].x;
        points[index].z = points[index].z - minz;    // turn it upside down.
    }
    
    var geometry = new THREE.LatheGeometry(points, 32);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
    //assignUVs(geometry);
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI/2);
    mesh.scale.set(.4,.4,.4);
    //mesh.overdraw = true;
    // mesh.doubleSided = false;
    return mesh;

}

assignUVs2 = function( geometry ){
    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range   = new THREE.Vector2(max.x - min.x, max.y - min.y);


    geometry.faceVertexUvs[0] = [];

    geometry.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geometry.vertices[face.a];
        var v2 = geometry.vertices[face.b];
        var v3 = geometry.vertices[face.c];

        geometry.faceVertexUvs[0].push([
            new THREE.Vector2((v1[components[0]] + offset.x)/range.x, (v1[components[1]]+ offset.y ) / range.y),
            new THREE.Vector2((v2[components[0]] + offset.x)/range.x, (v2[components[1]]+ offset.y ) / range.y),
            new THREE.Vector2((v3[components[0]] + offset.x)/range.x, (v3[components[1]]+ offset.y ) / range.y),
            //new THREE.Vector2(v2[components[0]], v2[components[1]]),
            //new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });

    geometry.uvsNeedUpdate = true;
}
assignUVs = function( geometry ){

    geometry.computeBoundingBox();

    var max     = geometry.boundingBox.max;
    var min     = geometry.boundingBox.min;

    var offset  = new THREE.Vector2(0 - min.x, 0 - min.z);
    var range   = new THREE.Vector2(max.x - min.x, max.z - min.z);

    geometry.faceVertexUvs[0] = [];
    var faces = geometry.faces;

    for (i = 0; i < geometry.faces.length ; i++) {

      var v1 = geometry.vertices[faces[i].a];
      var v2 = geometry.vertices[faces[i].b];
      var v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2( ( v1.x + offset.x ) / range.x , ( v1.z + offset.y ) / range.y ),
        new THREE.Vector2( ( v2.x + offset.x ) / range.x , ( v2.z + offset.y ) / range.y ),
        new THREE.Vector2( ( v3.x + offset.x ) / range.x , ( v3.z + offset.y ) / range.y )
      ]);

    }

    geometry.uvsNeedUpdate = true;

}