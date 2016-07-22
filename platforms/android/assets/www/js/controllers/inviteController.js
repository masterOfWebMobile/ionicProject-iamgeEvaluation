angular.module('polling.inviteController', [])

.controller('InviteCtrl', function($scope, $q, $cordovaContacts, Loading, Groups, Users, $cordovaSocialSharing) {

  var containsUser = function(list, obj) {
    for (i = 0; i < list.length; i++) {
      if (list[i].username == obj.username && list[i].password == obj.password && list[i].phone == obj.phone) {
        return true;
      }
    }
    return false;
  };

  var setPhoneContacts = function(contact) {     
      contact.isUser = false;
      contact.isUserOfCurrentGroup = false;
      var promise = contact.phoneNumbers.forEach(function(phoneNumber) {
        Users.getUserByPhoneNumber($scope.filterPhoneNumber(phoneNumber.value)).then(function(user){
          if (user != undefined) {
            contact.isUser = true;
            if (containsUser($scope.usersToInvite, user)) {
                  contact.isUserOfCurrentGroup = true;
            }
          }
        }).catch(function(error){
        }); 
      });
      $scope.phoneContacts.push(contact);
      return $q.when(contact);
      return Loading.progress(promise);
  };

  var getContacts = function() {
    $scope.phoneContacts = [];

    function onSuccess(contacts) {
      for (var i = 0; i < contacts.length; i++) {
        var contact = contacts[i];
        setPhoneContacts(contact);
      }
    };
    function onError(contactError) {
      alert(contactError);
    };
    var options = {};
    options.multiple = true;
    $cordovaContacts.find(options).then(onSuccess, onError);
  };

  angular.element(document).ready(function () {
	   getContacts();
     $scope.saveGroup()
  });

  
  $scope.shareThroughWhatsapp = function() {
    var link = "http://";
    $cordovaSocialSharing
    .shareViaWhatsApp('Please install this app to accept my invite!', null, link)
    .then(function(result) {
      // Success!
      alert("sharing success!");
    }, function(err) {
      alert("sharing failed!");
      // An error occurred. Show a message to the user
    });
  };

  $scope.inviteLineClick = function(contact) {
    if (contact.isUser == false) {
      return;
    }
    if (contact.isUserOfCurrentGroup == false) {
      contact.isUserOfCurrentGroup = true;
      contact.phoneNumbers.forEach(function(phoneNumber) {
        Users.getUserByPhoneNumber($scope.filterPhoneNumber(phoneNumber.value)).then(function(user){
          if (user != undefined) {
            $scope.usersToInvite.push(user);
          }
        }).catch(function(error){
        }); 
      });
    }
    else if (contact.isUserOfCurrentGroup == true) {
      contact.isUserOfCurrentGroup = false;
      contact.phoneNumbers.forEach(function(phoneNumber) {
        Users.getUserByPhoneNumber($scope.filterPhoneNumber(phoneNumber.value)).then(function(user){
          if (user != undefined) {
            for(i = 0; i < $scope.usersToInvite.length; i++) {
              if (user.phone == $scope.usersToInvite[i].phone) {
                $scope.usersToInvite.splice(i, 1);
              }
            }
            
          }
        }).catch(function(error){
        }); 
      });
    }
  };

});