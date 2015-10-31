var proxyquire =  require('proxyquire'),
assert     =  require('assert');


describe("Success Conditions", function() {
    beforeEach(function(){
        postData = {
            AuthToken: "TEST AUTH TOKEN",
            EwsUrl: "Https://mytestexchange.com",
            MailId : "1234abcd"
        };

        var mockResponse = '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:ServerVersionInfo MajorVersion="15" MinorVersion="1" MajorBuildNumber="312" MinorBuildNumber="20" Version="V2_69" xmlns:h="http://schemas.microsoft.com/exchange/services/2006/types" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><m:GetItemResponse xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"><m:ResponseMessages><m:GetItemResponseMessage ResponseClass="Success"><m:ResponseCode>NoError</m:ResponseCode><m:Items><t:Message><t:MimeContent CharacterSet="UTF-8">++"/><t:Subject>New voicemail from Crystal Jackson +13177158106 - 14 seconds</t:Subject><t:Sensitivity>Normal</t:Sensitivity><t:Body BodyType="HTML" IsTruncated="false">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;&lt;td width="100%" style="font-family: Helvetica, arial, sans-serif; font-size: 16px; color: #95a5a6; text-align:left;line-height: 24px; padding:4px;"&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Name: Crystal Jackson &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Phone: &lt;span class="appleLinks"&gt;&amp;#43;13177158106&lt;/span&gt; &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Time: &lt;span class="appleLinks" style="text-decoration: none"&gt;&#xD;2015-05-28T17:57:15.979&amp;#43;0000&lt;/span&gt; &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Duration: 14 seconds &lt;/p&gt;&#xD;&lt;/td&gt;&#xD;&lt;/tr&gt;&#xD;</t:Body><t:Attachments><t:FileAttachment><t:AttachmentId Id=""/><t:Name>PureCloud.png</t:Name><t:ContentType>image/png</t:ContentType><t:ContentId>voicemail-logo.png</t:ContentId><t:Size>2403</t:Size><t:LastModifiedTime>2015-05-28T17:57:24</t:LastModifiedTime><t:IsInline>true</t:IsInline><t:IsContactPhoto>false</t:IsContactPhoto></t:FileAttachment></t:Attachments><t:Size>33704</t:Size><t:DateTimeSent>2015-05-28T17:57:16Z</t:DateTimeSent><t:DateTimeCreated>2015-05-28T17:57:24Z</t:DateTimeCreated><t:ResponseObjects><t:ReplyToItem/><t:ReplyAllToItem/><t:ForwardItem/></t:ResponseObjects><t:HasAttachments>false</t:HasAttachments><t:IsAssociated>false</t:IsAssociated><t:ToRecipients><t:Mailbox><t:Name>Glinski, Kevin</t:Name><t:EmailAddress>Kevin.Glinski@inin.com</t:EmailAddress><t:RoutingType>SMTP</t:RoutingType><t:MailboxType>Mailbox</t:MailboxType></t:Mailbox></t:ToRecipients><t:IsReadReceiptRequested>false</t:IsReadReceiptRequested><t:From><t:Mailbox><t:Name>PureCloud Voicemail</t:Name><t:EmailAddress>voicemail-noreply@ininsca.com</t:EmailAddress><t:RoutingType>SMTP</t:RoutingType><t:MailboxType>OneOff</t:MailboxType></t:Mailbox></t:From><t:IsRead>true</t:IsRead></t:Message></m:Items></m:GetItemResponseMessage></m:ResponseMessages></m:GetItemResponse></s:Body></s:Envelope>';
        requestMock = function(options, cb) {
            expect(options.method).toEqual("POST");
            expect(options.uri).toEqual(postData.EwsUrl);
            expect(options.headers.Authorization.indexOf(postData.AuthToken)).not.toEqual(0);
            expect(options.headers['Content-Type']).toEqual('text/xml; charset=utf-8');

            expect(options.body.indexOf('Id="'+ postData.MailId +'"')).not.toEqual(0);
            return cb(null, {statusCode:200}, mockResponse);
        };

        target = proxyquire('../../src/lambda/lambda.js', { 'request': requestMock });

    });

    it("should return voicemail data", function() {

        var context = {
            done:function(error, data){
                expect(data).toEqual({ phone: '13177158106',
                time: '2015-05-28T17:57:15',
                duration: '14' });
            }
        };
        target.handler(postData,context);
    });
});


