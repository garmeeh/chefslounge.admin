'use strict';

var adminlounge = angular.module('adminlounge', ['ionic', 'angular-md5', 'adminlounge.services', 'adminlounge.controllers', 'adminlounge.directives'])


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
                templateUrl: 'templates/tab-bookings.html',
                controller: 'BookingCtrl'
            }
        }
    })

    .state('tab.customers', {
        url: '/customers',
        views: {
            'customers-tab': {
                templateUrl: 'templates/tab-customers.html',
                controller: 'CustomerCtrl'
            }
        }
    })

    .state('tab.menus', {
        url: '/menus',
        views: {
            'menus-tab': {
                templateUrl: 'templates/tab-menus.html',
                controller: 'MenuCtrl'

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

    .state('tab.msg', {
        url: '/msg',
        views: {
            'msg-tab': {
                templateUrl: 'templates/tab-msg.html',
                controller: 'MsgCtrl'
            }
        }
    })

    .state('tab.offers', {
        url: '/offers',
        views: {
            'offers-tab': {
                templateUrl: 'templates/tab-offers.html',
                controller: 'OffersCtrl'
            }
        }
    })

    .state('tab.logout', {
        url: '/logout',
        views: {
            'logout-tab': {
                templateUrl: 'templates/tab-logout.html',
                controller: 'LogoutCtrl'
            }
        }
    })


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});