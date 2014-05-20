angular.module('adminlounge.controllers', [])

//Log Out 
adminlounge.controller('LogoutCtrl', ['$scope', '$state',
	function($scope, $state) {

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

		$scope.delAllMenus = function() {
			localStorage.clear();
			$state.go('login', {}, {
				reload: true,
				inherit: false
			});
		}


	}
])
//Log In controller
adminlounge.controller('LogInCtrl', ['$scope', '$http', '$state', '$ionicModal', '$ionicPopup', 'md5',
	function($scope, $http, $state, $ionicModal, $ionicPopup, md5) {

		if (localStorage.length > 0) {
			localStorage.removeItem("userData");
		}

		// Create new user and store them in the database
		$scope.logIn = function(userdata) {

			var user = JSON.stringify(userdata);

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
			}).
			success(function(response) {

				if (response.statusCode == 200) {

					var data = response.payload.userData;

					localStorage.setItem("userData", JSON.stringify(data));

					var alertPopup = $ionicPopup.alert({
						title: 'Log In Success',
						template: 'It might taste good'
					});
					alertPopup.then(function(res) {

					});

					$state.go('tab.bookings', {}, {
						reload: true,
						inherit: false
					});
				} else if (response.statusCode == 500) {

					var alertPopup = $ionicPopup.alert({
						title: 'Invalid log in. Please Try Again',
					});
					alertPopup.then(function(res) {

					});
				}
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

		};
	}
])


adminlounge.controller('ReviewCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout',
	function($scope, $http, $state, $ionicModal, $timeout) {

		$scope.doRefresh = function() {

			$timeout(function() {

				$scope.getReviewFn();

				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('reviews', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.reviews = newVal;
		});
		// Populate review page with data. Pull from databse via server
		$scope.getReviewFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getreview';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},

			}).
			success(function(response) {
				$scope.reviews = response;
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});


		};

		// Handle respond button to review. Opens deafult mail client
		// and loads current index email. 
		$scope.respondReview = function(idx) {

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;


				window.location.href = link;

			};

			$scope.sendEmail($scope.reviews[idx].email);
		};


	}
])

adminlounge.controller('BookingCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout',
	function($scope, $http, $state, $ionicModal, $timeout) {

		$scope.doRefresh = function() {

			$timeout(function() {

				$scope.getBookingFn();

				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('bookings', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.bookings = newVal;
		});
		// Populate booking tab with booking requests.
		$scope.getBookingFn = function() {

			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getbookingrequest';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
			}).
			success(function(response) {
				$scope.bookings = response;
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});
		};

		$scope.respondBooking = function(idx) {

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;

				window.location.href = link;

			};

			$scope.sendEmail($scope.bookings[idx].email);
		};
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
adminlounge.controller('MenuCtrl', ['$scope', '$http', '$state', '$ionicModal', 'Menus', '$timeout', '$ionicPopup',
	function($scope, $http, $state, $ionicModal, Menus, $timeout, $ionicPopup) {


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
		$scope.newItem = function(action) {
			$scope.action = action;
			$scope.itemModal.show();

		};

		// Close the new item modal
		$scope.closeNewItem = function() {
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

		$timeout(function() {
			if ($scope.menus.length == 0) {

				$ionicPopup.prompt({
					title: 'Menu Name',
					inputType: 'text',
					inputPlaceholder: 'Enter Menu Name...'
				}).then(function(res) {
					createMenu(res);

				});

			}
		});

		// Define item buttons
		$scope.itemButtons = [{
			text: 'Delete',
			type: 'button-assertive',
			onTap: function(item) {
				$scope.removeItem(item);
			}
		}, {
			text: 'Edit',
			type: 'button-calm',
			onTap: function(item) {
				$scope.showEditItem(item);
			}

		}];

		// Used to cache the empty form for Edit Dialog
		$scope.saveEmpty = function(form) {
			$scope.form = angular.copy(form);
		}
		$scope.removeItem = function(item) {
			// Search & Destroy item from list

			var items = $scope.activeMenu.items;

			var itemIdx = items.indexOf(item);

			if (itemIdx === 0) {
				items.splice(0, 1);
			}

			if (itemIdx) {
				// 2nd param indictaes number of items
				//delete
				items.splice(itemIdx, 1);
			}

			Menus.save($scope.menus);

		}


		$scope.showEditItem = function(item) {

			// Remember edit item to change it later

			var items = $scope.activeMenu.items;
			var itemIdx = items.indexOf(item);
			$scope.tempIdx = itemIdx;
			$scope.item.title = items[itemIdx].title;
			$scope.item.price = items[itemIdx].price;
			// Open dialog
			$scope.newItem('change');
		};

		$scope.editItem = function(item) {

			var items = $scope.activeMenu.items;
			var itemIdx = $scope.tempIdx;

			items[itemIdx].title = $scope.item.title;
			items[itemIdx].price = $scope.item.price;

			Menus.save($scope.menus);
			$scope.item.title = "";
			$scope.item.price = "";
			$scope.closeNewItem();
		}

		$scope.syncMenu = function() {

			var menus = localStorage.getItem("menus");
			var menuD = JSON.parse(menus);
			var menu = 'menu=' + JSON.stringify(menuD);

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
			}).
			success(function(response) {
				var alertDOBPopup = $ionicPopup.alert({
					title: 'Menus Updated in Database',
					okType: 'button-positive'

				});
				alertDOBPopup.then(function(res) {
					$state.go('tab.menus', {}, {
						reload: true,
						inherit: false
					});
				});
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});

		};


	}
])

