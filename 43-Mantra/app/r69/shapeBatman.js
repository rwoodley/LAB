function drawShape(svgElement) {


    var svgString = svgElement.getAttribute("d");

    var shape = transformSVGPathExposed(svgString);
    var shapeGeo = new THREE.ShapeGeometry(drawShape());

    // return the shape
    return shapeGeo;
}
