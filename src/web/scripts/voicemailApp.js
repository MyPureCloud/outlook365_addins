/*global Office:false */
/*global traceService:false */
/*global loadHelpDialog:false */
/*global PureCloud:false */
/*exported startup */
/* jshint -W097 */
'use strict';

$("#content-main").hide();
$("#notLoggedIn").hide();

function setError(message, data){
    traceService.error(message +": " + JSON.stringify(data));
    $("#errorView").text(message);
    $("#errorView").show();
    $("#loading").hide();
}

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
                //url: 'https://y3cazhlrz9.execute-api.us-east-1.amazonaws.com/beta/exchangeTest',// '/lambda',
                url: '/lambda',
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 2000,
                data: JSON.stringify(attachmentData)
            }).success(function (data) {
                traceService.log(data);

                $("#player").show();
                $("#content-main").hide();

                function showRecordingUrlError(data){
                    setError("Unable to get recording url" , data);
                }

                function showRecording(messsage){
                    traceService.log("got recording, showing player");
                    $('#audioPlayer').attr("src", messsage.mediaFileUri);
                    $("#content-main").show();
                    $("#loading").hide();
                    $('#audioPlayer').show();
                }

                PureCloud.voicemail.messages.getVoicemailMessages().done(function (response) {
                    var data = response.body;
                    for(var i=0; i< data.entities.length; i++){
                        var message = message.entities[i];
                        console.log('message: ' + message.AudioRecordingDurationSeconds + ' ' + message.CallerAddress + ' ' + message.CreatedDate );

                        if(true){
                            PureCloud.voicemail.messages.media(message.id, "AAC")
                                        .done(showRecording)
                                        .error(showRecordingUrlError);
                        }

                    }
                }).error(function(data){
                    setError("Unable to get voicemail messages", data);
                });

            }).error(function(data){
                setError("Unable to find recording details", data);
            });
        });


}

function startup(){
    loadHelpDialog();
    getSessionAndVoicemail();
}
