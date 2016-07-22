angular.module('polling.splashController', [])

.controller('SplashCtrl', function($scope, $state ,$stateParams) {
  setTimeout(function(){ $state.go("help"); }, 3000);
});