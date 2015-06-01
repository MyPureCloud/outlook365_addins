var userService = (function(){
    function createUser(email, name, pictureUrl, largepictureUrl, phone, department, title, status) {
        return {
            name: name,
            email: email,
            picture: pictureUrl,
            largePicture: largepictureUrl,
            phone: phone,
            department: department,
            title: title,
            status: status

        }
    }


    function getProperty(data){
        if(data && data.length > 0){
            return data[0].value;
        }

        return "";
    }

    function getRef(data){
        if(data && data.length > 0){
            return data[0].ref;
        }

        return {};
    }

    function getStatus(status){
        if(status && status.orgspan){
            var orgspan = getRef(status.orgspan);
            return orgspan.presence.value;
        }

        return {};
    }


    return {
        getUser: function (email, callback) {
            traceService.debug("get user " + JSON.stringify(email))
            //
            //restClient.get("/api/v1/contentmanagement/workspaces?pageSize=100&pageNumber=1&access=content")

            if(callback != null){
                $.ajax({
                    method: 'GET',
                    url: '/api/v1/users?username=' + email.emailAddress,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',

                    },
                    timeout: 2000
                }).success(function (data, status, headers, config) {
                //    data.res.user.personId
                    if(data.entities.length == 1){

                        var user = data.entities[0];

                        var name = user.name;
                        var image = user.userImages[0].imageUri;
                        var largeImage = user.userImages[1].imageUri;
                        var phone = user.phoneNumber
                        var department = user.department;
                        var status=""; //TODO: GET STATUS
                        var title = user.title;
                        callback(createUser(email.emailAddress, name, image, largeImage, phone, department, title, status))
                    }else{
                        callback(createUser(email.emailAddress, email.displayName))
                    }
                })

            }


        }
    }
});
