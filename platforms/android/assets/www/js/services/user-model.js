
angular.module('polling.user-model', [])

.service('Users', function($q, Loading) {

  var usersRef = firebase.database().ref('/users');

  var filterPhoneNumber = function(phoneNumber) {
    return phoneNumber.replace(/[()\- ]/g, '');
  }

  this.setUser = function(info) {

    var userRef;
    if (info.id) {
      userRef = usersRef.child(info.id);
    } else {
      userRef = usersRef.push();
    }

    var user = {
      username: info.username.trim(),
      phone: filterPhoneNumber(info.phone.toString()),
      password: info.password,
    };

    var promise = userRef.set(user).then(function() {
      user.id = userRef.key;
      return $q.when(user);
    });

    return Loading.progress(promise);

  }

  this.getUserById = function(id) {

    var promise = usersRef.child(id)
      .once('value').then(function(snapshot) {
        var user = _getUserInfo(snapshot);
        return $q.when(user);
      });

    return Loading.progress(promise); 

  }

  this.getUserByName = function(username) {

    var promise = usersRef.orderByValue().ref
      .orderByChild('username').equalTo(username)
      .once('value').then(function(snapshot) {
        var user;
        snapshot.forEach(function(data) {
          user = _getUserInfo(data);
        });
        return $q.when(user);
      });

    return Loading.progress(promise); 

  }

  this.getUserByPhoneNumber = function(phonenumber) {

    var promise = usersRef.orderByValue().ref
      .orderByChild('phone').equalTo(phonenumber)
      .once('value').then(function(snapshot) {
        var user;
        snapshot.forEach(function(data) {
          user = _getUserInfo(data);
        });
        return $q.when(user);
      });

    return Loading.progress(promise); 

  }

  this.getUserByNameAndPass = function(username, password) {

    var promise = usersRef.orderByValue().ref
      .orderByChild('username').equalTo(username).ref
      .orderByChild('password').equalTo(password)
      .once('value').then(function(snapshot) {
        var user;
        snapshot.forEach(function(data) {
          user = _getUserInfo(data);
        });
        return $q.when(user);
      });

    return Loading.progress(promise); 

  }

  function _getUserInfo(snapshot) {
    var key = snapshot.key;
    var user = snapshot.val();
    user.id = key;
    return user;
  }

})

