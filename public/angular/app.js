'use strict';



angular.module('recipies', [
    'ui.router',
    'restangular',
    'webStorageModule',
    'angularFileUpload',
    'ngAnimate',
    'recipies.filters',
    'textAngular',
    'recipies.services',
    'recipies.directives',
    'recipies.controllers',
    'ui.bootstrap'
],
    function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[[');
    $interpolateProvider.endSymbol(']]]');
})

    .config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider, $urlRouterProvider, $httpProvider) {


    $httpProvider.interceptors.push('authInterceptor');

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "partials/recipies/main.html",
            controller:'mainController'
        })
        .state('login', {
            url: '/login',
            templateUrl: 'partials/user/login.php'
        }).state('register', {
            url:'/register',
            templateUrl: 'partials/user/register.html'
        }).state('profile', {
            url:'/profile',
            templateUrl:'partials/user/profile.html',
            authenticate:true
        }).state('addcategory', {
            url:'/add-category',
            templateUrl:'partials/admin/add-category.html',
            admin:true
        }).state('newrecipie', {
            url:'/new-recipie',
            templateUrl:'partials/user/new-recipie.html',
            resolve: {
                categories:  function(categoryService){
                    return categoryService.getCategories();
                }
        },
            controller: 'recipiesController',
            authenticate:true
        }).state('onerecipie', {
            url:'/recipie/:recipieId',
            templateUrl:'partials/user/onerecipie.html',
            resolve: {
                recipie: function($http,$stateParams) {
                    return $http.get('/recipies/' + $stateParams.recipieId);
                },
                recipieId: function($stateParams) {
                    return $stateParams.recipieId;
                }
            },
            controller:'onerecipieController'
        }).state('recipies',{
            url:'/recipies',
            templateUrl:'partials/recipies/all-recipies.html',
            resolve: {
                recipies: function(recipiesService) {
                    return recipiesService.paginateRecipies(1);
                },
                categories:  function(categoryService){
                    return categoryService.getCategories();
                }
            },
            controller:'allRecipiesController'
        }).state('myrecipies', {
            url:'/my-recipies/:userEmail',
            templateUrl:'partials/user/myrecipies.html',
            resolve: {
                myRecipies: function(recipiesService,authService, $stateParams) {
                    $stateParams.userEmail = authService.userEmail();
                    return recipiesService.myRecipies($stateParams.userEmail)
                }
            },
            controller:'myRecipiesController'
        }).state('editmyrecipie', {
            url:'/myrecipies/:userEmail/:recipieId',
            templateUrl:'partials/user/editrecipie.html',
            resolve: {
                recipie: function(recipiesService,$stateParams,authService) {
                    return recipiesService.editShowRecipie($stateParams.recipieId, authService.userId());
                }
            },
            controller: 'editRecipieController'
        })

}])
    .run(['$rootScope', 'authService', '$state',
    function($rootScope, authService, $state) {

        $rootScope.$storage = authService;

        $rootScope.$on("$stateChangeStart", function(event, toState) {

            if (toState.admin && !authService.isAdmin()) {
                event.preventDefault();
                $state.go("home");

            } else if (toState.authenticate && !authService.isLogin()) {
                event.preventDefault();
                $state.go("login");
            }
        });
    }
])
