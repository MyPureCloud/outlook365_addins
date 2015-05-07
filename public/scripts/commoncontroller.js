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
    })


    $("#logoffButton").click(function(){
        $.ajax({
            method: 'GET',
            url: '/logout',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            timeout: 2000
        }).success(function (data, status, headers, config) {
            window.location.reload();
        });
    })

});


function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


if(window.location.href.indexOf("?test") == -1){
    Office.initialize = function () {
        startup();
    };
}
else{
    $(document).ready(function(){
        startup();
    })
}
