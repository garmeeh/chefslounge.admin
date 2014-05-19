angular.module('adminlounge.controllers', [])


//Log Out 
adminlounge.controller('LogoutCtrl', ['$scope', '$state', '$templateCache',
	function($scope, $state, $templateCache) {

		$scope.logOut = function() {
			localStorage.removeItem("userData");
			$state.go('login', {}, {
				reload: true,
				inherit: false
			});
		}

		$scope.dontLogOut = function() {
			$state.go('tab.bookings', {}, {
				reload: true,
				inherit: false
			});
		}


	}
])
//Log In controller
adminlounge.controller('LogInCtrl', ['$scope', '$http', '$state', '$ionicModal', '$ionicPopup', 'md5', '$templateCache',
	function($scope, $http, $state, $ionicModal, $ionicPopup, md5, $templateCache) {

		if (localStorage.length > 0) {
			console.log("Clearing Current User Data....")
			//localStorage.clear();
			localStorage.removeItem("userData");

		}

		// Create new user and store them in the database
		$scope.logIn = function(userdata) {


			console.log('Hit logIn');
			var user = JSON.stringify(userdata);
			console.log(user);

			console.log(md5.createHash(user.password || ''));

			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/login';
			$scope.codeStatus = "";

			$http({
				method: method,
				dataType: 'json',
				url: inserturl,
				data: user,
				headers: {
					'Content-Type': 'application/json'
				},
				cache: $templateCache
			}).
			success(function(response) {
				// console.log("success", response);
				if (response.statusCode == 200) {
					// alert("It worked!!!");
					// A confirm dialog
					console.log(response);

					var data = response.payload.userData;

					localStorage.setItem("userData", JSON.stringify(data));

					var alertPopup = $ionicPopup.alert({
						title: 'Log In Success',
						template: 'It might taste good'
					});
					alertPopup.then(function(res) {
						console.log('Logged In');
					});



					// var user = localStorage.getItem("userData");

					// var userD = JSON.parse(user);

					// $scope.userData = userD;

					// console.log($scope);

					// alert("Hello " + $scope.userData.username)

					$state.go('tab.bookings', {}, {
						reload: true,
						inherit: false
					});
				} else if (response.statusCode == 500) {
					console.error("Nope!");

					var alertPopup = $ionicPopup.alert({
						title: 'Invalid log in. Please Try Again',
						//template: 'It might taste good'
					});
					alertPopup.then(function(res) {
						console.log('Invalid');
					});
				}


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

		// Populate review page with data. Pull from databse via server

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


		// Handle respond button to review. Opens deafult mail client
		// and loads current index email. 
		$scope.respondReview = function(idx) {
			console.log(idx)

			console.log($scope.reviews[idx].email);
			//$scope.respondModal.show();

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;


				window.location.href = link;

			};

			$scope.sendEmail($scope.reviews[idx].email);
		};


	}
])

adminlounge.controller('BookingCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {

		// Populate booking tab with booking requests.
		$scope.getBookingFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getbookingrequest';
			$scope.codeStatus = "";
			console.log('Hit Function getBookingFn');


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
				$scope.bookings = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};
		$scope.getBookingFn();


		// Handle respond button to bookings. Opens deafult mail client
		// and loads current index email. 
		$scope.respondBooking = function(idx) {
			console.log(idx)

			console.log($scope.bookings[idx].email);


			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;


				window.location.href = link;

			};

			$scope.sendEmail($scope.bookings[idx].email);
		};
	}
])

adminlounge.controller('ReservationsCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {

		var user = localStorage.getItem("userData");

		var userD = JSON.parse(user);

		$scope.userData = userD;

		console.log($scope);

		alert("Hello " + $scope.userData.username);
	}
])

