/*global PureCloud:false */
/*exported statusService */
/* jshint -W097 */
'use strict';

var statusService = (function(){
    var presenceDefinitions = {};
    var contactCount = 0;
    var userStatusChangedCallback = function(){};
    var channelId= null;
    var webSocket = null;

    PureCloud.presencedefinitions.getOrganizationpresences().done(function(presences){
        for(var x =0; x< presences.entities.length; x++){
            var presence = presences.entities[0];
            presenceDefinitions[presence.id] = presence.systemPresence;
        }
    });

    PureCloud.notifications.channels.createChannel().done(function(data){
        channelId = data.id;
        //start a new web socket using the connect Uri of the channel
        webSocket = new WebSocket(data.connectUri);

        webSocket.onmessage = function(socketMessage) {
            try{
                var message =  JSON.parse(socketMessage.data);

                if(message.topicName.match(/users.*primarypresence/)){
                    var userId =message.topicName.replace('users.','').replace('.primarypresence', '');
                    var newStatus = message.eventBody.presenceDefinition.systemPresence;

                    userStatusChangedCallback(userId, newStatus);
                }
            }catch(err){}

        };
    });

    return {
        getUserStatus: function (id, callback) {
            PureCloud.users.presences.getUserpresence(id,"PURECLOUD").done(function (presenceData){
                var status= '';

                if(presenceDefinitions[presenceData.presenceDefinition.id]){
                    status = presenceDefinitions[presenceData.presenceDefinition.id];
                    callback(status);
                }else{
                    PureCloud.presencedefinitions.getOrganizationpresence(presenceData.presenceDefinition.id).done(function(presenceDefinition){
                        status = presenceDefinition.systemPresence;
                        presenceDefinitions[presenceData.presenceDefinition.id] = status;

                        callback(status);
                    }).error(function(){
                        callback('');
                    });
                }

            }).error(function(){
                callback('');
            });
        },
        //this must be called before anything else with the number of stauses that will be watched
        setContactCount:function(count){
            contactCount = count;
        },

        subscribeToUserStatus:function(userIds, callback){
            if(contactCount > userIds.length){
                return;
            }

            userStatusChangedCallback = callback;

            var subscriptionList = [];

            for(var index=0; index < userIds.length; index++){
                subscriptionList.push ({"id": "users."+ userIds[index] +".primarypresence"});
            }
            PureCloud.notifications.channels.subscriptions.addSubscription(channelId, subscriptionList);

        }
    };
});
