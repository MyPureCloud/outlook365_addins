
$("#content-main").hide();
$("#notLoggedIn").hide();

function getSessionAndVoicemail(){
    $("#content-main").hide();
    $("#loading").show();

    mailId = Office.context.mailbox.item.itemId;

    var ewsUrl = Office.context.mailbox.ewsUrl;

    Office.context.mailbox.getCallbackTokenAsync(function (ar) {
            var attachmentData = {
                AuthToken: ar.value,
                EwsUrl: ewsUrl,
                MailId : mailId
            };

            $.ajax({
                method: 'POST',
                url: '/getrecordingurl',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
                data:JSON.stringify(attachmentData)
            }).success(function (data, status, headers, config) {


                $("#player").show();
                $("#content-main").hide();


                $.ajax({
                    method: 'GET',
                    url: data.media +"/media?formatId=AAC",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'

                    },
                    timeout: 2000
                }).success(function (data, status, headers, config) {
                    traceService.log("got recording, showing player")
                    $('#audioPlayer').attr("src", data.mediaFileUri);
                    $("#content-main").show();
                    $("#loading").hide();
                    $('#audioPlayer').show();


                }).error(function(data,status,headers, config){
                    traceService.error("Unable to get recording url: " + JSON.stringify(data))
                    $("#errorView").text("Unable to get recording url")
                    $("#errorView").show();
                    $("#loading").hide();
                });
            }).error(function(data,status,headers, config){
                traceService.error("unable to find recording: " + JSON.stringify(data))
                    $("#errorView").text("Unable to find recording")
                    $("#errorView").show();
                    $("#loading").hide();
            });
        });


}

function startup(){

    loadHelpDialog();

    getSessionAndVoicemail();

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
