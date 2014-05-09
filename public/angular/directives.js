'use strict';

angular.module('recipies.directives', []).
    directive('toolTip', function() {
        return {
            restrict:'A',
            link:function(scope,element) {
                element.hover(function() {
                    $(element).tooltip('show');
                })
            }
        }
    }).directive('passwordMatchCheck', [

        function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.pwCheck;
                    elem.add(firstPassword).on('keyup', function() {
                        scope.$apply(function() {
                            var v = elem.val() === $(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            }
        }
    ]).directive('checkIfEmailExists', ['$http',

        function($http) {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    elem.on('blur', function() {
                        if(elem.val().length > 5) {
                            scope.$apply(function() {
                                var checkemail = $http.post('/checkifemailexists', {
                                    email: elem.val()
                                });
                                checkemail.success(function(response) {
                                    ctrl.$setValidity('checkifemailexists', response.email);
                                })

                            });
                        }

                    });
                }
            }
        }
    ]).directive('checkPasswordStrength', function() {
        return {
            restrict:'A',
            link: function(scope,element) {
                element.on('keyup', function() {
                    if(element.val().length >= 6) {
                        $(element).pwdstr('#info');
                        scope.passkeyup = true;
                    }
                })

                 element.on('blur', function() {
                        scope.$apply(function() {
                            scope.passkeyup = false;
                       });
                  })
            }
        }
    }).directive('copyToModel', function($parse) {
        return function(scope, element, attrs) {
            $parse(attrs.ngModel).assign(scope, attrs.value);
        }
    }).directive('growOnHover', function() {
        return {
            restrict:"A",
            scope: {
                widthOnEnter:"@",
                widthOnLeave:"@"
            },
            link:function(scope, element) {

                element.mouseenter(function() {
                   element.css('width', [[[scope.widthOnEnter]]]);
                })

                element.mouseleave(function() {
                    element.css('width', scope.widthOnLeave);
                })

            }
        }
    }).directive('laravelPagination',['recipiesService', function(recipiesService) {
        return {
            restrict:'A',
            templateUrl:'partials/pagination.html',
            link:function($scope) {

                $scope.total = $scope.recipies.total;
                $scope.currentPage = $scope.recipies.current_page;


                $scope.pages = [];
                for(var i = 1; i <= $scope.total; i++) {
                    $scope.pages.push(i);
                }

                $scope.isFirst = function() {
                    return $scope.currentPage <= 1;
                }

                $scope.isLast = function() {
                    return $scope.currentPage == $scope.total;
                }

                $scope.backPage = function() {
                    $scope.setPage($scope.currentPage - 1);
                }

                $scope.forwardPage = function() {
                    $scope.setPage($scope.currentPage + 1);
                }

                $scope.setPage = function(page) {
                    recipiesService.paginateRecipies(page).then(function(res) {
                        $scope.currentPage = res.data.current_page;
                        $scope.recipies = res.data;
                    })
                }

                $('.search').on('keyup', function() {
                    recipiesService.searceRecipie($scope.key).then(function(res) {
                            $scope.noResults = false;
                            $scope.pages = [];
                            $scope.total = res.data.total;
                            $scope.currentPage = res.data.current_page;
                            if(res.data.data.length >= 1) {
                                for (var i = 1; i <= $scope.total; i++) {
                                    $scope.pages.push(i);
                                }
                            }else {
                                $scope.noResults = true;
                            }
                            $scope.recipies = res.data;
                    });
                })

                $('.categories').change(function() {
                    recipiesService.searceRecipieByCateogory($scope.category.id).then(function(res) {

                        $scope.noResults = false;
                        $scope.pages = [];
                        $scope.total = res.data.total;
                        $scope.currentPage = res.data.current_page;
                        if(res.data.data.length >= 1) {
                            for (var i = 1; i <= $scope.total; i++) {
                                $scope.pages.push(i);
                            }
                        }else {
                            $scope.noResults = true;
                        }
                        $scope.recipies = res.data;
                    });
                })

            }
        }
    }])