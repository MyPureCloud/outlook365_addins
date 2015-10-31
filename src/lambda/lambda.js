var request = require('request');

function getEmailBody(context, authToken, ewsUrl, mailId){
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
      } else {
        context.done(error, null);
      }
    }
  )

}

exports.handler = function(event, context) {
    getEmailBody(context, event.AuthToken, event.EwsUrl, event.MailId);
};
