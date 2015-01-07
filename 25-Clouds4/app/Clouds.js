var _cloudMinx = -190;
var _cloudMaxx = 160;
var _cloudLength = _cloudMaxx - _cloudMinx;
var _clouds = [];
function getCloudMaterial(noisefs,noisevs) {
    var texture = THREE.ImageUtils.loadTexture("seamless2.png");
    material = new THREE.ShaderMaterial( {
    uniforms: //THREE.UniformsUtils.merge([ // see: https://csantosbh.wordpress.com/2014/01/09/custom-shaders-with-three-js-uniforms-textures-and-lighting/ 
            {
              "map": { type: "t", value: texture },
              ambientLightColor : { type: "fv", value: [] },
              directionalLightDirection : { type: "fv", value: [] },
              directionalLightColor : { type: "fv", value: [] },
              hemisphereLightDirection : { type: "fv", value: [] },
              hemisphereLightSkyColor : { type: "fv", value: [] },
              hemisphereLightGroundColor : { type: "fv", value: [] },
              pointLightColor : { type: "fv", value: [] },
              pointLightPosition : { type: "fv", value: [] },
              pointLightDistance : { type: "fv1", value: [] },
              spotLightColor : { type: "fv", value: [] },
              spotLightPosition : { type: "fv", value: [] },
              spotLightDirection : { type: "fv", value: [] },
              spotLightDistance : { type: "fv1", value: [] },
              spotLightAngleCos : { type: "fv1", value: [] },
              spotLightExponent : { type: "fv1", value: [] }
            },
    // ]),
        vertexShader: noisevs,
        fragmentShader: noisefs,
        transparent: true,
        lights: true,
    } );
    return material;    
}
function addClouds(scene, geo, material) {
    // TODO: have clouds in the center be more stretched than clouds on the outside.
    for ( var i = 0; i < 10; i++ ) {
        // var cloudSize = Math.random() * 300 + 490;
        var plane = new THREE.Mesh( geo, material );
        plane.scale.x = 1;
        plane.scale.z = 1;
        plane.scale.y = .8;
        var ranx = Math.random();
        plane.position.y = 10;
        plane.position.x = ranx* (_cloudMaxx - _cloudMinx) + _cloudMinx;
        // plane.position.z = -plane.position.x;
        plane.position.z = calculateRandomCloudZFromXPos(plane.position.x);
        plane.position.x = calculateRandomCloudZFromXPos(plane.position.z);

        // plane.position.y =  (800 + (Math.random() * 400 - 200));
        // plane.rotation.x = -.5*Math.PI;
        // plane.rotation.z = -.75*Math.PI;

        var cloudMesh = plane;
        _clouds.push(cloudMesh);
        //scaleCloud(cloudMesh);
        scene.add(cloudMesh);
    }
    console.log('len = ' + _clouds.length);
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
var _overallSpeedFudgeFactor = .05;
function moveClouds() {
    _windtime++;
    _windforce = Math.max(0, Math.min(.1,Math.sin(Math.PI * _windtime/10000)));
    //console.log(_windforce);
    for (var i = 0; i < _clouds.length; i++) {
        
        var cloud = _clouds[i];

        // distance from diagonal:
        var xpos = (cloud.position.x + cloud.position.z)/2;
        var movement = Math.random() * 4;
        var movementScalar = _windforce * Math.max(0,1000-Math.abs(xpos))/250;
        cloud.position.x += _overallSpeedFudgeFactor * (movement*movementScalar + .2);
        cloud.position.z += _overallSpeedFudgeFactor * (-movement*movementScalar - .2);
        
        if (cloud.position.x > _cloudMaxx) { // cloud has gone of the right edge
            cloud.position.x = -calculateRandomCloudZFromXPos(_cloudMinx);
            cloud.position.z = calculateRandomCloudZFromXPos(_cloudMinx);
            //cloud.position.x -= _cloudLength;
            //cloud.position.z += _cloudLength;
        }
        //scaleCloud(cloud);
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
