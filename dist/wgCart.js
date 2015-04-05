'use strict';


angular.module('wgCart', ['wgCart.directives'])

    .config([function () {

    }])

    .provider('$wgCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'wgCart','wgCartItem', 'store', function ($rootScope, wgCart, wgCartItem, store) {

        $rootScope.$on('wgCart:change', function(){
            wgCart.$save();
        });

        if (angular.isObject(store.get(wgCart.getCartName()))) {
            wgCart.$restore(store.get(wgCart.getCartName()));

        } else {
            wgCart.init();
        }

    }])

    .service('wgCart', ['$rootScope', 'wgCartItem', 'store', function ($rootScope, wgCartItem, store) {

        this.init = function(){
            this.$cart = {
                shipping : null,
                taxRate : null,
                tax : null,
                items : []
            };
			// also key name in local storage
			this.cartName = 'cart';
        };

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
            } else {
                var newItem = new wgCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('wgCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('wgCart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

		// change cart mode
        this.setCartName = function(name) {
			this.cartName = name;
		};

		this.getCartName = function() {
			return this.cartName;
		};

        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate){
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function(){
            return this.$cart.taxRate
        };

        this.getTax = function(){
            return +parseFloat(((this.getSubTotal()/100) * this.getCart().taxRate )).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };

        this.removeItem = function (index) {
            this.$cart.items.splice(index, 1);
            $rootScope.$broadcast('wgCart:itemRemoved', {});
            $rootScope.$broadcast('wgCart:change', {});

        };

        this.removeItemById = function (id) {
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if  (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('wgCart:itemRemoved', {});
            $rootScope.$broadcast('wgCart:change', {});
        };

        this.empty = function () {

            $rootScope.$broadcast('wgCart:change', {});
            this.$cart.items = [];
            localStorage.removeItem(this.getCartName());
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items:items
            }
        };


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new wgCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set(this.getCartName(), JSON.stringify(this.getCart()));
        }

    }])

    .factory('wgCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this._name;
        };

        item.prototype.setPrice = function(price){
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function(){
            return this._price;
        };


        item.prototype.setQuantity = function(quantity, relative){


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0){
                if (relative === true){
                    this._quantity  += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }
            $rootScope.$broadcast('wgCart:change', {});

        };

        item.prototype.getQuantity = function(){
            return this._quantity;
        };

        item.prototype.setData = function(data){
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function(){
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage [key]) {
                    var cart = angular.fromJson($window.localStorage [key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage .removeItem(key);
                } else {
                    $window.localStorage [key] = angular.toJson(val);
                }
                return $window.localStorage [key];
            }
        }
    }])

    .controller('CartController',['$scope', 'wgCart', function($scope, wgCart) {
        $scope.wgCart = wgCart;

    }])

    .value('version', '0.0.3-rc.1');

'use strict';


angular.module('wgCart.directives', ['wgCart.fulfilment'])

    .controller('CartController',['$scope', 'wgCart', function($scope, wgCart) {
        $scope.wgCart = wgCart;
    }])

    .directive('wgcartAddtocart', ['wgCart', function(wgCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: 'template/wgCart/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  wgCart.getItemById(attrs.id);
                };

                if (scope.inCart()){
                    scope.q = wgCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('wgcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: 'template/wgCart/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('wgcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: 'template/wgCart/summary.html'
        };
    }])

    .directive('wgcartCheckout', [function(){
        return {
            restrict : 'E',
            controller : ('CartController', ['$scope', 'wgCart', 'fulfilmentProvider', function($scope, wgCart, fulfilmentProvider) {
                $scope.wgCart = wgCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    var promise = fulfilmentProvider.checkout();
                    console.log(promise);
                }
            }]),
            scope: {
                service:'@',
                settings:'='
            },
            transclude: true,
            templateUrl: 'template/wgCart/checkout.html'
        };
    }]);

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

// commontjs and same support
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'wgCart';
}
