
angular.module('wgCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function($injector){

        this._obj = {
            service : undefined,
            settings : undefined
        };

        this.setService = function(service){
            this._obj.service = service;
        };

        this.setSettings = function(settings){
            this._obj.settings = settings;
        };

        this.checkout = function(){
            var provider = $injector.get('wgCart.fulfilment.' + this._obj.service);
              return provider.checkout(this._obj.settings);

        }

    }])


.service('wgCart.fulfilment.log', ['$q', '$log', 'wgCart', function($q, $log, wgCart){

        this.checkout = function(){

            var deferred = $q.defer();

            $log.info(wgCart.toObject());
            deferred.resolve({
                cart:wgCart.toObject()
            });

            return deferred.promise;

        }

 }])

.service('wgCart.fulfilment.http', ['$http', 'wgCart', function($http, wgCart){

        this.checkout = function(settings){
            return $http.post(settings.url,
                {data:wgCart.toObject()})
        }
 }])


.service('wgCart.fulfilment.paypal', ['$http', 'wgCart', function($http, wgCart){


}]);