adminlounge.controller('OffersCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout', '$ionicPopup',
	function($scope, $http, $state, $ionicModal, $timeout, $ionicPopup) {


		// Create and load the Modal
		$ionicModal.fromTemplateUrl('new-offer.html', function(modal) {
			$scope.offerModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});

		// Create new user and store them in the database
		$scope.createOffer = function(offer) {

			if (offer.title == null || offer.title == "") {

				var alertBDPopup = $ionicPopup.alert({
					title: 'Please enter title',
					okType: 'button-positive'

				});
				alertBDPopup.then(function(res) {

				});
				return false;
			}

			if (offer.message == null || offer.message == "") {

				var alertBTPopup = $ionicPopup.alert({
					title: 'Please enter message',
					okType: 'button-positive'

				});
				alertBTPopup.then(function(res) {

				});
				return false;
			}

			if (offer.expire == null || offer.expire == "") {

				var alertBGPopup = $ionicPopup.alert({
					title: 'Please enter expirey date.',
					okType: 'button-positive'

				});
				alertBGPopup.then(function(res) {

				});
				return false;
			}


			var offer = 'offferdata=' + JSON.stringify(offer);

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
			}).
			success(function(response) {

				$scope.offer = {};

				$state.go('tab.offers', {}, {
					reload: true,
					inherit: false
				});
				$scope.offerModal.remove();

			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});
		};



		// Open new offer modal
		$scope.newOffer = function() {
			$scope.offerModal.show();
		};

		// Close new offer modal
		$scope.closeNewOffer = function() {
			$scope.offerModal.hide();
		};

		$scope.doRefresh = function() {

			$timeout(function() {

				$scope.getOfferFn();

				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('offers', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.offers = newVal;
		});

		//=== getOfferFn() ====\\

		$scope.getOfferFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getoffer';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
			}).
			success(function(response) {
				$scope.offers = response;
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});
		};

	}
])

adminlounge.controller('MsgCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout',

	function($scope, $http, $state, $ionicModal, $timeout) {

		$scope.doRefresh = function() {

			$timeout(function() {

				$scope.getMsgFn();

				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('messages', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.messages = newVal;
		});
		//=== getMsgFn() ====\\

		$scope.getMsgFn = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getmsg';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
			}).
			success(function(response) {
				$scope.messages = response;
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});
		};



		// Handle respond button to messages. Opens deafult mail client
		// and loads current index email. 
		$scope.respondMsg = function(idx) {

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;

				window.location.href = link;
			};

			$scope.sendEmail($scope.messages[idx].email);
		};
	}
])

