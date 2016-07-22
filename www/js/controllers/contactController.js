angular.module('polling.contactController', [])

.controller('ContactCtrl', function($scope, $state ,$stateParams, $ionicScrollDelegate, Groups, Users) {
  
  $scope.currentGroups = [];
  $scope.usersToParticipants = [];
  
  angular.element(document).ready(function () {
     setCurrentGroups();
  });

  var setCurrentGroups = function() {
  	Groups.getAll().then(function(groups){
	   $scope.currentGroups = groups;
	   console.log('Get Groups Success');
	 }).catch(function(error){
	   console.log('Get Groups Fail');
	 });
  };

  $scope.gotoInvite =function() {
    if ($scope.currentGroupID == undefined || $scope.currentGroupID == '' || $scope.currentGroupID == 'Select') {
      alert('Select Group To Save');
      return;
    }
    $state.go("app.invite", {}, {reload: true});
    console.log($scope.phoneContacts);
  };

  
  
  $scope.createNewGroup = function(newGroupName) {
  	if (newGroupName == '' || newGroupName == undefined) {
  		alert("Input New Group Name");
  		return;
  	}
  	$scope.newGroupName = newGroupName;
  	Groups.setGroup({
  		group_name: $scope.newGroupName,
  		userID_array: [],
  	}).then(function(group){
  		console.log("Group Created Successfully");
  		setCurrentGroups();
  	}).catch(function(error){
      console.log("Group Created fail");
    });
  };

  $scope.removeGroup = function(currentGroupID) {
  	if (currentGroupID == undefined || currentGroupID == '') {
  		console.log("Select Group To Remove");
  		return;
  	}

  	Groups.removeGroup(currentGroupID).then(function(){
  		console.log("Group Removed Successfully");
  		setCurrentGroups();
  	}).catch(function(error){
  		console.log('Group Removed Fail');
  	});
  };

  $scope.gotoAddPollFromContact = function() {
  	if ($scope.currentGroupID == undefined || $scope.currentGroupID == '') {
  		alert('Select Group To Invite');
  		return;
  	}
  	$state.go('app.addPoll');
  };

});