describe("Error Conditions", function() {
    beforeEach(function(){
        postData = {
            AuthToken: "TEST AUTH TOKEN",
            EwsUrl: "Https://mytestexchange.com",
            MailId : "1234abcd"
        };

        var mockResponse = '<?xml version="1.0" encoding="utf-8"?><s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"><s:Header><h:ServerVersionInfo MajorVersion="15" MinorVersion="1" MajorBuildNumber="312" MinorBuildNumber="20" Version="V2_69" xmlns:h="http://schemas.microsoft.com/exchange/services/2006/types" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><m:GetItemResponse xmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages" xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"><m:ResponseMessages><m:GetItemResponseMessage ResponseClass="Success"><m:ResponseCode>NoError</m:ResponseCode><m:Items><t:Message><t:MimeContent CharacterSet="UTF-8">++"/><t:Subject>New voicemail from Crystal Jackson +13177158106 - 14 seconds</t:Subject><t:Sensitivity>Normal</t:Sensitivity><t:Body BodyType="HTML" IsTruncated="false">&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt;&lt;td width="100%" style="font-family: Helvetica, arial, sans-serif; font-size: 16px; color: #95a5a6; text-align:left;line-height: 24px; padding:4px;"&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Name: Crystal Jackson &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Phone: &lt;span class="appleLinks"&gt;&amp;#43;13177158106&lt;/span&gt; &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Time: &lt;span class="appleLinks" style="text-decoration: none"&gt;&#xD;2015-05-28T17:57:15.979&amp;#43;0000&lt;/span&gt; &lt;/p&gt;&#xD;&lt;p style="margin: 0px 0px;"&gt;Duration: 14 seconds &lt;/p&gt;&#xD;&lt;/td&gt;&#xD;&lt;/tr&gt;&#xD;</t:Body><t:Attachments><t:FileAttachment><t:AttachmentId Id=""/><t:Name>PureCloud.png</t:Name><t:ContentType>image/png</t:ContentType><t:ContentId>voicemail-logo.png</t:ContentId><t:Size>2403</t:Size><t:LastModifiedTime>2015-05-28T17:57:24</t:LastModifiedTime><t:IsInline>true</t:IsInline><t:IsContactPhoto>false</t:IsContactPhoto></t:FileAttachment></t:Attachments><t:Size>33704</t:Size><t:DateTimeSent>2015-05-28T17:57:16Z</t:DateTimeSent><t:DateTimeCreated>2015-05-28T17:57:24Z</t:DateTimeCreated><t:ResponseObjects><t:ReplyToItem/><t:ReplyAllToItem/><t:ForwardItem/></t:ResponseObjects><t:HasAttachments>false</t:HasAttachments><t:IsAssociated>false</t:IsAssociated><t:ToRecipients><t:Mailbox><t:Name>Glinski, Kevin</t:Name><t:EmailAddress>Kevin.Glinski@inin.com</t:EmailAddress><t:RoutingType>SMTP</t:RoutingType><t:MailboxType>Mailbox</t:MailboxType></t:Mailbox></t:ToRecipients><t:IsReadReceiptRequested>false</t:IsReadReceiptRequested><t:From><t:Mailbox><t:Name>PureCloud Voicemail</t:Name><t:EmailAddress>voicemail-noreply@ininsca.com</t:EmailAddress><t:RoutingType>SMTP</t:RoutingType><t:MailboxType>OneOff</t:MailboxType></t:Mailbox></t:From><t:IsRead>true</t:IsRead></t:Message></m:Items></m:GetItemResponseMessage></m:ResponseMessages></m:GetItemResponse></s:Body></s:Envelope>';
        requestMock = function(options, cb) {
            return cb(null, {statusCode:200}, null);
        };

        target = proxyquire('../../src/lambda/lambda.js', { 'request': requestMock });


    });

    it("should handle a caught exception", function() {

        var context = {
            done:function(error, data){
                expect(data).toBeNull();
                expect(error).not.toBeNull();
            }
        };

        target.handler(postData,context);
    });

    it("should handle an invalid status response", function() {
        requestMock = function(options, cb) {
            return cb('error', {statusCode:500}, null);
        };

        target = proxyquire('../../src/lambda/lambda.js', { 'request': requestMock });

        var context = {
            done:function(error, data){
                expect(data).toBeNull();
                expect(error).not.toBeNull();
            }
        };

        target.handler(postData,context);
    });
});
