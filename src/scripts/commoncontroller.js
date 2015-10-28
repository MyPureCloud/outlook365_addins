var traceService = new traceService();

function getFileSizeString(numOfBytes){
    if(numOfBytes < 1024){
        return numOfBytes + " Bytes"
    }
    var kb = numOfBytes / 1024;
    if(kb < 1000){
        return Math.round(kb) + " KB";
    }

    var mb = numOfBytes / 1048576;
    return Math.round(mb) + " MB";
}

$( document ).ready(function() {
    $('#settings').hide();
    $('#settingsButton').click(function(){
        $('#settings').show();
    });

    $(".close").click(function(){
        $(this).parent().hide();
    });

    $('#logoffButton').click(function(){
        pureCloud.auth.logout();
    });
});


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


traceService.log("calling office.initialize");

function authorizeAndStart(){
    sessionStorage['app'] = window.location.pathname + window.location.search;
    if(!pureCloud.auth.hasAuthorizationToken()){
        pureCloud.auth.authorize('c08fd793-f867-4fcc-bf8c-4f92b294f53c', 'https://localhost:8080/auth.html', 'inindca');
        return;
    }

    startup();
}

if(window.location.href.indexOf("?test") == -1){
    Office.initialize = function () {
        authorizeAndStart();
    };
}
else{
    $(document).ready(function(){
        authorizeAndStart();
    })
}
