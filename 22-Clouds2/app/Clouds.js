var _cloudMinx = -6000;
var _cloudMaxx = 5000;
var _cloudLength = _cloudMaxx - _cloudMinx;
function addClouds(scene) {
    var geometry = new THREE.Geometry();
    var texture = THREE.ImageUtils.loadTexture( 'cloud10.png', null, animate );
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    //var material = new THREE.MeshLambertMaterial( { map: texture } );
    var fog = new THREE.Fog( 0xffffff, - 10000, 100000 );
    material = new THREE.ShaderMaterial( {

        uniforms: {

            "map": { type: "t", value: texture },
            "fogColor" : { type: "c", value: fog.color },
            "fogNear" : { type: "f", value: fog.near },
            "fogFar" : { type: "f", value: fog.far },

        },
        vertexShader: document.getElementById( 'vs' ).textContent,
        fragmentShader: document.getElementById( 'fs' ).textContent,
        depthWrite: false,
        depthTest: false,
        transparent: true

    } );
    //var material = new THREE.MeshLambertMaterial( { map: texture } );

    // TODO: have clouds in the center be more stretched than clouds on the outside.
    for ( var i = 0; i < 350; i++ ) {
        var cloudSize = Math.random() * 300 + 490;
        var plane = new THREE.Mesh( new THREE.PlaneGeometry( 900, 900 ), material );
        var ranx = Math.random();
        plane.position.x = ranx* (_cloudMaxx - _cloudMinx) + _cloudMinx;
        plane.position.z = calculateRandomCloudZFromXPos(plane.position.x);
        plane.position.x = calculateRandomCloudZFromXPos(plane.position.z);
        //plane.position.x *= 2;
        plane.position.y =  (800 + (Math.random() * 400 - 200));
        plane.rotation.x = -.5*Math.PI;
        plane.rotation.z = -.75*Math.PI;
        //plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

        //THREE.GeometryUtils.merge( geometry, plane );
        var cloudMesh = plane;
        clouds.push(cloudMesh);
        scaleCloud(cloudMesh);
        scene.add(cloudMesh);
    }
}
function scaleCloud(cloud) {
    // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    // note, slope of this line is -1.
    var xpos = Math.abs(cloud.position.x + cloud.position.z)/2;
    var sizeFactor = _windforce * Math.max(0, 400 - xpos)/200;
    cloud.scale.x = 1 + sizeFactor;
    //cloud.scale.y = sizeFactor;
    //cloud.scale.z = sizeFactor;
}
function calculateRandomCloudZFromXPos(x) {
        var dispersion = 0.5 * (_cloudMaxx - _cloudMinx);
        return -x + dispersion * Math.random() - dispersion /2;
}
var _windforce;
var _windtime = 0;
function moveClouds(camPos) {
    _windtime++;
    _windforce = Math.max(0, Math.sin(Math.PI * _windtime/10000));
    //console.log(_windforce);
    for (var i = 0; i < clouds.length; i++) {
        
        var cloud = clouds[i];

        // distance from diagonal:
        var xpos = (cloud.position.x + cloud.position.z)/2;
        var movement = Math.random() * 5;
        var movementScalar = _windforce * Math.max(0,1000-Math.abs(xpos))/250;
        cloud.position.x += movement*movementScalar + .2;
        cloud.position.z += -movement*movementScalar - .2;
        
        if (cloud.position.x > _cloudMaxx) { // cloud has gone of the right edge
            cloud.position.x = -calculateRandomCloudZFromXPos(_cloudMinx);
            cloud.position.z = calculateRandomCloudZFromXPos(_cloudMinx);
            //cloud.position.x -= _cloudLength;
            //cloud.position.z += _cloudLength;
        }
        //cloud.lookAt(camPos);
        scaleCloud(cloud);
    }
}
function scaleCloudOld(cloud) {
    // the point of this was to make the clouds small on the left and right
    // so they would grow out of nothing on the left and shrink back to nothing on the right.
    // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    // note, slope of this line is -1.
    var xpos = (cloud.position.x - cloud.position.z)/2;    
    var xposOnScaleOf0To1 = (xpos - _cloudMinx)/(_cloudMaxx - _cloudMinx);
    var sizeFactor = 1;
    var endPoint = .1;
    if (xposOnScaleOf0To1 < endPoint)
        sizeFactor = xposOnScaleOf0To1/endPoint;
    if (xposOnScaleOf0To1 > (1 - endPoint))
        sizeFactor = (1 - xposOnScaleOf0To1)/endPoint;
    if (sizeFactor < 0.01) sizeFactor = 0.01;
    cloud.scale.x = sizeFactor;
    cloud.scale.y = sizeFactor;
    cloud.scale.z = sizeFactor;
}
