var RandomBroadcaster = function(locator) {
    var _that = this;
    this._listeners = {};
    this.State = {
        'SomeValue': 0
    };
    this.addListener = function(category, callBack) {
        _that._listeners[category] = callBack;
    };
    this.sendUpdates = function() {
        _that.State.SomeValue++;
        _that._listeners['SomeValue'](_that.State.SomeValue);
        setTimeout(_that.sendUpdates, 1000);
    };
    setTimeout(this.sendUpdates, 1000);
};