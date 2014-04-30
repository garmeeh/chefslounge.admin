'use strict';

var adminlounge = angular.module('adminlounge', ['ionic', 'adminlounge.services', 'adminlounge.controllers'])


.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LogInCtrl'
    })

    // setup an abstract state for the tabs directive
    .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })


    .state('tab.bookings', {
        url: '/bookings',
        views: {
            'bookings-tab': {
                templateUrl: 'templates/tab-bookings.html'
            }
        }
    })

    .state('tab.customers', {
        url: '/customers',
        views: {
            'customers-tab': {
                templateUrl: 'templates/tab-customers.html'
            }
        }
    })

    .state('tab.menus', {
        url: '/menus',
        views: {
            'menus-tab': {
                templateUrl: 'templates/tab-menus.html'
            }
        }
    })

    .state('tab.reviews', {
        url: '/reviews',
        views: {
            'reviews-tab': {
                templateUrl: 'templates/tab-reviews.html',
                controller: 'ReviewCtrl'
            }
        }
    })

    .state('tab.logout', {
        url: '/logout',
        views: {
            'logout-tab': {
                templateUrl: 'templates/tab-logout.html'
            }
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});