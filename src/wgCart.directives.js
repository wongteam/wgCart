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