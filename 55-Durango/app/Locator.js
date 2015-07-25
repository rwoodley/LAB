var Locator = function() {
    var _that = this;
    this._services = {};
    this.addService = function(serviceName, serviceObject) {
        if (this._services.hasOwnProperty(serviceName))
            throw('Duplicate service name: ' + serviceName);
        _that._services[serviceName] = serviceObject;
        console.log('Adding service ' + serviceName);
    }
    this.getService = function(serviceName) {
        return _that._services[serviceName];
    }
};