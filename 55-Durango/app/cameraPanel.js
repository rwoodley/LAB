var CameraPanel = function(objectCache) {
    var self = this;
    self.objectCache = objectCache;
    this.cameraTarget = 'pluto';
    this.clickHandler = function(objName) {
        self.cameraTarget = objName;
    }
    this.lookAtTarget = function() {
        var objName = self.cameraTarget;
        if (objName == 'pluto')
            objectCache.ship._camera.lookAt(objectCache.plutoMesh.position);
        if (objName == 'charon')
            objectCache.ship._camera.lookAt(objectCache.charonMesh.position);

    }
}