var CameraPanel = function(objectCache) {
    var self = this;
    self.objectCache = objectCache;
    this.cameraTarget = 'pluto';
    this.clickHandler = function(objName) {
        self.cameraTarget = objName;
    }
    this.getTarget = function() {
        var objName = self.cameraTarget;
        if (objName == 'pluto')
            return objectCache.plutoMesh.position;
        if (objName == 'charon')
            return objectCache.charonMesh.position;
        return new THREE.Vector3(0,0,0);
    }
    this.lookAtTarget = function() {
        var objName = self.cameraTarget;
        if ((objName == 'pluto') || (objName == 'charon')) 
            objectCache.ship._camera.lookAt(this.getTarget());
    }
}