/*global Office:false */
/*global PureCloud:false */
/*global startup:false */
/*global loadHelpDialog:false */
/*exported traceService */
/*exported getFileSizeString */
/*exported inIframe */
/* jshint -W097 */
'use strict';

var traceService = new traceService();

function getFileSizeString(numOfBytes){
    if(numOfBytes < 1024){
        return numOfBytes + " Bytes";
    }
    var kb = numOfBytes / 1024;
    if(kb < 1000){
        return Math.round(kb) + " KB";
    }

    var mb = numOfBytes / 1048576;
    return Math.round(mb) + " MB";
}

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function authorizeAndStart(){

    try {
        traceService.debug("authorize and start called");
        var clientId = "";
        var callback = "";

        var environment = window.location.hostname.replace(/(apps|com|\.)/g,"");
        traceService.debug("environment " + environment);

        //environment = "localhost";

        var environments = {
            inindca: {
                clientId: "80718713-aa6c-4f7d-bf25-69d9c5e9df2a",
                callback: "https://apps.inindca.com/github-outlook365addins/auth.html"
            },
            ininsca: {
                clientId: "44a42e02-9504-4f84-af04-0ce42ada8a32",
                callback: "https://apps.ininsca.com/github-outlook365addins/auth.html"
            },
            localhost: {
                clientId: "ba83addc-4c7d-4f93-8faa-2635de89ad5a",
                callback: "https://localhost:8080/auth.html"
            }
            /*localhost:{
                clientId: "cfa84537-8988-4f7e-af7c-ef48625f1000",
                callback : "https://12920360.ngrok.com/auth.html"
            }*/
        };

        if(environments[environment] !== null){
            clientId = environments[environment].clientId;
            callback = environments[environment].callback;
        }else{
            traceService.log("Unsupported environment " + environment );
            return;
        }

        var purecloudEnvironment = environment + ".com";
        var app = "github-outlook365addins/" + window.location.pathname.match(/[a-zA-Z]*\.html/)[0];

        if(environment === "localhost"){
            purecloudEnvironment = "inindca.com";
            app = "github-outlook365addins/" + window.location.pathname.match(/[a-zA-Z]*\.html/)[0];
        }

        PureCloud.authorize(clientId, callback, app, purecloudEnvironment).done(function(){
            traceService.debug("authorize token present, setting environment");
            PureCloud.setEnvironment(purecloudEnvironment);

            $('#settings').hide();
            $('#settingsButton').click(function(){
                $('#settings').show();
            });

            $(".close").click(function(){
                $(this).parent().hide();
            });

            $('#logoffButton').click(function(){
                PureCloud.logout();
            });

            startup();

            loadHelpDialog();
            $("#useragent").html( navigator.userAgent);

            $('body').css('background-color', '#fff');
        });


    } catch (e) {
        traceService.error(JSON.stringify(e));
    }
}

Office.initialize = function () {
    authorizeAndStart();
};
