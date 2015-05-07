var traceService = (function(){

    return{
        log: function(message){
            if(console && console.log){
                console.log("PureCloudOutlook: " + JSON.stringify(message));
            }
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
        }
    }

});
