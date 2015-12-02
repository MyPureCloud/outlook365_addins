/*global traceService:false */
/*global PureCloud:false */
/*exported userService */
/*exported startup */
/* jshint -W097 */
'use strict';

var userService = (function(){
    var OUTLOOK_FOR_MAC_USER_AGENT = /^Mozilla\/5\.0 \(Macintosh; Intel Mac OS X 10_11_1\) AppleWebKit\/\d\d\d.\d+.\d+ \(KHTML, like Gecko\)$/;
    var cdnUrl = '/'

    function createUser(email, name, pictureUrl, largepictureUrl, phone, department, title, status, id) {
        return {
            name: name,
            email: email,
            picture: pictureUrl,
            largePicture: largepictureUrl,
            phone: phone,
            department: department,
            title: title,
            status: status ? status.replace(/ /g,'') : "",
            id: id

        };
    }

    function isInt(n){
        return Number(n) === n && n % 1 === 0;
    }

    $.get(location.origin + "/github-outlook365addins/manifest.json").done(function(data) {
        var buildNumber = data.buildNumber;
        traceService.log(buildNumber);

        if(isInt(buildNumber)){
            cdnUrl = "https://cdn.rawgit.com/MyPureCloud/outlook365addins/"+ buildNumber +"/src/web/";
        }
    });

    return {
        getUser: function (email, callback) {
            var CDN_URL = (typeof CDN_URL === 'undefined') ? '/' : CDN_URL;

            traceService.debug("get user " + JSON.stringify(email));

            if(callback !== null){
                PureCloud.users.getUsers(null,null, null, null, null, null, email.emailAddress).done(function (data) {

                    if(data.entities.length === 1){

                        var user = data.entities[0];
                        var name = user.name;
                        var image = CDN_URL + "images/unknownuser48.png";
                        var largeImage = CDN_URL + "images/unknownuser96.png";

                        if(user.userImages !== null && user.userImages.length >= 2 && !navigator.userAgent.match(OUTLOOK_FOR_MAC_USER_AGENT )){
                            image = user.userImages[0].imageUri;
                            largeImage = user.userImages[1].imageUri;
                        }

                        var phone = user.phoneNumber;
                        var department = user.department;
                        var status= user.status.name;
                        var title = user.title;
                        var id = user.id;
                        callback(createUser( email.emailAddress, name, image, largeImage, phone, department, title, status, id));
                    }else{
                        callback(createUser(email.emailAddress, email.displayName));
                    }
                }).error(function(){
                    callback(createUser(email.emailAddress, email.displayName));
                });
            }
        }
    };
});
