(function(module, app) {
	// Create app if it does not already exist
	if (!app) app = window._$_app = angular.module('site', ['directives', 'services', 'controllers']);
	// Service that handles registration
	module.service('RegisterSvc', ['$http',
		function($http) {
			// This template is used to redirect to the payment form @ paypal
			var PAYPAL_API_CALL_TEMPLATE = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd"' +
				' value="_s-xclick"><input type="hidden" name="hosted_button_id" value="6CYDNKB4YDGVC"><input type="hidden" name="notify_url" ' +
				' value="http://acm.temple.edu/members/payments/callback/{{id}}"></form>';
			var PAYPAL_API_CALL_ID_TOKEN = '{{id}}';

			this.isUserNameFree = function(userName) {
				return $http({
					method: 'GET',
					url: '/members/userName/isFree',
					params: {
						userName: userName
					}
				});
			};
			this.isEmailFree = function(email) {
				return $http({
					method: 'GET',
					url: '/members/email/isFree',
					params: {
						email: email
					}
				});
			};
			this.isMembershipFree = function(membership) {
				return $http({
					method: 'GET',
					url: '/members/membership/isFree',
					params: {
						membership: membership
					}
				});
			};
			this.registerUser = function(user) {
				return $http({
					method: 'POST',
					url: '/members/register',
					data: user
				});
			};
			this.redirectToPaypal = function(userId) {
				// TODO make this not the fake url on live
				var form = $(PAYPAL_API_CALL_TEMPLATE.replace(PAYPAL_API_CALL_ID_TOKEN, userId));
				// Add to the DOM first - FF bug
				$('body').append(form);
				form.submit();
			};
		}
	]);
	// Service that handles events
	module.service('EventSvc', ['$http',
		function($http) {
			this.getEvents = function() {
				return $http({
					method: 'GET',
					url: '/events/calendar'
				});
			};
		}
	]);
	module.service('LoginSvc', ['$http',
		function($http) {
			this.logInUser = function(user) {
				return $http({
					method: 'POST',
					url: '/members/login',
					data: user
				});
			};
			this.isLoggedIn = function() {
				return $http({
					method: 'GET',
					url: '/members/isLoggedIn'
				});
			};
			this.logOut = function() {
				return $http({
					method: 'GET',
					url: '/members/logout'
				});
			};
			this.resetPassword = function(pass, token) {
				return $http({
					method: 'POST',
					url: '/members/resetPassword',
					data: {
						newPassword: pass,
						passwordResetToken: token
					}
				});
			};
			this.forgotPassword = function(userName, email) {
				return $http({
					method: 'POST',
					url: '/members/forgotPassword',
					data: {
						userName: userName,
						email: email
					}
				});
			};
		}
	]);
	module.service('OfficersSvc', ['$http',
		function($http) {
			this.getOfficers = function() {
				return $http({
					method: 'GET',
					url: '/members/officers'
				});
			};
		}
	]);
})(angular.module('services', []), window._$_app);