// Handle menu creation. 
.factory('Menus', function() {
	return {
		all: function() {
			var menuString = window.localStorage['menus'];
			if (menuString) {
				return angular.fromJson(menuString);
			}
			return [];
		},
		save: function(menus) {
			window.localStorage['menus'] = angular.toJson(menus);
		},
		newMenu: function(menuTitle) {
			// Add a new menu
			return {
				menuName: menuTitle,
				items: []
			};
		},
		getLastActiveIndex: function() {
			return parseInt(window.localStorage['lastActiveMenu']) || 0;
		},
		setLastActiveIndex: function(index) {
			window.localStorage['lastActiveMenu'] = index;
		}
	}
})
adminlounge.controller('MenuCtrl', ['$scope', '$http', '$state', '$ionicModal', 'Menus', '$timeout', '$ionicPopup', '$templateCache',
	function($scope, $http, $state, $ionicModal, Menus, $timeout, $ionicPopup, $templateCache) {


		//Menu Creation


		// A utility function for creating a new menu
		// with the given menuTitle
		var createMenu = function(menuTitle) {
			var newMenu = Menus.newMenu(menuTitle);
			$scope.menus.push(newMenu);
			Menus.save($scope.menus);
			$scope.selectMenu(newMenu, $scope.menus.length - 1);
		}

		// Load or initialize menus
		$scope.menus = Menus.all();

		// Grab the last active, or the first menu
		$scope.activeMenu = $scope.menus[Menus.getLastActiveIndex()];

		// Called to create a new menu
		$scope.newMenu = function() {
			//var menuTitle = prompt('Menu Name');
			$ionicPopup.prompt({
				title: 'Menu Name',
				inputType: 'text',
				inputPlaceholder: 'Enter Menu Name...'
			}).then(function(res) {
				if (res != false) {
					createMenu(res);
				} else {

					console.log("cancel");


				}
			});

		};

		// Called to select the given menu
		$scope.selectMenu = function(menu, index) {
			$scope.activeMenu = menu;
			Menus.setLastActiveIndex(index);
			// $ionicSideMenuDelegate.toggleLeft(false);

		};


		$scope.item = [];
		// Create and load the Modal
		$ionicModal.fromTemplateUrl('item-modal.html', function(modal) {
			$scope.itemModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});


		//take a look at addItem
		$scope.createItem = function(item) {
			if (!$scope.activeMenu || !item) {
				return;
			}
			$scope.activeMenu.items.push({
				title: item.title,
				price: item.price
			});
			$scope.itemModal.hide();

			// Inefficient, but save all the menus
			Menus.save($scope.menus);

			item.title = "";
			item.price = "";
		};

		// Open our new item modal
		$scope.newItem = function() {
			//$scope.itemModal.show();
			$scope.itemModal.show();

		};

		// Close the new item modal
		$scope.closeNewItem = function() {
			//$scope.itemModal.hide();
			// Remove dialog 
			$scope.itemModal.remove();
			// Reload modal template to have cleared form
			$ionicModal.fromTemplateUrl('item-modal.html', function(modal) {
				$scope.itemModal = modal;
			}, {
				scope: $scope,
				animation: 'slide-in-up'
			});
		};



		// Try to create the first menu, make sure to defer
		// this by using $timeout so everything is initialized
		// properly
		$timeout(function() {
			if ($scope.menus.length == 0) {
				//while (true) {
				$ionicPopup.prompt({
					title: 'Menu Name',
					inputType: 'text',
					inputPlaceholder: 'Enter Menu Name...'
				}).then(function(res) {
					createMenu(res);

				});
				//}
			}
		});

		// $scope.deleteItem = function(idx) {

		// 	console.log($scope.activeMenu.items[idx]);
		// 	$scope.activeMenu.items.splice($scope.activeMenu.items[idx], 1);
		// 	Menus.save($scope.menus);
		// }

		// //Added item functionality
		// // Define item buttons
		// $scope.itemButtons = [{
		// 	text: 'Delete',
		// 	type: 'button-assertive',
		// 	onTap: function(item) {
		// 		$scope.removeItem(item);
		// 	}
		// }, {
		// 	text: 'Edit',
		// 	type: 'button-calm',
		// 	onTap: function(item) {
		// 		$scope.showEditItem(item);
		// 	}
		// }];

		// // Used to cache the empty form for Edit Dialog
		// $scope.saveEmpty = function(itemForm) {
		// 	$scope.itemForm = angular.copy(itemForm);
		// }
		// $scope.removeItem = function(item) {
		// 	// Search & Destroy item from list
		// $scope.activeMenu.items.splice($scope.item.indexOf(item));

		// 	Menus.save($scope.menus);

		// }

		// $scope.showEditItem = function(item) {

		// 	// Remember edit item to change it later
		// 	$scope.tmpEditItem = item;

		// 	// Preset form values
		// 	//$scope.item.title.$setViewValue(item.title);
		// 	// Open dialog
		// 	$scope.newItem('change');
		// };

		// $scope.editItem = function(item) {

		// 	var item = {};
		// 	item.title = item.title;

		// 	var editIndex = Menus.all().indexOf($scope.tmpEditItem);
		// 	$scope.activeMenu.items[editIndex] = item;

		// 	Menus.save($scope.menus);

		// 	$scope.closeNewItem();
		// }

		$scope.syncMenu = function() {

			var menus = localStorage.getItem("menus");

			var menuD = JSON.parse(menus);

			//$scope.userData = userD;

			console.log('Hit syncMenu');
			var menu = 'menu=' + JSON.stringify(menuD);
			console.log(menu);
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/syncmenu';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: menu,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$state.go('tab.menus', {}, {
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

adminlounge.controller('OffersCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout', '$templateCache',
	function($scope, $http, $state, $ionicModal, $timeout, $templateCache) {


		// Create and load the Modal
		$ionicModal.fromTemplateUrl('../templates/modal-add-offer.html', function(modal) {
			$scope.offerModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});

		// Create new user and store them in the database
		$scope.createOffer = function(offer) {

			console.log('Hit createOffer');
			var offer = 'offferdata=' + JSON.stringify(offer);
			console.log(offer);
			$scope.offerModal.hide();
			var method = 'POST';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/newoffer';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				data: offer,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				cache: $templateCache
			}).
			success(function(response) {
				console.log("success", response);
				$scope.offer = {};
				//magic!!!! 
				$state.go('tab.offers', {}, {
					reload: true,
					inherit: false
				});
				$scope.offerModal.remove();

			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			// return false;

		};



		// Open new offer modal
		$scope.newOffer = function() {
			$scope.offerModal.show();
		};

		// Close new offer modal
		$scope.closeNewOffer = function() {
			$scope.offerModal.hide();
		};

		//=== getOfferFn() ====\\

		$scope.getOfferFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getoffer';
			$scope.codeStatus = "";
			console.log('Hit Function getOfferFn');


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
				$scope.offers = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getOfferFn();

	}
])

adminlounge.controller('MsgCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {

		//=== getMsgFn() ====\\

		$scope.getMsgFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getmsg';
			$scope.codeStatus = "";
			console.log('Hit Function getMsgFn');


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
				$scope.messages = response;



			}).
			error(function(response) {
				console.log("error");
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

			return false;
		};

		$scope.getMsgFn();

		// Handle respond button to messages. Opens deafult mail client
		// and loads current index email. 
		$scope.respondMsg = function(idx) {
			console.log(idx)

			console.log($scope.messages[idx].email);
			//$scope.respondModal.show();

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;


				window.location.href = link;

			};

			$scope.sendEmail($scope.messages[idx].email);
		};
	}
])

adminlounge.controller('CustomerCtrl', ['$scope', '$http', '$state', '$ionicModal', '$templateCache',
	function($scope, $http, $state, $ionicModal, $templateCache) {



		// Create and load the Modal
		$ionicModal.fromTemplateUrl('new-user.html', function(modal) {
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
				$state.go('tab.customers', {}, {
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

		// Handle respond button to customers. Opens deafult mail client
		// and loads current index email. 
		$scope.emailCustomer = function(idx) {
			console.log(idx)

			console.log($scope.customers[idx].email);


			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;


				window.location.href = link;

			};

			$scope.sendEmail($scope.customers[idx].email);
		};


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