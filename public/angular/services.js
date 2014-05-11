'use strict';



angular.module('recipies.services', [])

.factory('userService',['Restangular', '$http', 'webStorage', function(Restangular,$http,webStorage) {

        var userApi = Restangular.all('users');

        var newUser = function(userDetails) {
            return userApi.post(userDetails);
        }


        var loginUser = function(cred) {
            return $http.post('/login',cred);
        }

        var saveUserDetailsToSession = function(response) {
            webStorage.session.add('login', true);
            _.forEach(response.data, function(value, key) {
                webStorage.session.add(key,value);
            });
        }

        var logOutUser = function() {
            return $http.get('/logout');
        }

        var updateUserDetails = function(userId,userDetails) {
            var user = Restangular.one('users', userId);
            return user.put(userDetails);
        }

        var deleteAccount = function(userId) {
            var user = Restangular.one('users', userId);
            return user.remove();
        }

        var updateUserPassword = function(passwords) {
            return $http.post('changepassword', passwords);
        }

        var saveProfilePic = function(pic) {
            webStorage.session.add('profilepic', pic);
        }
        var updateProfileDetailsInSession = function(name,email) {
            webStorage.session.add('name', name);
            webStorage.session.add('email', email);
        }

        return {
            newUser: newUser,
            loginUser:loginUser,
            saveUserDetailsToSession:saveUserDetailsToSession,
            logOutUser:logOutUser,
            updateUserDetails:updateUserDetails,
            deleteAccount:deleteAccount,
            updateUserPassword:updateUserPassword,
            saveProfilePic:saveProfilePic,
            updateProfileDetailsInSession:updateProfileDetailsInSession
        }
    }])
.factory('authInterceptor',['$rootScope','$q','$location', function($rootScope, $q, $location) {
        return {
            response: function(response) {
                if (response.status === 401) {
                    $location.path('/login');
                }

                return response || $q.when(response);
            }
        };
    }])
.factory('authService', ['webStorage',function(webStorage) {
        return {
            isLogin: function() {
                return webStorage.session.get('login')
            },
            isAdmin: function() {
                return webStorage.session.get('admin')
            },
            userEmail:function() {
                return webStorage.session.get('email')
            },
            userId:function() {
                return webStorage.session.get('id')
            },
            userName:function() {
                return webStorage.session.get('name')
            },
            profilepic: function() {
                return webStorage.session.get('profilepic')
            },
            clearAll: function() {
                return webStorage.session.clear();
            }
        }
    }]).factory('categoryService',['$http', function($http) {

        return {
            getCategories: function() {
                return $http.get('/categories');
            }
        }

    }]).factory('recipiesService',['Restangular','$http', function(Restangular,$http) {

        var recipieApi = Restangular.all('recipies');

        var recentlyRecipies = function() {
            return recipieApi.getList();
        }

        var newRecipie = function(details) {
            return recipieApi.post(details);
        }

        var paginateRecipies = function(page) {
            return $http.get('/getallrecipies',{
                params: {
                    page:page
                }
            });
        }

        var searceRecipie = function(keyword) {
            return $http.get('/searchrecipie' , {
                params: {
                    key:keyword
                }
            })
        }

        var searceRecipieByCateogory = function(category) {
            return $http.get('/searchrecipiebycategory' , {
                params: {
                    category:category
                }
            })
        }

        var myRecipies = function(userId) {
            return $http.get('/myrecipies/' + userId);
        }

        var deleteRecipie = function(id, user_id) {
            return $http.delete('/recipies/' + id, {params: {user_id: user_id}});
        }

        var editShowRecipie = function(id, user_id) {
            return $http.get('/recipies/' + id + '/edit', {params:{
                user_id:user_id
            }})
        }

        var updateRecipie = function(recipieId,recipieDetails) {
            var user = Restangular.one('recipies', recipieId);
            return user.put(recipieDetails);
        }

        return {
            recentlyRecipies: recentlyRecipies,
            newRecipie:newRecipie,
            paginateRecipies:paginateRecipies,
            searceRecipie:searceRecipie,
            searceRecipieByCateogory:searceRecipieByCateogory,
            myRecipies:myRecipies,
            deleteRecipie:deleteRecipie,
            editShowRecipie:editShowRecipie,
            updateRecipie:updateRecipie
        }


    }]).factory('commentsService',['$http', function($http) {

        var addComment = function(data) {
            return $http.post('/comments', data)
        }

        var deleteComment = function(id, user_id) {
            return $http.delete('/comments/' + id, {params: {user_id: user_id}});
        }
        return {
            addComment: addComment,
            deleteComment: deleteComment
        }

    }])