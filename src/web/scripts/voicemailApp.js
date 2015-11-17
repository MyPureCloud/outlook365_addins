/*global Office:false */
/*global traceService:false */
/*global loadHelpDialog:false */
/*global PureCloud:false */
/*exported startup */
/* jshint -W097 */
'use strict';

$("#content-main").hide();
$("#notLoggedIn").hide();

function getSessionAndVoicemail(){
    $("#content-main").hide();
    $("#loading").show();

    var mailId = Office.context.mailbox.item.itemId;

    var ewsUrl = Office.context.mailbox.ewsUrl;

    Office.context.mailbox.getCallbackTokenAsync(function (ar) {
            var attachmentData = {
                AuthToken: ar.value,
                EwsUrl: ewsUrl,
                MailId : mailId
            };

            $.ajax({
                method: 'POST',
                url: 'https://y3cazhlrz9.execute-api.us-east-1.amazonaws.com/beta/exchangeTest',// '/lambda',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
                data: JSON.stringify(attachmentData)
            }).success(function (data) {
                traceService.log(data);

                PureCloud.voicemail.messages.getMessages().done(function (response) {
                    var data = response.body;
                    for(var i=0; i< data.entities.length; i++){
                        var message = data.entities[i];
                        console.log('message: ' + message.AudioRecordingDurationSeconds + ' ' + message.CallerAddress + ' ' + message.CreatedDate );
                    }
                });

/*
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


                }).error(function(data){
                    traceService.error("Unable to get recording url: " + JSON.stringify(data))
                    $("#errorView").text("Unable to get recording url")
                    $("#errorView").show();
                    $("#loading").hide();
                });
                */
            }).error(function(data){
                traceService.error("unable to find recording: " + JSON.stringify(data));
                    $("#errorView").text("Unable to find recording");
                    $("#errorView").show();
                    $("#loading").hide();

            });
        });


}

function startup(){
    loadHelpDialog();
    getSessionAndVoicemail();
}
