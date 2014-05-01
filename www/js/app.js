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
    // Sub Tabs of tab-bookings.html
    //==============================//
    .state('tab.booking-requests', {
        url: '/bookings/booking-requests',
        views: {
            'bookings-tab': {
                templateUrl: 'templates/booking-requests.html',
                controller: 'BookingCtrl'
            }
        }
    })

    .state('tab.reservations', {
        url: '/bookings/reservations',
        views: {
            'bookings-tab': {
                templateUrl: 'templates/reservations.html',
                controller: 'ReservationsCtrl'
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