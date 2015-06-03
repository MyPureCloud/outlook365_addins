var traceService = (function(){

    function traceToServer(level, message){

        $.ajax({
            method: 'POST',
            url: '/trace',
            headers: {
                'Accept': 'application/json',
                'Content-Type': "text/plain",

            },
            timeout: 2000,
            data: level + " - " + message
        })

    }

    return{
        log: function(message){
            if(console && console.log){
                console.log("PureCloudOutlook: " + JSON.stringify(message));
            }

            traceToServer("LOG", message)
        },
        debug: function(message){
            if(console && console.log){
                console.log("PureCloudOutlook: " + JSON.stringify(message));
            }

            traceToServer("DEBUG", message)
        },
        error: function(message){
            if(console && console.error){
                console.error("PureCloudOutlook: " + JSON.stringify(message));
            }

            traceToServer("ERROR", message)
        }
    }

});
