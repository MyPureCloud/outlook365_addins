var userService = (function(){
    function createUser(email, name, pictureUrl, largepictureUrl, phone, department, title, status, id) {
        return {
            name: name,
            email: email,
            picture: pictureUrl,
            largePicture: largepictureUrl,
            phone: phone,
            department: department,
            title: title,
            status: status,
            id: id

        }
    }

    return {
        getUser: function (email, callback) {
            traceService.debug("get user " + JSON.stringify(email))

            if(callback != null){
                pureCloud.users.getUsersByEmail(email.emailAddress).then(function (response) {
                    var data = response.body;
                    if(data.entities.length == 1){

                        var user = data.entities[0];

                        var name = user.name;
                        var image = "/images/unknownuser48.png";
                        var largeImage = "/images/unknownuser96.png";

                        if(user.userImages != null && user.userImages.length >= 2){
                            image = user.userImages[0].imageUri;
                            largeImage = user.userImages[1].imageUri;
                        }

                        var phone = user.phoneNumber
                        var department = user.department;
                        var status= user.status.name;
                        var title = user.title;
                        var id = user.id;
                        callback(createUser( email.emailAddress, name, image, largeImage, phone, department, title, status, id))
                    }else{
                        callback(createUser(email.emailAddress, email.displayName))
                    }
                });
            }
        }
    }
});
