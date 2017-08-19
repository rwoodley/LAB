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
        str += 'Ship P: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.ship._camera.position.x.toFixed(0))
            .replace('$2', _that._oCache.ship._camera.position.y.toFixed(0))
            .replace('$3', _that._oCache.ship._camera.position.z.toFixed(0))
            ;
        //             _that._objectCache.shipPlanet.velocity.z = 0;

        str += 'Ship V: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.shipPlanet.velocity.x.toFixed(0))
            .replace('$2', _that._oCache.shipPlanet.velocity.y.toFixed(0))
            .replace('$3', _that._oCache.shipPlanet.velocity.z.toFixed(0))
            ;
        //str += 'Mesh: ($1,$2,$3)<br/>'
        //    .replace('$1', (_that._oCache.ship._mesh.position.x - _that._oCache.ship._camera.position.x).toFixed(0))
        //    .replace('$2', (_that._oCache.ship._mesh.position.y - _that._oCache.ship._camera.position.y).toFixed(0))
        //    .replace('$3', (_that._oCache.ship._mesh.position.z - _that._oCache.ship._camera.position.z).toFixed(0))
        //    ;
        str += 'Pluto P: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.plutoMesh.position.x.toFixed(0))
            .replace('$2', _that._oCache.plutoMesh.position.y.toFixed(0))
            .replace('$3', _that._oCache.plutoMesh.position.z.toFixed(0))
            ;
        str += 'Pluto V: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.plutoPlanet.velocity.x.toFixed(0))
            .replace('$2', _that._oCache.plutoPlanet.velocity.y.toFixed(0))
            .replace('$3', _that._oCache.plutoPlanet.velocity.z.toFixed(0))
            ;
        str += 'Charon: ($1,$2,$3)<br/>'
            .replace('$1', _that._oCache.charonMesh.position.x.toFixed(0))
            .replace('$2', _that._oCache.charonMesh.position.y.toFixed(0))
            .replace('$3', _that._oCache.charonMesh.position.z.toFixed(0))
            ;
        str += 'KM to Pluto: $1<br/>'
            .replace('$1', (calcDistance('plutoPlanet','shipPlanet',objectCache)/1000).toFixed(0));
        str += 'KM to Charon: $1<br/>'
            .replace('$1', (calcDistance('charonPlanet','shipPlanet',objectCache)/1000).toFixed(0));
        this._container.innerHTML = str;
    }
    //this._locator.getService('RandomBroadcaster').addListener('SomeValue', this.updatePanel);
};