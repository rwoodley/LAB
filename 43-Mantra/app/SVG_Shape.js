function drawShape(svgElement, glyph) {


    //var svgString = svgElement.getAttribute("d");
    var svgString = document.querySelector("#" + glyph).getAttribute("d");
    var shape = transformSVGPathExposed(svgString);
    var shapeGeo = new THREE.ShapeGeometry(shape[0]);

    return shapeGeo;
}
function drawShapeWithHole(svgElement, glyph, hole) {
    var svgString = document.querySelector("#" + glyph).getAttribute("d");
    var shape = transformSVGPathExposed(svgString);

    var svgString = document.querySelector("#" + hole).getAttribute("d");
    var holeShape = transformSVGPathExposed(svgString);
    var holePoints = holeShape[0].extractAllPoints().shape;
    var holePath = new THREE.Path(holePoints);
    //for (var i = 0; i < holePoints.length; i++)
    //    shape[0].holes.push(holePoints[i]);
    shape[0].holes.push(holePath);
    
    var shapeGeo = new THREE.ShapeGeometry(shape[0]);
    return shapeGeo;
}
