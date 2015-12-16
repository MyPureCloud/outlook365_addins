/*global Office:false */
/*global traceService:false */
/*global loadHelpDialog:false */
/*global PureCloud:false */
/*global statusService:false */
/*global Mustache:false */
/*exported startup */
/* jshint -W097 */
'use strict';

$("#content-main").hide();
$("#notLoggedIn").hide();

var statusServiceInstance = null;
var settings = null;

function setError(message, data){
    traceService.error(message +": " + JSON.stringify(data));
    $("#errorView").text(message);
    $("#errorView").show();
    $("#loading").hide();
}

function handleStatusChanged(userid, status){
    $("#fromImage").removeClass (function (index, css) {
        return (css.match (/status[A-Za-z]*/) || []).join(' ');
    });

    $("#fromImage").addClass("status" + status);
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

                function showRecording(templateData, phoneNumber, contactId){
                    traceService.log("got recording, showing player");

                    $("#content-main").show();
                    $("#loading").hide();
                    $('#audioPlayer').show();

                    var template = $('#recordingTemplate').html();
                    var html = Mustache.to_html(template, templateData);
                    $("#recordingContent").html(html);

                    $('#detailPhoneLink').click(function(){
                        PureCloud.conversations.createConversation(phoneNumber, null, null, contactId);
                    });
                }

                PureCloud.voicemail.messages.getVoicemailMessages().done(function (data) {
                    for(var i=0; i< data.entities.length; i++){
                        var message = data.entities[i];
                        traceService.log('message: ' + message.AudioRecordingDurationSeconds + ' ' + message.CallerAddress + ' ' + message.CreatedDate );

                        if(true){
                            /**** Example voicemail message

                            {
                                  "id": "e2d58e6a-42f1-4db4-96df-e9821810b06d",
                                  "conversation": {
                                    "id": "88851e0e-4c6d-44ab-90c1-c00ee7c93056",
                                    "participants": [],
                                    "selfUri": "https://public-api.us-east-1.inindca.com/api/v1/conversations/88851e0e-4c6d-44ab-90c1-c00ee7c93056"
                                  },
                                  "read": false,
                                  "audioRecordingDurationSeconds": 4,
                                  "audioRecordingSizeBytes": 6413,
                                  "createdDate": "2015-12-15T21:50:46.734Z",
                                  "modifiedDate": "2015-12-15T21:50:46.734Z",
                                  "callerAddress": "+13177158637",
                                  "callerName": "Glinski, Kevin",
                                  "callerUser": {
                                    "id": "f8ca529b-4fcb-4196-a34e-4ae6f7d1c974",
                                    "userImages": [],
                                    "selfUri": "https://public-api.us-east-1.inindca.com/api/v1/users/f8ca529b-4fcb-4196-a34e-4ae6f7d1c974"
                                  },
                                  "selfUri": "https://public-api.us-east-1.inindca.com/api/v1/voicemail/messages/e2d58e6a-42f1-4db4-96df-e9821810b06d"
                                }

                            *****/
                            var templateData = {
                                fromName: message.callerName,
                                fromNumber: message.callerAddress,
                            };

                            PureCloud.voicemail.messages.media.getMessageMedia(message.id)
                                .done(function(messageDetails){
                                    templateData.voicemailUri = messageDetails.mediaFileUri;
                                })
                                .error(showRecordingUrlError)
                                .then(function(){
                                    if(message.callerUser){
                                        statusServiceInstance.subscribeToUserStatus([message.callerUser.id], handleStatusChanged);

                                        templateData.fromId = message.callerUser.id;

                                        PureCloud.get(message.callerUser.selfUri)
                                            .done(function(userDetails){
                                                if(userDetails.userImages !== null && userDetails.userImages.length >= 2){
                                                    templateData.picture = userDetails.userImages[1].imageUri;
                                                }
                                                templateData.fromTitle = userDetails.title;
                                                templateData.fromDepartment = userDetails.department;
                                            }).then(function(){
                                                statusServiceInstance.getUserStatus(message.callerUser.id, function(status){
                                                    templateData.fromStatus = status;
                                                    showRecording(templateData, null, message.callerUser.id);
                                                });
                                            });
                                    }

                                    showRecording(templateData, message.callerAddress, null);
                                });

                            return;
                        }
                        setError("Unable to find voicemail messages", {});
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
    settings = appSettings();

    statusServiceInstance = statusService();
    statusServiceInstance.setContactCount(1);
    getSessionAndVoicemail();

}
