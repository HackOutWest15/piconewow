var MYUSER;
function loginClick(evt){
    FB.login(function (res) {
      if (res.status == "connected" && res.authResponse) {
          
          var jsonData = {access_token:res.authResponse.accessToken};
          $.post('/facebook',jsonData,function(data){
              MYUSER = data;
              console.log('myUser: ',data);
            }).error(function(err){
          });
      }
    }, { scope: 'email,public_profile,user_friends' });
  }