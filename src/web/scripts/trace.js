/*exported traceService */
/* jshint -W097 */
'use strict';

var traceService = (function(){

    function traceToServer(level, message){

        level = message;
        return;// keep tracing local for now
    }

    return{
        log: function(message){
            if(console && console.log){
                console.log("PureCloudOutlook: " + JSON.stringify(message));
            }

            traceToServer("LOG", message);
        },
        debug: function(message){
            if(console && console.log){
                console.log("PureCloudOutlook: " + JSON.stringify(message));
            }

        },
        error: function(message){
            if(console && console.error){
                console.error("PureCloudOutlook: " + JSON.stringify(message));
            }

            traceToServer("ERROR", message);
        }
    };

});
