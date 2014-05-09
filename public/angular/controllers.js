'use strict';

angular.module('recipies.controllers', [])

    .controller('navbarController', ['$scope', '$state', 'userService','authService',

        function($scope,$state,userService,authService) {
            $scope.$state = $state;
            $scope.logOut = function() {
                userService.logOutUser().then(function() {
                    authService.clearAll();
                    $state.go('home');
                })
            }
        }
    ])

    .controller('loginController', ['$scope', 'userService','$state', function($scope,userService,$state) {
        var csrf = {
            CSRF_TOKEN: $scope.csrf
        }
        $scope.loginClick = function() {

            userService.loginUser(angular.extend($scope.login, csrf )).then(function(response) {
                userService.saveUserDetailsToSession(response);
                $state.go('home');
            },function(response) {
                $scope.wrongCred = (response.status == 401) ? true: "";
            })
        }

    }]).controller('registerController', ['$scope', 'userService','$state', '$timeout', function ($scope, userService, $state,$timeout) {

        $scope.registerClick = function() {
           userService.newUser($scope.register).then(function(response) {
               if(response.save) {
                   $scope.successRegister = true;
                   $timeout(function() {
                       $state.go('login');
                   },4000)
               }else {
                   $scope.failedRegister = true;
               }
           });
        }
    }]).controller('profileController', ['$scope','userService','authService','$location', '$timeout','$upload', function ($scope,userService,authService,$location,$timeout,$upload) {

        $scope.loader = '0';

        $scope.onFileSelect = function($files) {
            $scope.loader = '0';
            for (var i = 0; i < $files.length; i++) {
                 $scope.file = $files[i];
            }
        }
    
        $scope.uploadProfilePic = function() {

            $scope.upload = $upload.upload({
                url: '/upload-profile-pic',
                method: 'POST',
                file: $scope.file
            }).success(function(res) {
                    if(res.failed) {
                        $scope.notAllowedFile = true;
                    }else {
                        userService.saveProfilePic(res[0]);
                    }
                }).progress(function(evt) {
                   $scope.loader = parseInt(100.0 * evt.loaded / evt.total) + '%';

                })
        }



        $scope.UpdateProfileClick = function() {
            userService.updateUserDetails(authService.userId(), $scope.profileForm ).then(function() {
                    $scope.successUpdateProfile = true;
                    userService.updateProfileDetailsInSession($scope.profileForm.name, $scope.profileForm.email);
            },function() {
                $scope.failedUpdateProfile = true;
            })
        }

        $scope.deleteAccount = function() {
            var confirmDelete = confirm("האם אתה בטוח?");
           if(confirmDelete) {
               userService.deleteAccount(authService.userId()).then(function() {
                   authService.clearAll();
                   $location.path('/');
               })
           }
        }

        $scope.updatePasswordClick = function() {
            userService.updateUserPassword($scope.update).then(function(res) {
                $scope.failedupdatePassword = false;
                if(res.data.change) {
                    $scope.successUpdatePassword = true;
                    authService.clearAll();
                    $timeout(function() {
                        $location.path('/')
                    },3000)
                }
            },function() {
                $scope.failedupdatePassword = true;
            })
        }


    }]).controller('categoryController', ['$scope','$http', function ($scope,$http) {
        
        $scope.newCategoryClick = function() {
            $http.post('addcategory', {
                name:$scope.newcategory.name
            })
            .then(function(res) {
                if(res.data.save) {
                    $scope.success = true;
                }
            })
        }
    }]).controller('recipiesController', ['$scope', 'categoryService','$upload', 'categories', function ($scope, categoryService, $upload, categories) {


        $scope.categories = categories.data;

        $scope.$watch('category', function(newval) {
            if (newval) {
                $scope.category_id = {
                    category_id: newval.id
                };
            }
        })

        $scope.file = [];
        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                $scope.file.push($files[i]);
            }
        }

        $scope.loader = '0';
        $scope.addNewRecipie = function() {

                $scope.upload = $upload.upload({
                    url: '/recipies',
                    method: 'POST',
                    data: angular.extend($scope.newRecipie, $scope.category_id),
                   file: $scope.file
                }).success(function(res) {
                      if(res.saved) $scope.success = true;

                    }).progress(function(evt) {
                        if($scope.file.length >= 1) {
                            $scope.loader = parseInt(100.0 * evt.loaded / evt.total) + '%';
                        }

                    })
        }

    }]).controller('mainController', ['$scope','recipiesService', function ($scope,recipiesService) {
        recipiesService.recentlyRecipies().then(function(res) {
            $scope.recipies = res;
        })
    }]).controller('onerecipieController', ['$scope','recipie', 'recipieId','commentsService','authService', '$state','$stateParams', function ($scope, recipie,recipieId,commentsService,authService,$state,$stateParams) {
        $scope.recipie = recipie.data;

        $scope.comment = {};
        $scope.comment.recipie_id = recipieId;
        
        $scope.addCommentClick = function() {
            commentsService.addComment($scope.comment).then(function(res) {
                if(res.data.saved) {
                    $scope.success = true;
                    $state.transitionTo($state.current, {recipieId: $stateParams.recipieId}, {
                        reload: true
                    });
                }
            })
        }


        $scope.checkUserBelongComment = function(index) {
            if(recipie.data[0].comments.length > 0) {
                return authService.userId() == recipie.data[0].comments[index].user_id;
            }
        }
        
        $scope.deleteComment = function(id) {
            commentsService.deleteComment(id, authService.userId()).then(function(res) {
                if(res.data.delete) {
                    $scope.deleted = true;
                    $state.transitionTo($state.current, {recipieId: $stateParams.recipieId}, {
                        reload: true
                    });
                }
            })
        } 


    }]).controller('allRecipiesController', ['$scope', 'recipies', 'categories', function ($scope,recipies,categories) {

        $scope.recipies = recipies.data;
        $scope.categories = categories.data;

    }]).controller('myRecipiesController', ['$scope','myRecipies','authService','recipiesService','$state','$stateParams', function ($scope,myRecipies,authService,recipiesService,$state,$stateParams) {
        $scope.recipies = myRecipies.data;
        $scope.userEmail = authService.userEmail();

        $scope.deleteRecipie = function(id) {
            recipiesService.deleteRecipie(id, authService.userId()).then(function(res) {
                if(res.data.delete) {
                    $scope.deleted = true;
                    $state.transitionTo($state.current, {recipieId: $stateParams.userEmail}, {
                        reload: true
                    });
                }
            })
        }

        
       
    }])

    .controller('editRecipieController', ['$scope', 'recipie','recipiesService','$state','$stateParams', function ($scope,recipie, recipiesService,$state,$stateParams) {
        $scope.recipie = recipie.data;
        $scope.updateRecipie = function(recipieId){
            recipiesService.updateRecipie(recipieId, $scope.editRecipie).then(
                function(res) {
                    if(res.updated) {
                        $scope.success = true;
                        $state.transitionTo('onerecipie', {recipieId: $stateParams.recipieId}, {
                            reload: true
                        });
                    }
                }
            )
        }
    }]);

