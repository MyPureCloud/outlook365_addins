/*global Office:false */
/*global PureCloud:false */
/*global startup:false */
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

        if(environment == "12920360ngrok"){
            environment = "localhost";
        }
        if(environment == "office365addinv2herokuapp"){
            environment = inindca;
        }
        var environments = {
            inindca_forreal: {
                clientId: "80718713-aa6c-4f7d-bf25-69d9c5e9df2a",
                callback: "https://apps.inindca.com/github-outlook365addins/auth.html"
            },
            ininsca: {
                clientId: "c08fd793-f867-4fcc-bf8c-4f92b294f53c",
                callback: "https://localhost:8080/auth.html"
            },
            inindca:{ 
                clientId: "5c0964d9-2cd0-4fe2-9f36-748da1abe701",
                callback: "https://office365addinv2.herokuapp.com/auth.html"
            }

/*
            localhost: {
                clientId: "c08fd793-f867-4fcc-bf8c-4f92b294f53c",
                callback: "https://localhost:8080/auth.html"
            },*/
            localhost: {
                callback: "https://12920360.ngrok.com/github-outlook365addins/auth.html",// "https://12920360.ngrok.com/auth.html",
                clientId: "cfa84537-8988-4f7e-af7c-ef48625f1000"

            }
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

    } catch (e) {
        document.writeln(JSON.stringify(e));
    } finally {

    }

    if(!PureCloud.hasAuthorizationToken()){
        traceService.debug("authorize token not present");

        PureCloud.authorize(clientId, callback, app, purecloudEnvironment);
        return;
    }else{
        traceService.debug("authorize token present, setting environment");
        PureCloud.setEnvironment(purecloudEnvironment);
    }

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
}

Office.initialize = function () {
    authorizeAndStart();
};
