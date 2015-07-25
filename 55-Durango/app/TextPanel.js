var TextPanel = function(locator, containerDiv) {
    this._locator = locator;
    this._container = containerDiv;
    this._container.innerHTML = "<span id='textPanel'></span>";
    this.updatePanel = function(randomBroadcasterPublicAPI) {
        var el = document.getElementById('textPanel');
        el.innerHTML = 'New Value = ' + randomBroadcasterPublicAPI;
    }
    this._locator.getService('RandomBroadcaster').addListener('SomeValue', this.updatePanel);
};