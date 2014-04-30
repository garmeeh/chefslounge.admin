angular.module('adminlounge.controllers', [])

//Log In controller
adminlounge.controller('LogInCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {

		// Create new user and store them in the database
		$scope.logIn = function(userdata) {

			console.log('Hit logIn');
			var user = 'userdata=' + JSON.stringify(userdata);
			console.log(user);

			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/login';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: user,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.user = {};
				$state.go('tab.bookings', {}, {
					reload: true,
					inherit: false
				});

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};
	}
])


adminlounge.controller('ReviewCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {



		//=== getReviewFn() ====\\

		$scope.getReviewFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getreview';
			$scope.codeStatus = "";
			console.log('Hit Function getReviewFn');


			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log(response);
				$scope.reviews = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getReviewFn();

		//Modal
		// Create and load the Modal
		$ionicModal.fromTemplateUrl('../templates/modal-respond.html', function(modal) {
			$scope.respondModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});
		// Open new user modal
		$scope.respondReview = function() {
			$scope.respondModal.show();
		};

		// Close new user modal
		$scope.closeRespondReview = function() {
			$scope.respondModal.hide();
		};

		// Modal data
		// Create new user and store them in the database
		$scope.sendReviewResponse = function(revresponse) {

			console.log('Hit Review Response');
			var msg = 'message=' + JSON.stringify(revresponse);
			console.log(msg);
			$scope.respondModal.hide();
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/sendmessage';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: msg,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.msg = {};
				//magic!!!! 
				$state.go('tab.reviews', {}, {
					reload: true,
					inherit: false
				});
				$scope.respondModal.remove();

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};


	}
])

adminlounge.controller('CustomerCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {



		// Create and load the Modal
		$ionicModal.fromTemplateUrl('../templates/modal-add-customer.html', function(modal) {
			$scope.userModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});

		// Create new user and store them in the database
		$scope.createUser = function(userdata) {

			console.log('Hit createUser');
			var user = 'userdata=' + JSON.stringify(userdata);
			console.log(user);
			$scope.userModal.hide();
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/insertuser';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: user,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.user = {};
				//magic!!!! 
				$state.go('tab-customers', {}, {
					reload: true,
					inherit: false
				});
				$scope.userModal.remove();

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};



		// Open new user modal
		$scope.newUser = function() {
			$scope.userModal.show();
		};

		// Close new user modal
		$scope.closeNewUser = function() {
			$scope.userModal.hide();
		};

		//=== Get Customers ====\\

		$scope.getCustomers = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getusers';
			$scope.codeStatus = "";
			console.log('Hit Function getCustomers');


			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log(response);
				$scope.customers = response;
			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getCustomers();

	$scope.contacts = {};

	var contactsLength = $scope.customers;
	var firstLetter;

	for (var i = 0; i < contactsLength; i++) {
		firstLetter = $scope.customers[i].lastname.substring(0, 1).toUpperCase();

		if (!$scope.contacts[firstLetter]) $scope.contacts[firstLetter] = [];

		$scope.contacts[firstLetter].push($scope.contacts[i].firstname + ' ' + $scope.contacts[i].lastname);

	}



	}
])
// A simple controller that fetches a list of data from a service
.controller('PetIndexCtrl', function($scope, PetService) {
	// "Pets" is a service returning mock data (services.js)
	$scope.pets = PetService.all();
})


// A simple controller that shows a tapped item's data
.controller('PetDetailCtrl', function($scope, $stateParams, PetService) {
	// "Pets" is a service returning mock data (services.js)
	$scope.pet = PetService.get($stateParams.petId);
});