var TextPanel = function(locator, containerDiv, objectCache) {
    var _that = this;
    this._locator = locator;
    this._oCache = objectCache;
    this._container = containerDiv;
    this._container.innerHTML = "<span id='textPanel'></span>";
    this.updatePanel = function(randomBroadcasterPublicAPI) {
        var el = document.getElementById('textPanel');
        el.innerHTML = 'New Value = ' + randomBroadcasterPublicAPI;
    }
    this.render = function(){
        var str = '';
        str += 'Ship: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.ship._camera.position.x.toFixed(0))
            .replace('$2', _that._oCache.ship._camera.position.y.toFixed(0))
            .replace('$3', _that._oCache.ship._camera.position.z.toFixed(0))
        str += 'Mesh: ($1,$2,$3)<br/>'
            .replace('$1', (_that._oCache.ship._mesh.position.x - _that._oCache.ship._camera.position.x).toFixed(0))
            .replace('$2', (_that._oCache.ship._mesh.position.y - _that._oCache.ship._camera.position.y).toFixed(0))
            .replace('$3', (_that._oCache.ship._mesh.position.z - _that._oCache.ship._camera.position.z).toFixed(0))
        str += 'Pluto: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.plutoMesh.position.x.toFixed(0))
            .replace('$2', _that._oCache.plutoMesh.position.y.toFixed(0))
            .replace('$3', _that._oCache.plutoMesh.position.z.toFixed(0))
        str += 'Neptune: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.neptuneMesh.position.x.toFixed(0))
            .replace('$2', _that._oCache.neptuneMesh.position.y.toFixed(0))
            .replace('$3', _that._oCache.neptuneMesh.position.z.toFixed(0))
        this._container.innerHTML = str;
    }
    //this._locator.getService('RandomBroadcaster').addListener('SomeValue', this.updatePanel);
};