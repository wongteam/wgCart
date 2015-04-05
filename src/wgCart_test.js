'use strict';

describe('wgCart module', function() {
    beforeEach(module('wgCart'));


    describe('value - version', function() {
        it('should return current version', inject(function(version) {
            expect(version).toEqual('0.0.3-rc.1');
        }));
    });


    describe('CartController', function() {

        var $controller;

        beforeEach(inject(function(_$controller_){
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));

        describe('$scope.wgCart', function() {

            var $scope;
            var controller;

            function addItem(id, name, price, quantity, data){
                $scope.wgCart.addItem(id, name, price, quantity, data);
            }

            beforeEach(function() {
                $scope = {};
                controller = $controller('CartController', {$scope: $scope});

            });

            it('sets instance of wgCart to scope', function() {
                expect(typeof $scope.wgCart).toEqual('object');
            });


            it('should be able to add an item', function() {
                addItem(1, 'Test Item', 10, 2);
                expect($scope.wgCart.getItems().length).toEqual(1);
            });


             it('should be able to empty', function() {
                $scope.wgCart.empty();
                expect($scope.wgCart.getItems().length).toEqual(0);
            });




            describe('wgCart', function() {


                beforeEach(function(){

                    $scope.wgCart.setTaxRate(7.5);
                    $scope.wgCart.setShipping(12.50);
                    addItem(1, 'Work boots', 189.99, 1);
                    addItem(2, 'Hockey gloves', 85, 2);
                    addItem('cpBow', 'Compound bow', 499.95, 1);
                });



                it('tax should be set', function() {
                    expect($scope.wgCart.getTaxRate()).toEqual(7.5);
                });

                it('shipping should be set', function() {
                    expect($scope.wgCart.getShipping()).toEqual(12.50);
                });

                it('tax charge should be ', function() {
                    expect($scope.wgCart.getTax()).toEqual(64.5);
                });

                it('count items in total', function() {
                    expect($scope.wgCart.getTotalItems()).toEqual(4);
                });

                it('count unique items in cart', function() {
                    expect($scope.wgCart.getTotalUniqueItems()).toEqual(3);
                });


                it('check getItems has correct number of items', function() {
                    expect($scope.wgCart.getItems().length).toEqual(3);
                });

                it('Have correct getSubTotal', function() {
                    expect($scope.wgCart.getSubTotal()).toEqual(859.94);
                });


                it('Have correct totalCost', function() {
                    expect($scope.wgCart.totalCost()).toEqual(936.94);
                });


                it('find item by id (by int) ', function() {
                    expect($scope.wgCart.getItemById(2).getName()).toEqual('Hockey gloves');
                });


                it('find item by id (by string) ', function() {
                    expect($scope.wgCart.getItemById('cpBow').getName()).toEqual('Compound bow');
                });


                it('remove item by ID', function() {
                    $scope.wgCart.removeItemById('cpBow');
                    expect($scope.wgCart.getItemById('cpBow')).toEqual(false);
                    expect($scope.wgCart.getTotalUniqueItems()).toEqual(2);
                });


                it('remove item by ID', function() {
                    $scope.wgCart.removeItemById('cpBow');
                    expect($scope.wgCart.getItemById('cpBow')).toEqual(false);
                });

                it('should create an object', function() {
                    var obj =  $scope.wgCart.toObject();
                    expect(obj.shipping).toEqual( 12.50 );
                    expect(obj.tax).toEqual( 64.5 );
                    expect(obj.taxRate).toEqual( 7.5 );
                    expect(obj.subTotal).toEqual( 859.94 );
                    expect(obj.totalCost).toEqual( 936.94 );
                    expect(obj.items.length).toEqual( 3 );
                });


            });

            describe('wgCartItem', function() {

                var wgCartItem;

                beforeEach(function(){
                    addItem('lRope', 'Lariat rope', 39.99);
                    wgCartItem = $scope.wgCart.getItemById('lRope');
                });


                it('should have correct Name', function() {
                    expect(wgCartItem.getName()).toEqual('Lariat rope');
                });

                it('should default quantity to 1', function() {
                    expect(wgCartItem.getQuantity()).toEqual(1);
                });

                it('should update quantity', function() {
                    expect(wgCartItem.getName()).toEqual('Lariat rope');
                });

                it('should absolutely update quantity', function() {
                    expect(wgCartItem.getQuantity()).toEqual(1);
                    wgCartItem.setQuantity(5);
                    expect(wgCartItem.getQuantity()).toEqual(5);
                });

                it('should relatively update quantity', function() {
                    expect(wgCartItem.getQuantity()).toEqual(1);
                    wgCartItem.setQuantity(1, true);
                    expect(wgCartItem.getQuantity()).toEqual(2);
                });


                it('should get total', function() {
                    expect(wgCartItem.getTotal()).toEqual(39.99);
                });

                it('should update total after quantity change', function() {
                    wgCartItem.setQuantity(1, true);
                    expect(wgCartItem.getTotal()).toEqual( 79.98 );
                });


                it('should create an object', function() {
                    var obj = wgCartItem.toObject();
                    expect(obj.id).toEqual( 'lRope' );
                    expect(obj.name).toEqual( 'Lariat rope' );
                    expect(obj.price).toEqual( 39.99 );
                    expect(obj.quantity).toEqual( 1 );
                    expect(obj.data).toEqual( null );
                    expect(obj.total).toEqual( 39.99 );
                });


            })

        })
    });





    describe('wgCartItem', function() {

        //var wgCartItem;
        //
        //beforeEach(inject(function(_wgCartItem_){
        //    // The injector unwraps the underscores (_) from around the parameter names when matching
        //
        //
        //    var $rootScope = {};
        //     wgCartItem = _wgCartItem_('wgCartItem', { $rootScope: $rootScope });
        //
        //}));
        //
        //describe('$scope.wgCart', function() {
        //
        //    it('sets instance of wgCart to scope', function() {
        //       console.log( wgCartItem);
        //        expect(wgCartItem.getQuantity()).toEqual(1);
        //    });
        //
        //});
    });

    describe('wgCart', function() {

        //var $service;
        //
        //beforeEach(inject(function(_wgCartService_){
        //    // The injector unwraps the underscores (_) from around the parameter names when matching
        //    $service = _wgCartService_;
        //}));
        //
        //describe('wgCart.init', function() {
        //
        //    console.log ($service)
        //    it('sets instance of wgCart to scope', function() {
        //        var $scope = {};
        //        //var service = $service('wgCart', { $scope: $scope });
        //
        //        //expect('object').toEqual('object');
        //    });
        //
        //});
    });





});