angular.module('polling.controllers', [])

.controller('AppCtrl', function($scope, $q, Auth, $ionicModal, $timeout, $state, $cordovaCamera, $cordovaSocialSharing, $window, Polls, Poll, ImageFile, $cordovaContacts, $ionicHistory, Groups, Users, Loading) {
  
  $scope.imageWithName = [];
  $scope.rightImageWithName = [];
  $scope.usersToInvite = [];
  $scope.currentGroup;

  $scope.onClickTitle = function() {
    $scope.imageWithName = [];
    $scope.rightImageWithName = [];
    $scope.getMyPolls();
    $scope.getToRate(); 
  }

  $scope.getMyPolls = function() {
    Polls.getAll(Auth.getID()).then(function(polls){
      console.log(Auth.getID());
       polls.forEach(function(poll) {
          var item = poll;
          $scope.imageWithName.push(item);
          ImageFile.download(poll.photo).then(function(url){
            item.url = url;
          }).catch(function(error){
          });
        });
       console.log('Get Polls Success');
     }).catch(function(error){
       console.log('Get Polls Fail');
     });
  };

  var getAllWithInvitedID = function(id) {
    
    var promise = Polls.getAllPolls().then(function(polls){
      var tempPolls = [];
      polls.forEach(function(poll){
        poll.invitedPeopleIDandRate_array.forEach(function(invitedPeopleIDandRate){
          if(invitedPeopleIDandRate.peopleID == id){
            tempPolls.push(poll);
          }
        });
      });
      return $q.when(tempPolls);
    });
    return Loading.progress(promise);
  }

  $scope.getToRate = function() {
    getAllWithInvitedID(Auth.getID()).then(function(polls){
      console.log(polls);
      polls.forEach(function(poll) {
          var item = poll;
          $scope.rightImageWithName.push(item);
          ImageFile.download(poll.photo).then(function(url){
            item.url = url;
          }).catch(function(error){
          });
        });
       console.log('Get Polls Success');
    });
  };
  
  angular.element(document).ready(function () {
    $scope.getMyPolls();
    $scope.getToRate();     
  });

  $scope.onButtonClicked = function() {
    $scope.on_button_clicked = 'button-clicked';
    $scope.off_button_clicked = '';
  }

  $scope.offButtonClicked = function() {
    $scope.on_button_clicked = '';
    $scope.off_button_clicked = 'button-clicked';
  }

  $scope.gotoToRate = function(rightItem) {
    console.log(rightItem); 
    ImageFile.download(rightItem.photo).then(function(url){
        $scope.toRatePageImage = url;
        $scope.selectedPollToRate = rightItem;
        $state.go("app.toRate");
    }).catch(function(error){
      console.log("image download fail");
    });    
  };

  $scope.gotoMyPoll = function(item) {
    console.log(item);
    $scope.selectedPoll = item;
    $state.go("app.myPoll"); 
  };  

  $scope.gotoAddPoll = function() {
    $state.go("app.addPoll", {}, {reload: true});
  };

  $scope.gotoAddPollWithOutReload = function() {
    $state.go("app.addPoll");
  };

  $scope.gotoContact = function() {
    $state.go("app.contact", {}, {reload: true});
  };
  
  $scope.changeGroup = function(currentGroupID) {
    $scope.currentGroupID = currentGroupID;
    Groups.getGroupById(currentGroupID).then(function(group){
      console.log('Get Group Success');
      var users = [];
      if(group.userID_array == undefined) {
        $scope.usersToInvite = [];
        return;
      }
      group.userID_array.forEach(function(userid){
        Users.getUserById(userid).then(function(user){
          users.push(user);
        });
      });
      $scope.usersToInvite = users;
    }).catch(function(error){
      console.log('Get Group Fail');
    });
  };

  $scope.saveGroup = function() {
    if ($scope.currentGroupID == undefined || $scope.currentGroupID == '') {
      alert('Select Group To Save');
      return;
    }
    var userids = [];
    $scope.usersToInvite.forEach(function(user){
      userids.push(user.id);
    });
    var groupname;
    Groups.getGroupById($scope.currentGroupID).then(function(group){
      groupname = group.group_name;
      Groups.setGroup({
        id: $scope.currentGroupID,
        group_name: groupname,
        userID_array: userids,
      });
    });

  };

  $scope.filterPhoneNumber = function(phoneNumber) {
    return phoneNumber.replace(/[()\- ]/g, '');
  }

  $scope.setFeedbackToPoll = function() {
    $scope.selectedPollToRate.invitedPeopleIDandRate_array.forEach(function(invitedPeopleIDandRate){
      if(invitedPeopleIDandRate.peopleID == Auth.getID()) {
        invitedPeopleIDandRate.rate_array = $scope.selectedPollToRate.rateOption_array;
      }
    });
    Polls.setPoll($scope.selectedPollToRate).then(function(poll){
      alert("Set Feedback Successfully!");
    }).catch(function(error){

    });
  };

});
