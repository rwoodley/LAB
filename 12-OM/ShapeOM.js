function geo_OM() {
    
    // 3 parts to the OM glyph: bottom, top, circle

    var bottomPoints = [];
    addBottomPoints(bottomPoints);
    var minMax = initMinMax(bottomPoints[0]);
    updateMinMax(bottomPoints,minMax);
    var topPoints = [];
    addTopPoints(topPoints);
    updateMinMax(topPoints,minMax);
    var circlePoints = [];
    addCirclePoints(circlePoints);
    updateMinMax(circlePoints,minMax);
    
    scalePoints(bottomPoints, 0, 1, minMax);
    scalePoints(topPoints, 0, 1, minMax);
    scalePoints(circlePoints, 0, 1, minMax);

    // this whole thing has an x dimension of 1 (see prev call)
    var options = {
      amount: .05 ,
      bevelThickness: 2,
      bevelSize: 1,
      bevelSegments: 3,
      bevelEnabled: false,
    };

    var shape = new THREE.Shape();
    addPointsToShape(shape, bottomPoints);
    var geo1 = new THREE.ExtrudeGeometry(shape, options)

    shape = new THREE.Shape();
    addPointsToShape(shape, topPoints);
    var geo2 = new THREE.ExtrudeGeometry(shape, options);
    
    THREE.GeometryUtils.merge(geo1, geo2);

    shape = new THREE.Shape();
    addPointsToShape(shape, circlePoints);
    var geo3 = new THREE.ExtrudeGeometry(shape, options);
    
    THREE.GeometryUtils.merge(geo1, geo3);
    return geo1;
}
function initMinMax(point) {
    return {
    xmin :  point.x,
    xmax :  point.x,
    ymin :  point.y,
    ymax :  point.y
    }
}
function updateMinMax(points, minMax) {
    for (var i = 0; i < points.length; i++) {
        if (points[i].x < minMax.xmin) minMax.xmin = points[i].x;
        if (points[i].y < minMax.ymin) minMax.ymin = points[i].y;
        if (points[i].x > minMax.xmax) minMax.xmax = points[i].x;
        if (points[i].y > minMax.ymax) minMax.ymax = points[i].y;
    }
}
function addPointsToShape(shape, points) {
    shape.moveTo(points[0].x,points[1].y);
    for (var i = 1; i < points.length; i++)
        shape.lineTo(points[i].x, points[i].y);
}
function scalePoints(points, min, max, minMax) {    // min and max apply to x axis. y is aspect ratio times this.
    var aspectRatio = (minMax.ymax-minMax.ymin)/(minMax.xmax-minMax.xmin);
    for (var i = 0; i < points.length; i++) {
        points[i].x = (points[i].x)/(minMax.xmax - minMax.xmin) * (max - min);
        points[i].y = (points[i].y)/(minMax.ymax - minMax.ymin) * (max - min)*aspectRatio;
    }
}
// 3 parts to the OM glyph: bottom, top, circle
function addBottomPoints(_points) {
        _points.push({x: 42, y:197});
        _points.push({x: 143, y:197});
        _points.push({x: 127, y:252});
        _points.push({x: 96, y:253});
        _points.push({x: 58, y:307});
        _points.push({x: 51, y:350});
        _points.push({x: 69, y:378});
        _points.push({x: 110, y:390});
        _points.push({x: 140, y:392});
        _points.push({x: 173, y:391});
        _points.push({x: 202, y:382});
        _points.push({x: 218, y:369});
        _points.push({x: 208, y:353});
        _points.push({x: 192, y:344});
        _points.push({x: 143, y:340});
        _points.push({x: 182, y:255});
        _points.push({x: 165, y:252});
        _points.push({x: 184, y:199});
        _points.push({x: 307, y:197});
        _points.push({x: 300, y:218});
        _points.push({x: 297, y:234});
        _points.push({x: 299, y:252});
        _points.push({x: 311, y:287});
        _points.push({x: 347, y:342});
        _points.push({x: 372, y:400});
        _points.push({x: 392, y:456});
        _points.push({x: 400, y:428});
        _points.push({x: 399, y:400});
        _points.push({x: 394, y:352});
        _points.push({x: 390, y:306});
        _points.push({x: 390, y:285});
        _points.push({x: 392, y:258});
        _points.push({x: 392, y:254});
        _points.push({x: 365, y:253});
        _points.push({x: 384, y:200});
        _points.push({x: 457, y:201});
        _points.push({x: 447, y:240});
        _points.push({x: 437, y:332});
        _points.push({x: 431, y:446});
        _points.push({x: 422, y:515});
        _points.push({x: 419, y:531});
        _points.push({x: 409, y:539});
        _points.push({x: 397, y:522});
        _points.push({x: 389, y:492});
        _points.push({x: 367, y:448});
        _points.push({x: 319, y:365});
        _points.push({x: 269, y:302});
        _points.push({x: 213, y:253});
        _points.push({x: 202, y:257});
        _points.push({x: 188, y:288});
        _points.push({x: 184, y:291});
        _points.push({x: 205, y:302});
        _points.push({x: 228, y:329});
        _points.push({x: 237, y:364});
        _points.push({x: 233, y:388});
        _points.push({x: 223, y:406});
        _points.push({x: 205, y:418});
        _points.push({x: 178, y:428});
        _points.push({x: 138, y:433});
        _points.push({x: 100, y:433});
        _points.push({x: 76, y:425});
        _points.push({x: 51, y:409});
        _points.push({x: 43, y:399});
        _points.push({x: 31, y:369});
        _points.push({x: 31, y:342});
        _points.push({x: 37, y:315});
        _points.push({x: 45, y:289});
        _points.push({x: 54, y:271});
        _points.push({x: 62, y:261});
        _points.push({x: 63, y:255});
        _points.push({x: 56, y:251});
        _points.push({x: 28, y:251});
        }
    function addTopPoints(_points) {
        _points.push({x: 64, y:96});
        _points.push({x: 86, y:98});
        _points.push({x: 102, y:101});
        _points.push({x: 118, y:108});
        _points.push({x: 133, y:121});
        _points.push({x: 143, y:131});
        _points.push({x: 159, y:155});
        _points.push({x: 163, y:147});
        _points.push({x: 175, y:131});
        _points.push({x: 190, y:119});
        _points.push({x: 215, y:104});
        _points.push({x: 248, y:98});
        _points.push({x: 275, y:94});
        _points.push({x: 316, y:92});
        _points.push({x: 362, y:89});
        _points.push({x: 399, y:84});
        _points.push({x: 433, y:77});
        _points.push({x: 451, y:70});
        _points.push({x: 458, y:61});
        _points.push({x: 463, y:55});
        _points.push({x: 472, y:60});
        _points.push({x: 472, y:65});
        _points.push({x: 457, y:80});
        _points.push({x: 438, y:92});
        _points.push({x: 413, y:105});
        _points.push({x: 388, y:115});
        _points.push({x: 349, y:125});
        _points.push({x: 298, y:132});
        _points.push({x: 259, y:135});
        _points.push({x: 227, y:137});
        _points.push({x: 204, y:141});
        _points.push({x: 187, y:147});
        _points.push({x: 172, y:158});
        _points.push({x: 165, y:167});
        _points.push({x: 162, y:177});
        _points.push({x: 144, y:164});
        _points.push({x: 123, y:150});
        _points.push({x: 99, y:143});
        _points.push({x: 71, y:137});
        _points.push({x: 54, y:136});
        _points.push({x: 43, y:135});
        _points.push({x: 60, y:100});
        }
    function addCirclePoints(_points) {
        _points.push({x: 145, y:69});
        _points.push({x: 140, y:66});
        _points.push({x: 136, y:59});
        _points.push({x: 134, y:54});
        _points.push({x: 134, y:48});
        _points.push({x: 138, y:41});
        _points.push({x: 145, y:38});
        _points.push({x: 151, y:36});
        _points.push({x: 160, y:34});
        _points.push({x: 167, y:36});
        _points.push({x: 172, y:38});
        _points.push({x: 177, y:44});
        _points.push({x: 179, y:49});
        _points.push({x: 180, y:57});
        _points.push({x: 179, y:65});
        _points.push({x: 170, y:69});
        _points.push({x: 159, y:69});
        _points.push({x: 151, y:69});
        _points.push({x: 147, y:69});
        _points.push({x: 135, y:82});
        _points.push({x: 148, y:83});
        _points.push({x: 157, y:83});
        _points.push({x: 171, y:80});
        _points.push({x: 178, y:77});
        _points.push({x: 186, y:73});
        _points.push({x: 193, y:66});
        _points.push({x: 196, y:62});
        _points.push({x: 200, y:58});
        _points.push({x: 202, y:50});
        _points.push({x: 202, y:41});
        _points.push({x: 199, y:32});
        _points.push({x: 193, y:28});
        _points.push({x: 185, y:27});
        _points.push({x: 173, y:23});
        _points.push({x: 164, y:23});
        _points.push({x: 156, y:23});
        _points.push({x: 146, y:26});
        _points.push({x: 135, y:31});
        _points.push({x: 129, y:34});
        _points.push({x: 124, y:39});
        _points.push({x: 118, y:45});
        _points.push({x: 116, y:54});
        _points.push({x: 118, y:62});
        _points.push({x: 120, y:67});
        _points.push({x: 125, y:72});
        _points.push({x: 130, y:75});
        _points.push({x: 137, y:77});
        _points.push({x: 139, y:82});
    }
