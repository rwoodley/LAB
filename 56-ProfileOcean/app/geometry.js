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
        points[index].z -= minz;    // turn it upside down.
    }
    
    var geometry = new THREE.LatheGeometry(points, 48);
    geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI));
    assignUVs(geometry);
    
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(-Math.PI/2);
    mesh.scale.set(.05,.05,.05);
    //mesh.overdraw = true;
    //mesh.doubleSided = true;
    return mesh;

}

function profileMeshOld(material) {
    var ctx = new THREE.Shape();
        
    ctx.moveTo(201.295,551.723);
    ctx.bezierCurveTo(195.457,547.212,189.617,542.6959999999999,183.77599999999998,538.1809999999999);
    ctx.bezierCurveTo(181.23399999999998,536.2199999999999,178.65999999999997,534.218,176.73899999999998,531.6489999999999);
    ctx.bezierCurveTo(173.15599999999998,526.8399999999999,172.23399999999998,520.4489999999998,173.04299999999998,514.512);
    ctx.bezierCurveTo(173.85399999999998,508.5729999999999,176.236,502.97399999999993,178.75599999999997,497.53299999999996);
    ctx.bezierCurveTo(180.55499999999998,493.65399999999994,182.45699999999997,489.77699999999993,185.08699999999996,486.4);
    ctx.bezierCurveTo(190.13899999999995,479.91499999999996,197.50399999999996,475.719,204.67099999999996,471.695);
    ctx.bezierCurveTo(207.24599999999995,470.245,209.85899999999995,468.784,212.71899999999997,468.048);
    ctx.bezierCurveTo(219.00499999999997,466.434,225.62599999999998,468.51,231.57099999999997,471.109);
    ctx.bezierCurveTo(239.71399999999997,474.671,247.40299999999996,479.26,254.39899999999997,484.738);
    ctx.bezierCurveTo(255.15199999999996,485.328,255.92799999999997,485.968,256.27599999999995,486.857);
    ctx.bezierCurveTo(256.81499999999994,488.22900000000004,256.19599999999997,489.757,256.13899999999995,491.232);
    ctx.bezierCurveTo(256.00299999999993,494.69300000000004,258.984,497.5,262.08299999999997,499.04900000000004);
    ctx.bezierCurveTo(265.183,500.59600000000006,268.68199999999996,501.444,271.385,503.61100000000005);
    ctx.bezierCurveTo(272.006,504.1050000000001,272.594,504.70000000000005,272.839,505.458);
    ctx.bezierCurveTo(273.799,508.41600000000005,269.104,510.937,269.903,513.946);
    ctx.bezierCurveTo(272.516,515.243,274.06600000000003,518.392,273.495,521.2520000000001);
    ctx.bezierCurveTo(276.754,525.541,273.895,531.7320000000001,274.82800000000003,537.033);
    ctx.bezierCurveTo(275.32200000000006,539.844,276.88500000000005,542.336,277.783,545.041);
    ctx.bezierCurveTo(278.67900000000003,547.749,278.75100000000003,551.099,276.688,553.0630000000001);
    ctx.bezierCurveTo(274.741,554.9220000000001,271.65,554.2560000000001,269.034,554.8910000000001);
    ctx.bezierCurveTo(263.253,556.2940000000001,256.241,559.975,241.53799999999998,560.123);
    ctx.bezierCurveTo(232.188,560.2180000000001,222.59699999999998,563.2950000000001,213.932,559.773);
    ctx.bezierCurveTo(209.289,557.892,205.26,554.79,201.295,551.723);
    
    var extrudeSettings = { amount: 148, bevelEnabled: true, bevelSegments: 9, steps: 10, bevelSize: 10, bevelThickness: 10 };    
    var geometry = new THREE.ExtrudeGeometry( ctx, extrudeSettings );
    assignUVs(geometry);
    //geometry.scale(.1,.1,.1);
    //geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,-10,0));
    geometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI));
    geometry.center();
    var mesh = new THREE.Mesh( geometry, material);
    mesh.scale.set(.3,.3,.3);
    //return mesh;

    var mesh = new THREE.Mesh( new THREE.LatheGeometry( ctx, 12 ), new THREE.MeshNormalMaterial( ));
    mesh.position.y = 150;
    mesh.overdraw = true;
    mesh.doubleSided = true;
    return mesh;

};
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