adminlounge.controller('CustomerCtrl', ['$scope', '$http', '$state', '$ionicModal', '$timeout', '$ionicPopup', 'md5',
	function($scope, $http, $state, $ionicModal, $timeout, $ionicPopup, md5) {

		// Create and load the Modal
		$ionicModal.fromTemplateUrl('new-user.html', function(modal) {
			$scope.userModal = modal;
		}, {
			scope: $scope,
			animation: 'slide-in-up'
		});


		// Create new user and store them in the database
		$scope.createUser = function(userdata) {

			if (userdata.firstname == null || userdata.firstname == "") {
				var alertFNPopup = $ionicPopup.alert({
					title: 'Please enter  First Name',
					okType: 'button-positive'

				});
				alertFNPopup.then(function(res) {

				});
				return false;
			}

			if (userdata.lastname == null || userdata.lastname == "") {
				var alertLNPopup = $ionicPopup.alert({
					title: 'Please enter  Last Name',
					okType: 'button-positive'

				});
				alertLNPopup.then(function(res) {

				});
				return false;
			}

			if (userdata.phone == null || userdata.phone == "") {
				var alertPHNPopup = $ionicPopup.alert({
					title: 'Please enter  phone no.',
					okType: 'button-positive'

				});
				alertPHNPopup.then(function(res) {

				});
				return false;
			}
			if (userdata.dob == null || userdata.dob == "") {
				var alertDOBPopup = $ionicPopup.alert({
					title: 'Please enter  D.O.B',
					okType: 'button-positive'

				});
				alertDOBPopup.then(function(res) {

				});
				return false;
			} else {

				if (userdata.email == null || userdata.email == "") {
					var alertEMPopup = $ionicPopup.alert({
						title: 'Not a valid e-mail address!',
						okType: 'button-positive'

					});
					alertEMPopup.then(function(res) {

					});
					return false;
				} else {
					var x = userdata.email;
					var atpos = x.indexOf("@");
					var dotpos = x.lastIndexOf(".");


					if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= x.length) {

						var alertEPopup = $ionicPopup.alert({
							title: 'Not a valid e-mail address!',
							okType: 'button-positive'

						});
						alertEPopup.then(function(res) {

						});
						return false;
					}
				}

				if (userdata.password == null || userdata.passwordconfirm == null || userdata.passwordconfirm == "" || userdata.password == "") {

					var alertPASSPopup = $ionicPopup.alert({
						title: 'Please Enter Password!',
						okType: 'button-positive'

					});
					alertPASSPopup.then(function(res) {

					});
					return false;
				}


				if (userdata.password === userdata.passwordconfirm) {
					var mdpass = md5.createHash(userdata.password || '')
					var newUser = {
						'firstname': userdata.firstname,
						'lastname': userdata.lastname,
						'email': userdata.email,
						'phone': userdata.phone,
						'password': mdpass,
						'dob': userdata.dob
					};

					var user = 'userdata=' + JSON.stringify(newUser);

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
					}).
					success(function(response) {
						$scope.user = {};
						var alertPopup = $ionicPopup.alert({
							title: 'Success!',
							okType: 'button-positive'

						});
						alertPopup.then(function(res) {

						});
						$state.go('tab.customers', {}, {
							reload: true,
							inherit: false
						});
						$scope.userModal.remove();

					}).
					error(function(response) {
						$scope.codeStatus = response || "Request failed";
						console.log($scope.codeStatus);
					});

				} else {
					var alertPopup = $ionicPopup.alert({
						title: 'Passwords Do Not Match!',
						okType: 'button-positive'

					});
					alertPopup.then(function(res) {

					});

				}
			}


		};


		// Open new user modal
		$scope.newUser = function() {
			$scope.userModal.show();
		};

		// Close new user modal
		$scope.closeNewUser = function() {
			$scope.userModal.hide();
		};

		$scope.doRefresh = function() {

			$timeout(function() {

				$scope.getCustomers();

				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');

			}, 1000);

		};

		$scope.$watch('customers', function(newVal, oldVal) {
			if (newVal === oldVal) {
				return;
			}

			$scope.customers = newVal;
		});

		//=== Get Customers ====\\

		$scope.getCustomers = function() {
			// on refactore move var direct.
			var method = 'GET';
			var inserturl = 'http://murmuring-beyond-7893.herokuapp.com/getusers';
			$scope.codeStatus = "";

			$http({
				method: method,
				url: inserturl,
				headers: {
					'Content-Type': 'application/json'
				},
			}).
			success(function(response) {
				$scope.customers = response;
			}).
			error(function(response) {
				$scope.codeStatus = response || "Request failed";
				console.log($scope.codeStatus);
			});


		};

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

			$scope.sendEmail = function(email) {
				var link = "mailto:" + email;

				window.location.href = link;

			};

			$scope.sendEmail($scope.customers[idx].email);
		};

	}
]);