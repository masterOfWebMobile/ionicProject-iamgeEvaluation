angular.module('polling.helpController', [])

.controller('HelpCtrl', function($scope, $state ,$stateParams, $ionicScrollDelegate) {
  $scope.gotoAddPoll =function() {
    $state.go("app.contact");
  }
});