exports.handler = function(event, context) {
    var authToken = event.AuthToken;
    var ewsUrl = event.EwsUrl;
    var mailId = event.MailId;

    console.log("lambda handler");

    var url = require('url')

    var data = '<?xml version="1.0" encoding="utf-8"?>'+
    '<soap:Envelope '+
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" '+
    'xmlns:xsd="http://www.w3.org/2001/XMLSchema" '+
    'xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" '+
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">'+
    '<soap:Header>'+
    '<t:RequestServerVersion Version="Exchange2013" />'+
    '</soap:Header>'+
    '<soap:Body>'+
    '<GetItem '+
    'xmlns="http://schemas.microsoft.com/exchange/services/2006/messages" '+
    'xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">'+
    '<ItemShape>'+
    '<t:BaseShape>Default</t:BaseShape>'+
    '<t:IncludeMimeContent>true</t:IncludeMimeContent>'+
    '</ItemShape>'+
    '<ItemIds>'+
    '<t:ItemId Id="'+ mailId +'" />'+
    '</ItemIds>'+
    '</GetItem>'+
    '</soap:Body>'+
    '</soap:Envelope>';

    var request = require('request');

    var requestOptions= {
        method: 'POST',
        uri: ewsUrl,
        headers: {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'text/xml; charset=utf-8'
        },
        body:data
    };

    request(requestOptions , function (error, response, body) {

        if(response && response.statusCode == 200){
            try{
                console.log("lambda handler  -done");

                var phone = /#43;\d{11}/.exec(body)[0].replace('#43;','');
                var time = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.exec(body)[0];
                var duration = /Duration: (\d*) seconds/.exec(body)[1];

                context.done(null,{
                    phone:phone,
                    time: time,
                    duration: duration
                });

            }catch(exception){

                context.done(exception, null);
            }
        } else if(error){
            console.log("lambda handler - error = " + error);
            context.done(error, null);
        }

        else {
            console.log("lambda handler - "+ response.statusCode +" = " + body);
            context.done(response.statusCode + " error from exchange" , null);
        }
    }
);

//context.done("hello", null);


};
