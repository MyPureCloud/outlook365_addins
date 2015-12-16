/**
* @description PureCloud API
* @namespace PureCloud
**/
var PureCloud =  (function () {
    var _host = 'api.mypurecloud.com';
    var _auth_url = '';
    var _environment = "mypurecloud.com";

    var _token = null;
    var _state = null;
    var self = {};

    if(window.location.hash) {
        //Parse out the hash values of the URL to get the token
        var hash_array = location.hash.substring(1).split('&');
        var hash_key_val = new Array(hash_array.length);
        for (var i = 0; i < hash_array.length; i++) {
            hash_key_val[i] = hash_array[i].split('=');
        }

        hash_key_val.forEach(function (pair) {
            if (pair[0] == "access_token") {

                // Store token
                _token = pair[1];

                // Clear hash from URL
                location.hash = '';
            }

            if (pair[0] == "state") {
                // Store token
                _state = pair[1];
            }
        });
    }

    /**
	 * Gets the value of State that was passed into the .authorize method
     * @memberof PureCloud
     */
    self.getState = function(){
        return _state;
    };

    /**
	 * Initiates a redirect to authorize the client using oauth
     * @memberof PureCloud
     * @param  {string} clientId    The application's Client ID
	 * @param  {string} redirectUrl The redirect URL to return to after authentication. This must be an authorized URL for the client.
	 * @param  {string} state (Optional) State variable that is returned to the application after authentication.  This can be grabbed from the .getState() method.
     * @param  {string} environment (Optional) The environment that this is run in.  If set should be mypurecloud.com, mypurecloud.ie, mypurecloud.au, etc.
     * @example PureCloud.authorize('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'http://localhost:8085/examples/').done(function(){
         //this method will be called once we have a valid authorization token
         // if we don't have one a redirect to login will be called and then after redirecting back here,
         // the done method will be called.
     });
     *
     * @example PureCloud.authorize('XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX', 'http://localhost:8085/examples/', "State Value", "mypurecloud.ie");
     */
    self.authorize = function(clientId, redirectUrl, state, environment){
        var _doneCallback = function(){console.error("callback not set");};

        environment = environment || _environment;
        _host = 'api.'+ environment;

        var defer = {
            done: function(callback){
                _doneCallback = callback;
            }
        };

        var existingToken = null;

        if(window && window.localStorage){
            existingToken = window.localStorage.authtoken;
        }

        if(_token){
            existingToken = _token;
        }

        function authRedirect(){
            _auth_url = 'https://login.'+environment;

            var url = _auth_url + '/authorize' +
                '?response_type=token' +
                '&client_id=' + encodeURI(clientId) +
                '&redirect_uri=' + encodeURI(redirectUrl);

            if(state !== undefined && state !== null){
                url = url + '&state=' + state;
            }

            //console.debug(url);

            // Redirect to oauth url
            //console.debug('Initiating oauth process');
            window.location.replace(url);
        }

        if(existingToken && existingToken !== ''){
            _token = existingToken;
            sendRestRequest("GET", "https://" + _host + "/api/v1/users/me").done(function(){
                //has good auth token
                _token = existingToken;

                if(window && window.localStorage){
                    window.localStorage.authtoken = _token;
                }

                _doneCallback();

            }).error(function(){
                //don't have an auth token yet
                authRedirect();
            });
        }else{
            authRedirect();
        }

        return defer;
    };

    /**
     * Sets the authorization token, this is only needed if not using .authorize(...)
     * @memberof PureCloud
     * @param  {string} token Authorization token
     */
    self.setAuthToken = function(token){
        _token = token;
    };

    /**
     * Gets the authorization token
     * @memberof PureCloud
     */
    self.getAuthToken = function(){
        return _token;
    };

    /**
     * Returns if the authorization token is set
     * @memberof PureCloud
     */
    self.hasAuthorizationToken = function(){
        return _token !== null;
    };

    /**
     * Clears authorization token and logs out.
     * @memberof PureCloud
     */
    self.logout = function(){
        _token = null;

        if(window && window.localStorage){
            delete window.localStorage.authtoken;
        }

		window.location.replace(_auth_url + "/logout");
    };

    /**
    * The environment that this is run in.  If set should be mypurecloud.com, mypurecloud.ie, mypurecloud.au, etc.
    * @memberof PureCloud
    * @param  {string} environment PureCloud environment (mypurecloud.com, mypurecloud.ie, mypurecloud.au, etc)
    **/
    self.setEnvironment = function(environment){
        _environment = environment;
        _host = 'api.'+ environment;
        _auth_url = 'https://login.'+environment;

    };

    function sendRestRequest(method, url, body){
        var requestParams = {
             method: method,
             url: url,
             headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
             },
             beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'bearer ' + _token);},
             timeout: 2000
         };

         if(body){
             requestParams.data = JSON.stringify(body);
         }

         var request = $.ajax(requestParams);

         return request;
    }

    /**
     * Executes an authenticated GET to PureCloud.  Can be used with paging URIs to get a page that has a defined full url.
     * @memberof PureCloud
     * @param  {string} url The full or relative path URL to get
     * @example PureCloud.get("https://api.mypurecloud.com/api/v1/users/me");
     * @example PureCloud.get("/api/v1/users/me");
     */
    self.get = function(url){

        if(url[0] === '/'){
            url = 'https://'+ _host + url;
        }

        return sendRestRequest("GET", url);
    };

    /**
     * Executes an authenticated request to PureCloud
     * @memberof PureCloud
     * @param  {string} method The HTTP method (GET, POST, PUT, DELETE)
     * @param  {uri} path The relative uri path
     * @param  {JSON} body The body to send
     * @example PureCloud.makeRequest("GET", "/api/v1/users/me");
     */
    self.makeRequest = function(method,path,body){
        return sendRestRequest(method, 'https://'+ _host + path, body);
    };

	return self;
}());

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.analytics";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.analytics = (function (PureCloud) {
	/**
	* @namespace analytics/alerting/alerts
	**/
	/**
	* @namespace analytics/alerting/alerts/unread
	**/
	/**
	* @namespace analytics/alerting/rules
	**/
	/**
	* @namespace analytics/metrics/query
	**/
	/**
	* @namespace analytics/reporting/metadata
	**/
	/**
	* @namespace analytics/reporting/reportformats
	**/
	/**
	* @namespace analytics/reporting/schedules
	**/
	/**
	* @namespace analytics/reporting/schedules/history
	**/
	/**
	* @namespace analytics/reporting/schedules/history/latest
	**/
	/**
	* @namespace analytics/reporting/schedules/runreport
	**/
	/**
	* @namespace analytics/reporting/timeperiods
	**/
	/**
	* @namespace analytics/segments/query
	**/

	var self = {};
	self.alerting = self.alerting || {};
	self.alerting.alerts = self.alerting.alerts || {};

	/**
     * 
     * @method getAlerts
	 * @memberof analytics/alerting/alerts

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - title, startTime, endTime, description or unread

	* @param {string} sortOrder - ascending or descending
	 *
     */
     self.alerting.alerts.getAlerts = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/analytics/alerting/alerts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.alerts = self.alerting.alerts || {};
	self.alerting.alerts.unread = self.alerting.alerts.unread || {};

	/**
     * 
     * @method getUnreadAlertsCount
	 * @memberof analytics/alerting/alerts/unread
	 *
     */
     self.alerting.alerts.unread.getUnreadAlertsCount = function(){
		var path = '/api/v1/analytics/alerting/alerts/unread';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.alerts = self.alerting.alerts || {};

	/**
     * 
     * @method getAlert
	 * @memberof analytics/alerting/alerts

	* @param {string} alertId - Alert ID
	 *
     */
     self.alerting.alerts.getAlert = function(alertId){
		var path = '/api/v1/analytics/alerting/alerts/{alertId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{alertId}', alertId);

        if(alertId === undefined && alertId !== null){
			throw 'Missing required  parameter: alertId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.alerts = self.alerting.alerts || {};

	/**
     * 
     * @method updateAlert
	 * @memberof analytics/alerting/alerts

	* @param {string} alertId - Alert ID

	* @param {} body - Alert
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "title": "",
   "description": "",
   "unread": true,
   "entity": {
      "kind": "",
      "id": "",
      "name": ""
   },
   "metric": "",
   "metricThresholds": [],
   "metricValue": {},
   "startTime": "",
   "endTime": "",
   "mediaType": "",
   "statistic": "",
   "ruleUri": "",
   "selfUri": ""
}
	 *
     */
     self.alerting.alerts.updateAlert = function(alertId, body){
		var path = '/api/v1/analytics/alerting/alerts/{alertId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{alertId}', alertId);

        if(alertId === undefined && alertId !== null){
			throw 'Missing required  parameter: alertId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.alerts = self.alerting.alerts || {};

	/**
     * 
     * @method deleteAlert
	 * @memberof analytics/alerting/alerts

	* @param {string} alertId - Alert ID
	 *
     */
     self.alerting.alerts.deleteAlert = function(alertId){
		var path = '/api/v1/analytics/alerting/alerts/{alertId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{alertId}', alertId);

        if(alertId === undefined && alertId !== null){
			throw 'Missing required  parameter: alertId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.rules = self.alerting.rules || {};

	/**
     * 
     * @method getRules
	 * @memberof analytics/alerting/rules

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - title, description, inAlarm or enabled

	* @param {string} sortOrder - ascending or descending
	 *
     */
     self.alerting.rules.getRules = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/analytics/alerting/rules';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.rules = self.alerting.rules || {};

	/**
     * 
     * @method createAlertingRule
	 * @memberof analytics/alerting/rules

	* @param {} body - Rule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "title": "",
   "description": "",
   "enabled": true,
   "metric": "",
   "entity": {
      "kind": "",
      "id": "",
      "name": ""
   },
   "metricThresholds": [],
   "inAlarm": true,
   "occurrence": {
      "limit": 0,
      "type": ""
   },
   "mediaType": "",
   "statistic": "",
   "selfUri": ""
}
	 *
     */
     self.alerting.rules.createAlertingRule = function(body){
		var path = '/api/v1/analytics/alerting/rules';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.rules = self.alerting.rules || {};

	/**
     * 
     * @method getAlertingRule
	 * @memberof analytics/alerting/rules

	* @param {string} ruleId - Rule ID
	 *
     */
     self.alerting.rules.getAlertingRule = function(ruleId){
		var path = '/api/v1/analytics/alerting/rules/{ruleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleId}', ruleId);

        if(ruleId === undefined && ruleId !== null){
			throw 'Missing required  parameter: ruleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.rules = self.alerting.rules || {};

	/**
     * 
     * @method updateAlertingRule
	 * @memberof analytics/alerting/rules

	* @param {string} ruleId - Rule ID

	* @param {} body - Rule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "title": "",
   "description": "",
   "enabled": true,
   "metric": "",
   "entity": {
      "kind": "",
      "id": "",
      "name": ""
   },
   "metricThresholds": [],
   "inAlarm": true,
   "occurrence": {
      "limit": 0,
      "type": ""
   },
   "mediaType": "",
   "statistic": "",
   "selfUri": ""
}
	 *
     */
     self.alerting.rules.updateAlertingRule = function(ruleId, body){
		var path = '/api/v1/analytics/alerting/rules/{ruleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleId}', ruleId);

        if(ruleId === undefined && ruleId !== null){
			throw 'Missing required  parameter: ruleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.alerting = self.alerting || {};
	self.alerting.rules = self.alerting.rules || {};

	/**
     * 
     * @method deleteAlertingRule
	 * @memberof analytics/alerting/rules

	* @param {string} ruleId - Rule ID
	 *
     */
     self.alerting.rules.deleteAlertingRule = function(ruleId){
		var path = '/api/v1/analytics/alerting/rules/{ruleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleId}', ruleId);

        if(ruleId === undefined && ruleId !== null){
			throw 'Missing required  parameter: ruleId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.metrics = self.metrics || {};
	self.metrics.query = self.metrics.query || {};

	/**
     * 
     * @method sendQuery
	 * @memberof analytics/metrics/query

	* @param {} body - queryObject
	 *
     */
     self.metrics.query.sendQuery = function(body){
		var path = '/api/v1/analytics/metrics/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.metadata = self.reporting.metadata || {};

	/**
     * 
     * @method getReportingMetadata
	 * @memberof analytics/reporting/metadata

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} acceptLanguage - Accepted language

	* @param {string} locale - Locale
	 *
     */
     self.reporting.metadata.getReportingMetadata = function(pageNumber, pageSize, acceptLanguage, locale){
		var path = '/api/v1/analytics/reporting/metadata';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(locale !== undefined && locale !== null){
			queryParameters.locale = locale;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.reportformats = self.reporting.reportformats || {};

	/**
     * Get a list of report formats.
     * @method getReportFormats
	 * @memberof analytics/reporting/reportformats
	 *
     */
     self.reporting.reportformats.getReportFormats = function(){
		var path = '/api/v1/analytics/reporting/reportformats';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};

	/**
     * Get a list of scheduled report jobs.
     * @method getScheduledReportJobs
	 * @memberof analytics/reporting/schedules

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.reporting.schedules.getScheduledReportJobs = function(pageNumber, pageSize){
		var path = '/api/v1/analytics/reporting/schedules';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};

	/**
     * Create a scheduled report job.
     * @method createScheduledReportJob
	 * @memberof analytics/reporting/schedules

	* @param {} body - ReportSchedule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "quartzCronExpression": "",
   "nextFireTime": "",
   "dateCreated": "",
   "dateModified": "",
   "description": "",
   "timeZone": "",
   "timePeriod": "",
   "interval": {
      "end": "",
      "start": "",
      "chronology": {},
      "startMillis": 0,
      "endMillis": 0,
      "beforeNow": true,
      "afterNow": true
   },
   "reportFormat": "",
   "locale": "",
   "enabled": true,
   "reportId": "",
   "parameters": {},
   "lastRun": {
      "id": "",
      "name": "",
      "reportId": "",
      "runTime": "",
      "runStatus": "",
      "errorMessage": "",
      "runDurationMsec": 0,
      "reportUrl": "",
      "reportFormat": "",
      "scheduleUri": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.reporting.schedules.createScheduledReportJob = function(body){
		var path = '/api/v1/analytics/reporting/schedules';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};

	/**
     * 
     * @method getScheduledReportJob
	 * @memberof analytics/reporting/schedules

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.reporting.schedules.getScheduledReportJob = function(scheduleId){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};

	/**
     * 
     * @method updateScheduleReportJob
	 * @memberof analytics/reporting/schedules

	* @param {string} scheduleId - Schedule ID

	* @param {} body - ReportSchedule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "quartzCronExpression": "",
   "nextFireTime": "",
   "dateCreated": "",
   "dateModified": "",
   "description": "",
   "timeZone": "",
   "timePeriod": "",
   "interval": {
      "end": "",
      "start": "",
      "chronology": {},
      "startMillis": 0,
      "endMillis": 0,
      "beforeNow": true,
      "afterNow": true
   },
   "reportFormat": "",
   "locale": "",
   "enabled": true,
   "reportId": "",
   "parameters": {},
   "lastRun": {
      "id": "",
      "name": "",
      "reportId": "",
      "runTime": "",
      "runStatus": "",
      "errorMessage": "",
      "runDurationMsec": 0,
      "reportUrl": "",
      "reportFormat": "",
      "scheduleUri": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.reporting.schedules.updateScheduleReportJob = function(scheduleId, body){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};

	/**
     * 
     * @method deleteScheduledReportJob
	 * @memberof analytics/reporting/schedules

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.reporting.schedules.deleteScheduledReportJob = function(scheduleId){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};
	self.reporting.schedules.history = self.reporting.schedules.history || {};

	/**
     * 
     * @method getCompletedScheduledReportJobs
	 * @memberof analytics/reporting/schedules/history

	* @param {string} scheduleId - Schedule ID

	* @param {integer} pageNumber - 

	* @param {integer} pageSize - 
	 *
     */
     self.reporting.schedules.history.getCompletedScheduledReportJobs = function(scheduleId, pageNumber, pageSize){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}/history';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};
	self.reporting.schedules.history = self.reporting.schedules.history || {};
	self.reporting.schedules.history.latest = self.reporting.schedules.history.latest || {};

	/**
     * 
     * @method getLatestCompletedScheduledReportJob
	 * @memberof analytics/reporting/schedules/history/latest

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.reporting.schedules.history.latest.getLatestCompletedScheduledReportJob = function(scheduleId){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}/history/latest';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};
	self.reporting.schedules.history = self.reporting.schedules.history || {};

	/**
     * A completed scheduled report job.
     * @method getCompletedScheduledReportJob
	 * @memberof analytics/reporting/schedules/history

	* @param {string} runId - Run ID

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.reporting.schedules.history.getCompletedScheduledReportJob = function(runId, scheduleId){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}/history/{runId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{runId}', runId);

        if(runId === undefined && runId !== null){
			throw 'Missing required  parameter: runId';
        }

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.schedules = self.reporting.schedules || {};
	self.reporting.schedules.runreport = self.reporting.schedules.runreport || {};

	/**
     * 
     * @method addScheduledReportToReportingQueue
	 * @memberof analytics/reporting/schedules/runreport

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.reporting.schedules.runreport.addScheduledReportToReportingQueue = function(scheduleId){
		var path = '/api/v1/analytics/reporting/schedules/{scheduleId}/runreport';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleId}', scheduleId);

        if(scheduleId === undefined && scheduleId !== null){
			throw 'Missing required  parameter: scheduleId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.timeperiods = self.reporting.timeperiods || {};

	/**
     * 
     * @method getTimePeriodReports
	 * @memberof analytics/reporting/timeperiods
	 *
     */
     self.reporting.timeperiods.getTimePeriodReports = function(){
		var path = '/api/v1/analytics/reporting/timeperiods';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reporting = self.reporting || {};
	self.reporting.metadata = self.reporting.metadata || {};

	/**
     * 
     * @method getReportingMetadata
	 * @memberof analytics/reporting/metadata

	* @param {string} reportId - Report ID

	* @param {string} acceptLanguage - Accepted language

	* @param {string} locale - Locale
	 *
     */
     self.reporting.metadata.getReportingMetadata = function(reportId, acceptLanguage, locale){
		var path = '/api/v1/analytics/reporting/{reportId}/metadata';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{reportId}', reportId);

        if(reportId === undefined && reportId !== null){
			throw 'Missing required  parameter: reportId';
        }


		if(locale !== undefined && locale !== null){
			queryParameters.locale = locale;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.segments = self.segments || {};
	self.segments.query = self.segments.query || {};

	/**
     * 
     * @method sendSegmentsQuery
	 * @memberof analytics/segments/query

	* @param {} body - queryObject
	 *
     */
     self.segments.query.sendSegmentsQuery = function(body){
		var path = '/api/v1/analytics/segments/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.authorization";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.authorization = (function (PureCloud) {
	/**
	* @namespace authorization/licenses
	**/
	/**
	* @namespace authorization/permissions
	**/
	/**
	* @namespace authorization/roles
	**/
	/**
	* @namespace authorization/roles/default
	**/
	/**
	* @namespace authorization/roles/comparedefault
	**/
	/**
	* @namespace authorization/roles/users/add
	**/
	/**
	* @namespace authorization/roles/users/remove
	**/
	/**
	* @namespace authorization/users/roles
	**/

	var self = {};
	self.licenses = self.licenses || {};

	/**
     * 
     * @method getLicenses
	 * @memberof authorization/licenses

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.licenses.getLicenses = function(pageSize, pageNumber){
		var path = '/api/v1/authorization/licenses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.permissions = self.permissions || {};

	/**
     * Retrieve a list of all permission defined in the system.
     * @method getPermissions
	 * @memberof authorization/permissions

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.permissions.getPermissions = function(pageSize, pageNumber){
		var path = '/api/v1/authorization/permissions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * 
     * @method getRoles
	 * @memberof authorization/roles

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {array} permission - 

	* @param {boolean} userCount - 
	 *
     */
     self.roles.getRoles = function(pageSize, pageNumber, sortBy, expand, permission, userCount){
		var path = '/api/v1/authorization/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(permission !== undefined && permission !== null){
			queryParameters.permission = permission;
		}


		if(userCount !== undefined && userCount !== null){
			queryParameters.userCount = userCount;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * 
     * @method createOrganizationRole
	 * @memberof authorization/roles

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "defaultRoleId": "",
   "permissions": [],
   "licenses": [],
   "permissionPolicies": [],
   "code": "",
   "userCount": 0,
   "roleNeedsUpdate": true,
   "default": true,
   "selfUri": ""
}
	 *
     */
     self.roles.createOrganizationRole = function(body){
		var path = '/api/v1/authorization/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.default = self.roles.default || {};

	/**
     * This endpoint serves several purposes. 1. It provides the org with default roles. This is important for default roles that will be added after go-live (they can retroactively add the new default-role). Note: When not using a query param of force=true, it only adds the default roles not configured for the org; it does not overwrite roles. 2. Using the query param force=true, you can restore all default roles. Note: This does not have an effect on custom roles.
     * @method restoreAllDefaultRoles
	 * @memberof authorization/roles/default

	* @param {boolean} force - Restore default roles
	 *
     */
     self.roles.default.restoreAllDefaultRoles = function(force){
		var path = '/api/v1/authorization/roles/default';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(force !== undefined && force !== null){
			queryParameters.force = force;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.default = self.roles.default || {};

	/**
     * 
     * @method restoreDefaultRoles
	 * @memberof authorization/roles/default

	* @param {} body - 
	 *
     */
     self.roles.default.restoreDefaultRoles = function(body){
		var path = '/api/v1/authorization/roles/default';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.comparedefault = self.roles.comparedefault || {};

	/**
     * Compares any organization role to a default role id and show differences
     * @method getOrganizationRoleToDefaultRoleComparison
	 * @memberof authorization/roles/comparedefault

	* @param {string} leftRoleId - Left Role ID

	* @param {string} rightRoleId - Right Role id
	 *
     */
     self.roles.comparedefault.getOrganizationRoleToDefaultRoleComparison = function(leftRoleId, rightRoleId){
		var path = '/api/v1/authorization/roles/{leftRoleId}/comparedefault/{rightRoleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{leftRoleId}', leftRoleId);

        if(leftRoleId === undefined && leftRoleId !== null){
			throw 'Missing required  parameter: leftRoleId';
        }

        path = path.replace('{rightRoleId}', rightRoleId);

        if(rightRoleId === undefined && rightRoleId !== null){
			throw 'Missing required  parameter: rightRoleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.comparedefault = self.roles.comparedefault || {};

	/**
     * Allows users to compare their existing roles in an unsaved state to its default role
     * @method getAnExistingUnsavedRoleToDefaultRoleComparison
	 * @memberof authorization/roles/comparedefault

	* @param {string} leftRoleId - Left Role ID

	* @param {string} rightRoleId - Right Role id

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "defaultRoleId": "",
   "permissions": [],
   "licenses": [],
   "permissionPolicies": [],
   "code": "",
   "userCount": 0,
   "roleNeedsUpdate": true,
   "default": true,
   "selfUri": ""
}
	 *
     */
     self.roles.comparedefault.getAnExistingUnsavedRoleToDefaultRoleComparison = function(leftRoleId, rightRoleId, body){
		var path = '/api/v1/authorization/roles/{leftRoleId}/comparedefault/{rightRoleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{leftRoleId}', leftRoleId);

        if(leftRoleId === undefined && leftRoleId !== null){
			throw 'Missing required  parameter: leftRoleId';
        }

        path = path.replace('{rightRoleId}', rightRoleId);

        if(rightRoleId === undefined && rightRoleId !== null){
			throw 'Missing required  parameter: rightRoleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * Get the organization role specified by its ID.
     * @method getOrganizationRole
	 * @memberof authorization/roles

	* @param {string} roleId - Role ID
	 *
     */
     self.roles.getOrganizationRole = function(roleId){
		var path = '/api/v1/authorization/roles/{roleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * Update
     * @method updateOrganizationRole
	 * @memberof authorization/roles

	* @param {string} roleId - Role ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "defaultRoleId": "",
   "permissions": [],
   "licenses": [],
   "permissionPolicies": [],
   "code": "",
   "userCount": 0,
   "roleNeedsUpdate": true,
   "default": true,
   "selfUri": ""
}
	 *
     */
     self.roles.updateOrganizationRole = function(roleId, body){
		var path = '/api/v1/authorization/roles/{roleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * 
     * @method deleteOrganizationRole
	 * @memberof authorization/roles

	* @param {string} roleId - Role ID
	 *
     */
     self.roles.deleteOrganizationRole = function(roleId){
		var path = '/api/v1/authorization/roles/{roleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * Patch Organization Role for needsUpdate Field
     * @method patchOrganizationRole
	 * @memberof authorization/roles

	* @param {string} roleId - Role ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "defaultRoleId": "",
   "permissions": [],
   "licenses": [],
   "permissionPolicies": [],
   "code": "",
   "userCount": 0,
   "roleNeedsUpdate": true,
   "default": true,
   "selfUri": ""
}
	 *
     */
     self.roles.patchOrganizationRole = function(roleId, body){
		var path = '/api/v1/authorization/roles/{roleId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.users = self.roles.users || {};
	self.roles.users.add = self.roles.users.add || {};

	/**
     * 
     * @method setsTheUsersForTheRole
	 * @memberof authorization/roles/users/add

	* @param {string} roleId - Role ID

	* @param {} body - 
	 *
     */
     self.roles.users.add.setsTheUsersForTheRole = function(roleId, body){
		var path = '/api/v1/authorization/roles/{roleId}/users/add';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};
	self.roles.users = self.roles.users || {};
	self.roles.users.remove = self.roles.users.remove || {};

	/**
     * 
     * @method removesTheUsersFromTheRole
	 * @memberof authorization/roles/users/remove

	* @param {string} roleId - Role ID

	* @param {} body - 
	 *
     */
     self.roles.users.remove.removesTheUsersFromTheRole = function(roleId, body){
		var path = '/api/v1/authorization/roles/{roleId}/users/remove';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{roleId}', roleId);

        if(roleId === undefined && roleId !== null){
			throw 'Missing required  parameter: roleId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.users = self.users || {};
	self.users.roles = self.users.roles || {};

	/**
     * 
     * @method getUserAuthorizationInformation
	 * @memberof authorization/users/roles

	* @param {string} userId - User ID
	 *
     */
     self.users.roles.getUserAuthorizationInformation = function(userId){
		var path = '/api/v1/authorization/users/{userId}/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.users = self.users || {};
	self.users.roles = self.users.roles || {};

	/**
     * 
     * @method setUserRoles
	 * @memberof authorization/users/roles

	* @param {string} userId - User ID

	* @param {} body - 
	 *
     */
     self.users.roles.setUserRoles = function(userId, body){
		var path = '/api/v1/authorization/users/{userId}/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.users = self.users || {};
	self.users.roles = self.users.roles || {};

	/**
     * 
     * @method removeAllRoles
	 * @memberof authorization/users/roles

	* @param {string} userId - User ID
	 *
     */
     self.users.roles.removeAllRoles = function(userId){
		var path = '/api/v1/authorization/users/{userId}/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.configuration";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.configuration = (function (PureCloud) {
	/**
	* @namespace configuration/didpools
	**/
	/**
	* @namespace configuration/dids
	**/
	/**
	* @namespace configuration/edgegroups
	**/
	/**
	* @namespace configuration/edges
	**/
	/**
	* @namespace configuration/edges/certificateauthorities
	**/
	/**
	* @namespace configuration/edges/lines
	**/
	/**
	* @namespace configuration/edges/logicalinterfaces
	**/
	/**
	* @namespace configuration/edges/physicalinterfaces
	**/
	/**
	* @namespace configuration/edges/reboot
	**/
	/**
	* @namespace configuration/edges/softwareupdate
	**/
	/**
	* @namespace configuration/edges/softwareversions
	**/
	/**
	* @namespace configuration/edges/unpair
	**/
	/**
	* @namespace configuration/edgeversionreport
	**/
	/**
	* @namespace configuration/endpoints
	**/
	/**
	* @namespace configuration/extensionpools
	**/
	/**
	* @namespace configuration/extensions
	**/
	/**
	* @namespace configuration/organization
	**/
	/**
	* @namespace configuration/organizations
	**/
	/**
	* @namespace configuration/outboundroutes
	**/
	/**
	* @namespace configuration/recordingkeys
	**/
	/**
	* @namespace configuration/recordingkeys/rotationschedule
	**/
	/**
	* @namespace configuration/retentionpolicies
	**/
	/**
	* @namespace configuration/schemas/edges/vnext
	**/
	/**
	* @namespace configuration/sites
	**/
	/**
	* @namespace configuration/sites/numberplans
	**/
	/**
	* @namespace configuration/sites/numberplans/classifications
	**/
	/**
	* @namespace configuration/sites/rebalance
	**/
	/**
	* @namespace configuration/uservoicemailpolicies
	**/
	/**
	* @namespace configuration/voicemailpolicy
	**/

	var self = {};
	self.didpools = self.didpools || {};

	/**
     * 
     * @method getDidPools
	 * @memberof configuration/didpools

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by
	 *
     */
     self.didpools.getDidPools = function(pageSize, pageNumber, sortBy){
		var path = '/api/v1/configuration/didpools';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.didpools = self.didpools || {};

	/**
     * 
     * @method createDidPool
	 * @memberof configuration/didpools

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "startPhoneNumber": "",
   "endPhoneNumber": "",
   "comments": "",
   "provider": "",
   "selfUri": ""
}
	 *
     */
     self.didpools.createDidPool = function(body){
		var path = '/api/v1/configuration/didpools';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.didpools = self.didpools || {};

	/**
     * 
     * @method getADidPool
	 * @memberof configuration/didpools

	* @param {string} didPoolId - DID pool ID
	 *
     */
     self.didpools.getADidPool = function(didPoolId){
		var path = '/api/v1/configuration/didpools/{didPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{didPoolId}', didPoolId);

        if(didPoolId === undefined && didPoolId !== null){
			throw 'Missing required  parameter: didPoolId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.didpools = self.didpools || {};

	/**
     * 
     * @method updateADidPool
	 * @memberof configuration/didpools

	* @param {string} didPoolId - DID pool ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "startPhoneNumber": "",
   "endPhoneNumber": "",
   "comments": "",
   "provider": "",
   "selfUri": ""
}
	 *
     */
     self.didpools.updateADidPool = function(didPoolId, body){
		var path = '/api/v1/configuration/didpools/{didPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{didPoolId}', didPoolId);

        if(didPoolId === undefined && didPoolId !== null){
			throw 'Missing required  parameter: didPoolId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.didpools = self.didpools || {};

	/**
     * 
     * @method deleteADidPool
	 * @memberof configuration/didpools

	* @param {string} didPoolId - DID pool ID
	 *
     */
     self.didpools.deleteADidPool = function(didPoolId){
		var path = '/api/v1/configuration/didpools/{didPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{didPoolId}', didPoolId);

        if(didPoolId === undefined && didPoolId !== null){
			throw 'Missing required  parameter: didPoolId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dids = self.dids || {};

	/**
     * 
     * @method getDids
	 * @memberof configuration/dids

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {string} phoneNumber - Filter by phoneNumber
	 *
     */
     self.dids.getDids = function(pageSize, pageNumber, sortBy, sortOrder, phoneNumber){
		var path = '/api/v1/configuration/dids';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(phoneNumber !== undefined && phoneNumber !== null){
			queryParameters.phoneNumber = phoneNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dids = self.dids || {};

	/**
     * 
     * @method getADid
	 * @memberof configuration/dids

	* @param {string} didId - DID ID
	 *
     */
     self.dids.getADid = function(didId){
		var path = '/api/v1/configuration/dids/{didId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{didId}', didId);

        if(didId === undefined && didId !== null){
			throw 'Missing required  parameter: didId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dids = self.dids || {};

	/**
     * 
     * @method updateADid
	 * @memberof configuration/dids

	* @param {string} didId - DID ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "phoneNumber": "",
   "didPool": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "ownerType": "",
   "selfUri": ""
}
	 *
     */
     self.dids.updateADid = function(didId, body){
		var path = '/api/v1/configuration/dids/{didId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{didId}', didId);

        if(didId === undefined && didId !== null){
			throw 'Missing required  parameter: didId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgegroups = self.edgegroups || {};

	/**
     * 
     * @method getEdgeGroups
	 * @memberof configuration/edgegroups

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name

	* @param {string} sortBy - Sort by
	 *
     */
     self.edgegroups.getEdgeGroups = function(pageSize, pageNumber, name, sortBy){
		var path = '/api/v1/configuration/edgegroups';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgegroups = self.edgegroups || {};

	/**
     * 
     * @method createEdgeGroup
	 * @memberof configuration/edgegroups

	* @param {} body - EdgeGroup
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "selfUri": ""
}
	 *
     */
     self.edgegroups.createEdgeGroup = function(body){
		var path = '/api/v1/configuration/edgegroups';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgegroups = self.edgegroups || {};

	/**
     * 
     * @method getEdgeGroup
	 * @memberof configuration/edgegroups

	* @param {string} edgeGroupId - Edge group ID
	 *
     */
     self.edgegroups.getEdgeGroup = function(edgeGroupId){
		var path = '/api/v1/configuration/edgegroups/{edgeGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeGroupId}', edgeGroupId);

        if(edgeGroupId === undefined && edgeGroupId !== null){
			throw 'Missing required  parameter: edgeGroupId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgegroups = self.edgegroups || {};

	/**
     * 
     * @method updateEdgeGroup
	 * @memberof configuration/edgegroups

	* @param {string} edgeGroupId - Edge group ID

	* @param {} body - EdgeGroup
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "selfUri": ""
}
	 *
     */
     self.edgegroups.updateEdgeGroup = function(edgeGroupId, body){
		var path = '/api/v1/configuration/edgegroups/{edgeGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeGroupId}', edgeGroupId);

        if(edgeGroupId === undefined && edgeGroupId !== null){
			throw 'Missing required  parameter: edgeGroupId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgegroups = self.edgegroups || {};

	/**
     * 
     * @method deleteEdgeGroup
	 * @memberof configuration/edgegroups

	* @param {string} edgeGroupId - Edge group ID
	 *
     */
     self.edgegroups.deleteEdgeGroup = function(edgeGroupId){
		var path = '/api/v1/configuration/edgegroups/{edgeGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeGroupId}', edgeGroupId);

        if(edgeGroupId === undefined && edgeGroupId !== null){
			throw 'Missing required  parameter: edgeGroupId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};

	/**
     * 
     * @method getEdges
	 * @memberof configuration/edges

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name

	* @param {string} siteid - Filter by site.id

	* @param {string} edgeGroupid - Filter by edgeGroup.id

	* @param {string} sortBy - Sort by
	 *
     */
     self.edges.getEdges = function(pageSize, pageNumber, name, siteid, edgeGroupid, sortBy){
		var path = '/api/v1/configuration/edges';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(siteid !== undefined && siteid !== null){
			queryParameters.site.id = siteid;
		}


		if(edgeGroupid !== undefined && edgeGroupid !== null){
			queryParameters.edgeGroup.id = edgeGroupid;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};

	/**
     * 
     * @method createEdge
	 * @memberof configuration/edges

	* @param {} body - Edge
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "interfaces": [],
   "make": "",
   "model": "",
   "apiVersion": "",
   "softwareVersion": "",
   "softwareVersionTimestamp": "",
   "softwareVersionPlatform": "",
   "softwareVersionConfiguration": "",
   "fullSoftwareVersion": "",
   "pairingId": "",
   "fingerprint": "",
   "fingerprintHint": "",
   "currentVersion": "",
   "stagedVersion": "",
   "patch": "",
   "statusCode": "",
   "edgeGroup": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "selfUri": ""
   },
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "softwareStatus": {
      "version": {},
      "maxDownloadRate": 0,
      "downloadStartTime": "",
      "executeStartTime": "",
      "executeStopTime": "",
      "executeOnIdle": true,
      "status": "",
      "edgeUri": "",
      "current": true
   },
   "onlineStatus": "",
   "serialNumber": "",
   "physicalEdge": true,
   "selfUri": ""
}
	 *
     */
     self.edges.createEdge = function(body){
		var path = '/api/v1/configuration/edges';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.certificateauthorities = self.edges.certificateauthorities || {};

	/**
     * 
     * @method getCertificateAuthorities
	 * @memberof configuration/edges/certificateauthorities
	 *
     */
     self.edges.certificateauthorities.getCertificateAuthorities = function(){
		var path = '/api/v1/configuration/edges/certificateauthorities';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.certificateauthorities = self.edges.certificateauthorities || {};

	/**
     * 
     * @method createCertificateAuthority
	 * @memberof configuration/edges/certificateauthorities

	* @param {} body - CertificateAuthority
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "certificate": "",
   "type": "",
   "services": [],
   "certificateDetails": [],
   "selfUri": ""
}
	 *
     */
     self.edges.certificateauthorities.createCertificateAuthority = function(body){
		var path = '/api/v1/configuration/edges/certificateauthorities';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.certificateauthorities = self.edges.certificateauthorities || {};

	/**
     * 
     * @method getCertificateAuthority
	 * @memberof configuration/edges/certificateauthorities

	* @param {string} certificateId - Certificate ID
	 *
     */
     self.edges.certificateauthorities.getCertificateAuthority = function(certificateId){
		var path = '/api/v1/configuration/edges/certificateauthorities/{certificateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{certificateId}', certificateId);

        if(certificateId === undefined && certificateId !== null){
			throw 'Missing required  parameter: certificateId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.certificateauthorities = self.edges.certificateauthorities || {};

	/**
     * 
     * @method updateCertificateAuthority
	 * @memberof configuration/edges/certificateauthorities

	* @param {string} certificateId - Certificate ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "certificate": "",
   "type": "",
   "services": [],
   "certificateDetails": [],
   "selfUri": ""
}
	 *
     */
     self.edges.certificateauthorities.updateCertificateAuthority = function(certificateId, body){
		var path = '/api/v1/configuration/edges/certificateauthorities/{certificateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{certificateId}', certificateId);

        if(certificateId === undefined && certificateId !== null){
			throw 'Missing required  parameter: certificateId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.certificateauthorities = self.edges.certificateauthorities || {};

	/**
     * 
     * @method deleteCertificateAuthority
	 * @memberof configuration/edges/certificateauthorities

	* @param {string} certificateId - Certificate ID
	 *
     */
     self.edges.certificateauthorities.deleteCertificateAuthority = function(certificateId){
		var path = '/api/v1/configuration/edges/certificateauthorities/{certificateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{certificateId}', certificateId);

        if(certificateId === undefined && certificateId !== null){
			throw 'Missing required  parameter: certificateId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};

	/**
     * 
     * @method getEdge
	 * @memberof configuration/edges

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.getEdge = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};

	/**
     * 
     * @method updateEdge
	 * @memberof configuration/edges

	* @param {string} edgeId - Edge ID

	* @param {} body - Edge
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "interfaces": [],
   "make": "",
   "model": "",
   "apiVersion": "",
   "softwareVersion": "",
   "softwareVersionTimestamp": "",
   "softwareVersionPlatform": "",
   "softwareVersionConfiguration": "",
   "fullSoftwareVersion": "",
   "pairingId": "",
   "fingerprint": "",
   "fingerprintHint": "",
   "currentVersion": "",
   "stagedVersion": "",
   "patch": "",
   "statusCode": "",
   "edgeGroup": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "selfUri": ""
   },
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "softwareStatus": {
      "version": {},
      "maxDownloadRate": 0,
      "downloadStartTime": "",
      "executeStartTime": "",
      "executeStopTime": "",
      "executeOnIdle": true,
      "status": "",
      "edgeUri": "",
      "current": true
   },
   "onlineStatus": "",
   "serialNumber": "",
   "physicalEdge": true,
   "selfUri": ""
}
	 *
     */
     self.edges.updateEdge = function(edgeId, body){
		var path = '/api/v1/configuration/edges/{edgeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};

	/**
     * 
     * @method deleteEdge
	 * @memberof configuration/edges

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.deleteEdge = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.lines = self.edges.lines || {};

	/**
     * 
     * @method getLines
	 * @memberof configuration/edges/lines

	* @param {string} edgeId - Edge ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.edges.lines.getLines = function(edgeId, pageSize, pageNumber){
		var path = '/api/v1/configuration/edges/{edgeId}/lines';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.lines = self.edges.lines || {};

	/**
     * 
     * @method getLine
	 * @memberof configuration/edges/lines

	* @param {string} edgeId - Edge ID

	* @param {string} lineId - Line ID
	 *
     */
     self.edges.lines.getLine = function(edgeId, lineId){
		var path = '/api/v1/configuration/edges/{edgeId}/lines/{lineId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{lineId}', lineId);

        if(lineId === undefined && lineId !== null){
			throw 'Missing required  parameter: lineId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.lines = self.edges.lines || {};

	/**
     * 
     * @method updateLine
	 * @memberof configuration/edges/lines

	* @param {string} edgeId - Edge ID

	* @param {string} lineId - Line ID

	* @param {} body - Line
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "schema": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "properties": {},
   "edge": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "interfaces": [],
      "make": "",
      "model": "",
      "apiVersion": "",
      "softwareVersion": "",
      "softwareVersionTimestamp": "",
      "softwareVersionPlatform": "",
      "softwareVersionConfiguration": "",
      "fullSoftwareVersion": "",
      "pairingId": "",
      "fingerprint": "",
      "fingerprintHint": "",
      "currentVersion": "",
      "stagedVersion": "",
      "patch": "",
      "statusCode": "",
      "edgeGroup": {},
      "site": {},
      "softwareStatus": {},
      "onlineStatus": "",
      "serialNumber": "",
      "physicalEdge": true,
      "selfUri": ""
   },
   "edgeGroup": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "selfUri": ""
   },
   "lineType": "",
   "endpoint": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "count": 0,
      "properties": {},
      "schema": {},
      "enabled": true,
      "site": {},
      "dids": [],
      "selfUri": ""
   },
   "ipAddress": "",
   "logicalInterfaceId": "",
   "selfUri": ""
}
	 *
     */
     self.edges.lines.updateLine = function(edgeId, lineId, body){
		var path = '/api/v1/configuration/edges/{edgeId}/lines/{lineId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{lineId}', lineId);

        if(lineId === undefined && lineId !== null){
			throw 'Missing required  parameter: lineId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.logicalinterfaces = self.edges.logicalinterfaces || {};

	/**
     * Retrieve a list of all configured logical interfaces from a specific edge.
     * @method getEdgeLogicalInterfaces
	 * @memberof configuration/edges/logicalinterfaces

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.logicalinterfaces.getEdgeLogicalInterfaces = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/logicalinterfaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.logicalinterfaces = self.edges.logicalinterfaces || {};

	/**
     * Create
     * @method createEdgeLogicalInterface
	 * @memberof configuration/edges/logicalinterfaces

	* @param {string} edgeId - Edge ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "edgeUri": "",
   "edgeAssignedId": "",
   "friendlyName": "",
   "vlanTagId": 0,
   "hardwareAddress": "",
   "physicalAdapterId": "",
   "ipAddress": "",
   "gateway": "",
   "primaryDns": "",
   "secondaryDns": "",
   "ifStatus": "",
   "routes": [],
   "addresses": [],
   "ipv4Capabilities": {
      "enabled": true,
      "dhcp": true,
      "metric": 0
   },
   "ipv6Capabilities": {
      "enabled": true,
      "dhcp": true,
      "metric": 0
   },
   "currentState": "",
   "lastModifiedUserId": "",
   "lastModifiedCorrelationId": "",
   "commandResponses": [],
   "selfUri": ""
}
	 *
     */
     self.edges.logicalinterfaces.createEdgeLogicalInterface = function(edgeId, body){
		var path = '/api/v1/configuration/edges/{edgeId}/logicalinterfaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.logicalinterfaces = self.edges.logicalinterfaces || {};

	/**
     * 
     * @method getEdgeLogicalInterface
	 * @memberof configuration/edges/logicalinterfaces

	* @param {string} edgeId - Edge ID

	* @param {string} interfaceId - Interface ID
	 *
     */
     self.edges.logicalinterfaces.getEdgeLogicalInterface = function(edgeId, interfaceId){
		var path = '/api/v1/configuration/edges/{edgeId}/logicalinterfaces/{interfaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{interfaceId}', interfaceId);

        if(interfaceId === undefined && interfaceId !== null){
			throw 'Missing required  parameter: interfaceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.logicalinterfaces = self.edges.logicalinterfaces || {};

	/**
     * 
     * @method updateEdgeLogicalInterface
	 * @memberof configuration/edges/logicalinterfaces

	* @param {string} edgeId - Edge ID

	* @param {string} interfaceId - Interface ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "edgeUri": "",
   "edgeAssignedId": "",
   "friendlyName": "",
   "vlanTagId": 0,
   "hardwareAddress": "",
   "physicalAdapterId": "",
   "ipAddress": "",
   "gateway": "",
   "primaryDns": "",
   "secondaryDns": "",
   "ifStatus": "",
   "routes": [],
   "addresses": [],
   "ipv4Capabilities": {
      "enabled": true,
      "dhcp": true,
      "metric": 0
   },
   "ipv6Capabilities": {
      "enabled": true,
      "dhcp": true,
      "metric": 0
   },
   "currentState": "",
   "lastModifiedUserId": "",
   "lastModifiedCorrelationId": "",
   "commandResponses": [],
   "selfUri": ""
}
	 *
     */
     self.edges.logicalinterfaces.updateEdgeLogicalInterface = function(edgeId, interfaceId, body){
		var path = '/api/v1/configuration/edges/{edgeId}/logicalinterfaces/{interfaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{interfaceId}', interfaceId);

        if(interfaceId === undefined && interfaceId !== null){
			throw 'Missing required  parameter: interfaceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.logicalinterfaces = self.edges.logicalinterfaces || {};

	/**
     * 
     * @method deleteEdgeLogicalInterface
	 * @memberof configuration/edges/logicalinterfaces

	* @param {string} edgeId - Edge ID

	* @param {string} interfaceId - Interface ID
	 *
     */
     self.edges.logicalinterfaces.deleteEdgeLogicalInterface = function(edgeId, interfaceId){
		var path = '/api/v1/configuration/edges/{edgeId}/logicalinterfaces/{interfaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{interfaceId}', interfaceId);

        if(interfaceId === undefined && interfaceId !== null){
			throw 'Missing required  parameter: interfaceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.physicalinterfaces = self.edges.physicalinterfaces || {};

	/**
     * 
     * @method getEdgePhysicalInterfaces
	 * @memberof configuration/edges/physicalinterfaces

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.physicalinterfaces.getEdgePhysicalInterfaces = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/physicalinterfaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.physicalinterfaces = self.edges.physicalinterfaces || {};

	/**
     * Retrieve a physical interface from a specific edge.
     * @method getEdgePhysicalInterface
	 * @memberof configuration/edges/physicalinterfaces

	* @param {string} edgeId - Edge ID

	* @param {string} interfaceId - Interface ID
	 *
     */
     self.edges.physicalinterfaces.getEdgePhysicalInterface = function(edgeId, interfaceId){
		var path = '/api/v1/configuration/edges/{edgeId}/physicalinterfaces/{interfaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        path = path.replace('{interfaceId}', interfaceId);

        if(interfaceId === undefined && interfaceId !== null){
			throw 'Missing required  parameter: interfaceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.reboot = self.edges.reboot || {};

	/**
     * 
     * @method rebootEdge
	 * @memberof configuration/edges/reboot

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.reboot.rebootEdge = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/reboot';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.softwareupdate = self.edges.softwareupdate || {};

	/**
     * 
     * @method getEdgeSoftwareUpdate
	 * @memberof configuration/edges/softwareupdate

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.softwareupdate.getEdgeSoftwareUpdate = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/softwareupdate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.softwareupdate = self.edges.softwareupdate || {};

	/**
     * 
     * @method beginAnEdgeSoftwareUpdate
	 * @memberof configuration/edges/softwareupdate

	* @param {string} edgeId - Edge ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "version": {
      "id": "",
      "name": "",
      "edgeVersion": "",
      "publishDate": "",
      "edgeUri": "",
      "current": true,
      "latestRelease": true,
      "selfUri": ""
   },
   "maxDownloadRate": 0,
   "downloadStartTime": "",
   "executeStartTime": "",
   "executeStopTime": "",
   "executeOnIdle": true,
   "status": "",
   "edgeUri": "",
   "current": true
}
	 *
     */
     self.edges.softwareupdate.beginAnEdgeSoftwareUpdate = function(edgeId, body){
		var path = '/api/v1/configuration/edges/{edgeId}/softwareupdate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.softwareupdate = self.edges.softwareupdate || {};

	/**
     * 
     * @method cancelAnEdgeSoftwareUpdate
	 * @memberof configuration/edges/softwareupdate

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.softwareupdate.cancelAnEdgeSoftwareUpdate = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/softwareupdate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.softwareversions = self.edges.softwareversions || {};

	/**
     * 
     * @method getEdgeSoftwareVersions
	 * @memberof configuration/edges/softwareversions

	* @param {string} edgeId - Edge ID
	 *
     */
     self.edges.softwareversions.getEdgeSoftwareVersions = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/softwareversions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edges = self.edges || {};
	self.edges.unpair = self.edges.unpair || {};

	/**
     * 
     * @method unpairEdge
	 * @memberof configuration/edges/unpair

	* @param {string} edgeId - Edge Id
	 *
     */
     self.edges.unpair.unpairEdge = function(edgeId){
		var path = '/api/v1/configuration/edges/{edgeId}/unpair';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{edgeId}', edgeId);

        if(edgeId === undefined && edgeId !== null){
			throw 'Missing required  parameter: edgeId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.edgeversionreport = self.edgeversionreport || {};

	/**
     * The report will not have consistent data about the edge version(s) until all edges have been reset.
     * @method getEdgeVersionReport
	 * @memberof configuration/edgeversionreport
	 *
     */
     self.edgeversionreport.getEdgeVersionReport = function(){
		var path = '/api/v1/configuration/edgeversionreport';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.endpoints = self.endpoints || {};

	/**
     * 
     * @method getEndpoints
	 * @memberof configuration/endpoints

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name

	* @param {string} sortBy - Sort by
	 *
     */
     self.endpoints.getEndpoints = function(pageSize, pageNumber, name, sortBy){
		var path = '/api/v1/configuration/endpoints';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.endpoints = self.endpoints || {};

	/**
     * 
     * @method createEndpoint
	 * @memberof configuration/endpoints

	* @param {} body - EndpointTemplate
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "count": 0,
   "properties": {},
   "schema": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "enabled": true,
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "dids": [],
   "selfUri": ""
}
	 *
     */
     self.endpoints.createEndpoint = function(body){
		var path = '/api/v1/configuration/endpoints';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.endpoints = self.endpoints || {};

	/**
     * 
     * @method getEndpoint
	 * @memberof configuration/endpoints

	* @param {string} endpointId - Endpoint ID
	 *
     */
     self.endpoints.getEndpoint = function(endpointId){
		var path = '/api/v1/configuration/endpoints/{endpointId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{endpointId}', endpointId);

        if(endpointId === undefined && endpointId !== null){
			throw 'Missing required  parameter: endpointId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.endpoints = self.endpoints || {};

	/**
     * 
     * @method updateEndpoint
	 * @memberof configuration/endpoints

	* @param {string} endpointId - Endpoint ID

	* @param {} body - EndpointTemplate
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "count": 0,
   "properties": {},
   "schema": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "enabled": true,
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "dids": [],
   "selfUri": ""
}
	 *
     */
     self.endpoints.updateEndpoint = function(endpointId, body){
		var path = '/api/v1/configuration/endpoints/{endpointId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{endpointId}', endpointId);

        if(endpointId === undefined && endpointId !== null){
			throw 'Missing required  parameter: endpointId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.endpoints = self.endpoints || {};

	/**
     * 
     * @method deleteEndpoint
	 * @memberof configuration/endpoints

	* @param {string} endpointId - Endpoint ID
	 *
     */
     self.endpoints.deleteEndpoint = function(endpointId){
		var path = '/api/v1/configuration/endpoints/{endpointId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{endpointId}', endpointId);

        if(endpointId === undefined && endpointId !== null){
			throw 'Missing required  parameter: endpointId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensionpools = self.extensionpools || {};

	/**
     * 
     * @method getExtensionPools
	 * @memberof configuration/extensionpools

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} number - Number
	 *
     */
     self.extensionpools.getExtensionPools = function(pageSize, pageNumber, sortBy, number){
		var path = '/api/v1/configuration/extensionpools';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(number !== undefined && number !== null){
			queryParameters.number = number;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensionpools = self.extensionpools || {};

	/**
     * 
     * @method createAnExtensionPool
	 * @memberof configuration/extensionpools

	* @param {} body - ExtensionPool
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "startNumber": "",
   "endNumber": "",
   "selfUri": ""
}
	 *
     */
     self.extensionpools.createAnExtensionPool = function(body){
		var path = '/api/v1/configuration/extensionpools';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensionpools = self.extensionpools || {};

	/**
     * 
     * @method getAnExtensionPool
	 * @memberof configuration/extensionpools

	* @param {string} extensionPoolId - Extension pool ID
	 *
     */
     self.extensionpools.getAnExtensionPool = function(extensionPoolId){
		var path = '/api/v1/configuration/extensionpools/{extensionPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{extensionPoolId}', extensionPoolId);

        if(extensionPoolId === undefined && extensionPoolId !== null){
			throw 'Missing required  parameter: extensionPoolId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensionpools = self.extensionpools || {};

	/**
     * 
     * @method updateAnExtensionPool
	 * @memberof configuration/extensionpools

	* @param {string} extensionPoolId - Extension pool ID

	* @param {} body - ExtensionPool
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "startNumber": "",
   "endNumber": "",
   "selfUri": ""
}
	 *
     */
     self.extensionpools.updateAnExtensionPool = function(extensionPoolId, body){
		var path = '/api/v1/configuration/extensionpools/{extensionPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{extensionPoolId}', extensionPoolId);

        if(extensionPoolId === undefined && extensionPoolId !== null){
			throw 'Missing required  parameter: extensionPoolId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensionpools = self.extensionpools || {};

	/**
     * 
     * @method deleteAnExtensionPool
	 * @memberof configuration/extensionpools

	* @param {string} extensionPoolId - Extension pool ID
	 *
     */
     self.extensionpools.deleteAnExtensionPool = function(extensionPoolId){
		var path = '/api/v1/configuration/extensionpools/{extensionPoolId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{extensionPoolId}', extensionPoolId);

        if(extensionPoolId === undefined && extensionPoolId !== null){
			throw 'Missing required  parameter: extensionPoolId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensions = self.extensions || {};

	/**
     * 
     * @method getExtensions
	 * @memberof configuration/extensions

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {string} number - Filter by number
	 *
     */
     self.extensions.getExtensions = function(pageSize, pageNumber, sortBy, sortOrder, number){
		var path = '/api/v1/configuration/extensions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(number !== undefined && number !== null){
			queryParameters.number = number;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensions = self.extensions || {};

	/**
     * 
     * @method getAnExtension
	 * @memberof configuration/extensions

	* @param {string} extensionId - Extension ID
	 *
     */
     self.extensions.getAnExtension = function(extensionId){
		var path = '/api/v1/configuration/extensions/{extensionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{extensionId}', extensionId);

        if(extensionId === undefined && extensionId !== null){
			throw 'Missing required  parameter: extensionId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.extensions = self.extensions || {};

	/**
     * 
     * @method updateAnExtension
	 * @memberof configuration/extensions

	* @param {string} extensionId - Extension ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "number": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "extensionPool": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "ownerType": "",
   "selfUri": ""
}
	 *
     */
     self.extensions.updateAnExtension = function(extensionId, body){
		var path = '/api/v1/configuration/extensions/{extensionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{extensionId}', extensionId);

        if(extensionId === undefined && extensionId !== null){
			throw 'Missing required  parameter: extensionId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organization = self.organization || {};

	/**
     * 
     * @method getContextOrganization
	 * @memberof configuration/organization
	 *
     */
     self.organization.getContextOrganization = function(){
		var path = '/api/v1/configuration/organization';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organization = self.organization || {};

	/**
     * 
     * @method updateContextOrganization
	 * @memberof configuration/organization

	* @param {} body - Organization
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "thirdPartyOrgId": "",
   "thirdPartyOrgName": "",
   "thirdPartyURI": "",
   "adminUsername": "",
   "adminPassword": "",
   "domain": "",
   "version": 0,
   "state": "",
   "defaultSiteId": "",
   "deletable": true,
   "selfUri": ""
}
	 *
     */
     self.organization.updateContextOrganization = function(body){
		var path = '/api/v1/configuration/organization';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organizations = self.organizations || {};

	/**
     * 
     * @method createOrganization
	 * @memberof configuration/organizations

	* @param {} body - Organization
	 * @example
	 * Body Example:
	 * {
   "name": "",
   "adminUsername": "",
   "adminPassword": "",
   "domain": "",
   "thirdPartyOrgName": "",
   "deletable": true
}
	 *
     */
     self.organizations.createOrganization = function(body){
		var path = '/api/v1/configuration/organizations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organizations = self.organizations || {};

	/**
     * 
     * @method getOrganization
	 * @memberof configuration/organizations

	* @param {string} orgId - Organization ID
	 *
     */
     self.organizations.getOrganization = function(orgId){
		var path = '/api/v1/configuration/organizations/{orgId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{orgId}', orgId);

        if(orgId === undefined && orgId !== null){
			throw 'Missing required  parameter: orgId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organizations = self.organizations || {};

	/**
     * 
     * @method updateOrganization
	 * @memberof configuration/organizations

	* @param {string} orgId - Organization ID

	* @param {} body - Organization
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "thirdPartyOrgId": "",
   "thirdPartyOrgName": "",
   "thirdPartyURI": "",
   "adminUsername": "",
   "adminPassword": "",
   "domain": "",
   "version": 0,
   "state": "",
   "defaultSiteId": "",
   "deletable": true,
   "selfUri": ""
}
	 *
     */
     self.organizations.updateOrganization = function(orgId, body){
		var path = '/api/v1/configuration/organizations/{orgId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{orgId}', orgId);

        if(orgId === undefined && orgId !== null){
			throw 'Missing required  parameter: orgId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.organizations = self.organizations || {};

	/**
     * 
     * @method deleteOrganization
	 * @memberof configuration/organizations

	* @param {string} orgId - Organization ID
	 *
     */
     self.organizations.deleteOrganization = function(orgId){
		var path = '/api/v1/configuration/organizations/{orgId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{orgId}', orgId);

        if(orgId === undefined && orgId !== null){
			throw 'Missing required  parameter: orgId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outboundroutes = self.outboundroutes || {};

	/**
     * 
     * @method getOutboundRoutes
	 * @memberof configuration/outboundroutes

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name

	* @param {string} siteid - Filter by site.id

	* @param {string} sortBy - Sort by
	 *
     */
     self.outboundroutes.getOutboundRoutes = function(pageSize, pageNumber, name, siteid, sortBy){
		var path = '/api/v1/configuration/outboundroutes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(siteid !== undefined && siteid !== null){
			queryParameters.site.id = siteid;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outboundroutes = self.outboundroutes || {};

	/**
     * 
     * @method createOutboundRule
	 * @memberof configuration/outboundroutes

	* @param {} body - OutboundRoute
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "site": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "primarySites": [],
      "secondarySites": [],
      "primaryEdges": [],
      "secondaryEdges": [],
      "addresses": [],
      "edges": [],
      "edgeAutoUpdateConfig": {},
      "location": {},
      "selfUri": ""
   },
   "classificationTypes": [],
   "enabled": true,
   "endpoints": [],
   "distribution": "",
   "selfUri": ""
}
	 *
     */
     self.outboundroutes.createOutboundRule = function(body){
		var path = '/api/v1/configuration/outboundroutes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outboundroutes = self.outboundroutes || {};

	/**
     * 
     * @method getOutboundRoute
	 * @memberof configuration/outboundroutes

	* @param {string} outboundRouteId - Outbound route ID
	 *
     */
     self.outboundroutes.getOutboundRoute = function(outboundRouteId){
		var path = '/api/v1/configuration/outboundroutes/{outboundRouteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{outboundRouteId}', outboundRouteId);

        if(outboundRouteId === undefined && outboundRouteId !== null){
			throw 'Missing required  parameter: outboundRouteId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outboundroutes = self.outboundroutes || {};

	/**
     * 
     * @method updateOutboundRoute
	 * @memberof configuration/outboundroutes

	* @param {string} outboundRouteId - Outbound route ID

	* @param {} body - OutboundRoute
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "site": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "primarySites": [],
      "secondarySites": [],
      "primaryEdges": [],
      "secondaryEdges": [],
      "addresses": [],
      "edges": [],
      "edgeAutoUpdateConfig": {},
      "location": {},
      "selfUri": ""
   },
   "classificationTypes": [],
   "enabled": true,
   "endpoints": [],
   "distribution": "",
   "selfUri": ""
}
	 *
     */
     self.outboundroutes.updateOutboundRoute = function(outboundRouteId, body){
		var path = '/api/v1/configuration/outboundroutes/{outboundRouteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{outboundRouteId}', outboundRouteId);

        if(outboundRouteId === undefined && outboundRouteId !== null){
			throw 'Missing required  parameter: outboundRouteId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outboundroutes = self.outboundroutes || {};

	/**
     * 
     * @method deleteOutboundRoute
	 * @memberof configuration/outboundroutes

	* @param {string} outboundRouteId - Outbound route ID
	 *
     */
     self.outboundroutes.deleteOutboundRoute = function(outboundRouteId){
		var path = '/api/v1/configuration/outboundroutes/{outboundRouteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{outboundRouteId}', outboundRouteId);

        if(outboundRouteId === undefined && outboundRouteId !== null){
			throw 'Missing required  parameter: outboundRouteId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordingkeys = self.recordingkeys || {};

	/**
     * 
     * @method getEncryptionKeys
	 * @memberof configuration/recordingkeys

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.recordingkeys.getEncryptionKeys = function(pageSize, pageNumber){
		var path = '/api/v1/configuration/recordingkeys';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordingkeys = self.recordingkeys || {};

	/**
     * 
     * @method createEncryptionkey
	 * @memberof configuration/recordingkeys
	 *
     */
     self.recordingkeys.createEncryptionkey = function(){
		var path = '/api/v1/configuration/recordingkeys';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordingkeys = self.recordingkeys || {};
	self.recordingkeys.rotationschedule = self.recordingkeys.rotationschedule || {};

	/**
     * 
     * @method getKeyRotationSchedule
	 * @memberof configuration/recordingkeys/rotationschedule
	 *
     */
     self.recordingkeys.rotationschedule.getKeyRotationSchedule = function(){
		var path = '/api/v1/configuration/recordingkeys/rotationschedule';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordingkeys = self.recordingkeys || {};
	self.recordingkeys.rotationschedule = self.recordingkeys.rotationschedule || {};

	/**
     * 
     * @method updateKeyRotationSchedule
	 * @memberof configuration/recordingkeys/rotationschedule

	* @param {} body - KeyRotationSchedule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "period": "",
   "selfUri": ""
}
	 *
     */
     self.recordingkeys.rotationschedule.updateKeyRotationSchedule = function(body){
		var path = '/api/v1/configuration/recordingkeys/rotationschedule';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * for a less verbose response, add summary=true to this endpoint
     * @method getRetentionPolicies
	 * @memberof configuration/retentionpolicies

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} name - the policy name - used for filtering results in searches.

	* @param {boolean} enabled - checks to see if policy is enabled - use enabled = true or enabled = false

	* @param {boolean} summary - provides a less verbose response of policy lists.
	 *
     */
     self.retentionpolicies.getRetentionPolicies = function(pageSize, pageNumber, sortBy, expand, name, enabled, summary){
		var path = '/api/v1/configuration/retentionpolicies';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(enabled !== undefined && enabled !== null){
			queryParameters.enabled = enabled;
		}


		if(summary !== undefined && summary !== null){
			queryParameters.summary = summary;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * 
     * @method createRetentionPolicy
	 * @memberof configuration/retentionpolicies

	* @param {} body - Policy
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "modifiedDate": "",
   "createdDate": "",
   "order": 0,
   "description": "",
   "enabled": true,
   "conditions": {
      "forUsers": [],
      "directions": [],
      "dateRanges": [],
      "mediaTypes": [],
      "forQueues": [],
      "duration": {},
      "wrapupCodes": [],
      "timeAllowed": {}
   },
   "actions": {
      "retainRecording": true,
      "deleteRecording": true,
      "assignEvaluations": [],
      "assignMeteredEvaluations": [],
      "assignCalibrations": [],
      "retentionDuration": {}
   },
   "selfUri": ""
}
	 *
     */
     self.retentionpolicies.createRetentionPolicy = function(body){
		var path = '/api/v1/configuration/retentionpolicies';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * Bulk delete of Rules from specified rule set, this will only delete the rules that match the ids specified in the query param.
     * @method deletePolicies
	 * @memberof configuration/retentionpolicies

	* @param {string} ids - 
	 *
     */
     self.retentionpolicies.deletePolicies = function(ids){
		var path = '/api/v1/configuration/retentionpolicies';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(ids !== undefined && ids !== null){
			queryParameters.ids = ids;
		}

        if(ids === undefined && ids !== null){
			throw 'Missing required  parameter: ids';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * 
     * @method getPolicy
	 * @memberof configuration/retentionpolicies

	* @param {string} policyId - Policy ID
	 *
     */
     self.retentionpolicies.getPolicy = function(policyId){
		var path = '/api/v1/configuration/retentionpolicies/{policyId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{policyId}', policyId);

        if(policyId === undefined && policyId !== null){
			throw 'Missing required  parameter: policyId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * 
     * @method updatePolicy
	 * @memberof configuration/retentionpolicies

	* @param {string} policyId - Policy ID

	* @param {} body - Policy
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "modifiedDate": "",
   "createdDate": "",
   "order": 0,
   "description": "",
   "enabled": true,
   "conditions": {
      "forUsers": [],
      "directions": [],
      "dateRanges": [],
      "mediaTypes": [],
      "forQueues": [],
      "duration": {},
      "wrapupCodes": [],
      "timeAllowed": {}
   },
   "actions": {
      "retainRecording": true,
      "deleteRecording": true,
      "assignEvaluations": [],
      "assignMeteredEvaluations": [],
      "assignCalibrations": [],
      "retentionDuration": {}
   },
   "selfUri": ""
}
	 *
     */
     self.retentionpolicies.updatePolicy = function(policyId, body){
		var path = '/api/v1/configuration/retentionpolicies/{policyId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{policyId}', policyId);

        if(policyId === undefined && policyId !== null){
			throw 'Missing required  parameter: policyId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * 
     * @method deletePolicy
	 * @memberof configuration/retentionpolicies

	* @param {string} policyId - Policy ID
	 *
     */
     self.retentionpolicies.deletePolicy = function(policyId){
		var path = '/api/v1/configuration/retentionpolicies/{policyId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{policyId}', policyId);

        if(policyId === undefined && policyId !== null){
			throw 'Missing required  parameter: policyId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.retentionpolicies = self.retentionpolicies || {};

	/**
     * 
     * @method patchPolicy
	 * @memberof configuration/retentionpolicies

	* @param {string} policyId - Policy ID

	* @param {} body - Policy
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "modifiedDate": "",
   "createdDate": "",
   "order": 0,
   "description": "",
   "enabled": true,
   "conditions": {
      "forUsers": [],
      "directions": [],
      "dateRanges": [],
      "mediaTypes": [],
      "forQueues": [],
      "duration": {},
      "wrapupCodes": [],
      "timeAllowed": {}
   },
   "actions": {
      "retainRecording": true,
      "deleteRecording": true,
      "assignEvaluations": [],
      "assignMeteredEvaluations": [],
      "assignCalibrations": [],
      "retentionDuration": {}
   },
   "selfUri": ""
}
	 *
     */
     self.retentionpolicies.patchPolicy = function(policyId, body){
		var path = '/api/v1/configuration/retentionpolicies/{policyId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{policyId}', policyId);

        if(policyId === undefined && policyId !== null){
			throw 'Missing required  parameter: policyId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schemas = self.schemas || {};
	self.schemas.edges = self.schemas.edges || {};
	self.schemas.edges.vnext = self.schemas.edges.vnext || {};

	/**
     * 
     * @method listSchemas
	 * @memberof configuration/schemas/edges/vnext

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.schemas.edges.vnext.listSchemas = function(pageSize, pageNumber){
		var path = '/api/v1/configuration/schemas/edges/vnext';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schemas = self.schemas || {};
	self.schemas.edges = self.schemas.edges || {};
	self.schemas.edges.vnext = self.schemas.edges.vnext || {};

	/**
     * 
     * @method listSchemas
	 * @memberof configuration/schemas/edges/vnext

	* @param {string} schemaCategory - Schema category

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.schemas.edges.vnext.listSchemas = function(schemaCategory, pageSize, pageNumber){
		var path = '/api/v1/configuration/schemas/edges/vnext/{schemaCategory}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{schemaCategory}', schemaCategory);

        if(schemaCategory === undefined && schemaCategory !== null){
			throw 'Missing required  parameter: schemaCategory';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schemas = self.schemas || {};
	self.schemas.edges = self.schemas.edges || {};
	self.schemas.edges.vnext = self.schemas.edges.vnext || {};

	/**
     * 
     * @method listSchemas
	 * @memberof configuration/schemas/edges/vnext

	* @param {string} schemaCategory - Schema category

	* @param {string} schemaType - Schema type

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.schemas.edges.vnext.listSchemas = function(schemaCategory, schemaType, pageSize, pageNumber){
		var path = '/api/v1/configuration/schemas/edges/vnext/{schemaCategory}/{schemaType}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{schemaCategory}', schemaCategory);

        if(schemaCategory === undefined && schemaCategory !== null){
			throw 'Missing required  parameter: schemaCategory';
        }

        path = path.replace('{schemaType}', schemaType);

        if(schemaType === undefined && schemaType !== null){
			throw 'Missing required  parameter: schemaType';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schemas = self.schemas || {};
	self.schemas.edges = self.schemas.edges || {};
	self.schemas.edges.vnext = self.schemas.edges.vnext || {};

	/**
     * 
     * @method getSchema
	 * @memberof configuration/schemas/edges/vnext

	* @param {string} schemaCategory - Schema category

	* @param {string} schemaType - Schema type

	* @param {string} schemaId - Schema ID
	 *
     */
     self.schemas.edges.vnext.getSchema = function(schemaCategory, schemaType, schemaId){
		var path = '/api/v1/configuration/schemas/edges/vnext/{schemaCategory}/{schemaType}/{schemaId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{schemaCategory}', schemaCategory);

        if(schemaCategory === undefined && schemaCategory !== null){
			throw 'Missing required  parameter: schemaCategory';
        }

        path = path.replace('{schemaType}', schemaType);

        if(schemaType === undefined && schemaType !== null){
			throw 'Missing required  parameter: schemaType';
        }

        path = path.replace('{schemaId}', schemaId);

        if(schemaId === undefined && schemaId !== null){
			throw 'Missing required  parameter: schemaId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schemas = self.schemas || {};
	self.schemas.edges = self.schemas.edges || {};
	self.schemas.edges.vnext = self.schemas.edges.vnext || {};

	/**
     * 
     * @method getMetadata
	 * @memberof configuration/schemas/edges/vnext

	* @param {string} schemaCategory - Schema category

	* @param {string} schemaType - Schema type

	* @param {string} schemaId - Schema ID

	* @param {string} extension - extension

	* @param {string} metadataId - Metadata ID

	* @param {string} type - Type
	 *
     */
     self.schemas.edges.vnext.getMetadata = function(schemaCategory, schemaType, schemaId, extension, metadataId, type){
		var path = '/api/v1/configuration/schemas/edges/vnext/{schemaCategory}/{schemaType}/{schemaId}/{extension}/{metadataId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{schemaCategory}', schemaCategory);

        if(schemaCategory === undefined && schemaCategory !== null){
			throw 'Missing required  parameter: schemaCategory';
        }

        path = path.replace('{schemaType}', schemaType);

        if(schemaType === undefined && schemaType !== null){
			throw 'Missing required  parameter: schemaType';
        }

        path = path.replace('{schemaId}', schemaId);

        if(schemaId === undefined && schemaId !== null){
			throw 'Missing required  parameter: schemaId';
        }

        path = path.replace('{extension}', extension);

        if(extension === undefined && extension !== null){
			throw 'Missing required  parameter: extension';
        }

        path = path.replace('{metadataId}', metadataId);

        if(metadataId === undefined && metadataId !== null){
			throw 'Missing required  parameter: metadataId';
        }


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};

	/**
     * 
     * @method getSites
	 * @memberof configuration/sites

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {string} name - Name

	* @param {string} locationid - Location Id
	 *
     */
     self.sites.getSites = function(pageSize, pageNumber, sortBy, sortOrder, name, locationid){
		var path = '/api/v1/configuration/sites';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(locationid !== undefined && locationid !== null){
			queryParameters.location.id = locationid;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};

	/**
     * 
     * @method createSite
	 * @memberof configuration/sites

	* @param {} body - Site
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "primarySites": [],
   "secondarySites": [],
   "primaryEdges": [],
   "secondaryEdges": [],
   "addresses": [],
   "edges": [],
   "edgeAutoUpdateConfig": {
      "timeZone": "",
      "rrule": "",
      "start": {},
      "end": {}
   },
   "location": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.sites.createSite = function(body){
		var path = '/api/v1/configuration/sites';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};

	/**
     * 
     * @method getSite
	 * @memberof configuration/sites

	* @param {string} siteId - Site ID
	 *
     */
     self.sites.getSite = function(siteId){
		var path = '/api/v1/configuration/sites/{siteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};

	/**
     * 
     * @method updateSiteInstance
	 * @memberof configuration/sites

	* @param {string} siteId - Site ID

	* @param {} body - Site
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "primarySites": [],
   "secondarySites": [],
   "primaryEdges": [],
   "secondaryEdges": [],
   "addresses": [],
   "edges": [],
   "edgeAutoUpdateConfig": {
      "timeZone": "",
      "rrule": "",
      "start": {},
      "end": {}
   },
   "location": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.sites.updateSiteInstance = function(siteId, body){
		var path = '/api/v1/configuration/sites/{siteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};

	/**
     * 
     * @method deleteSite
	 * @memberof configuration/sites

	* @param {string} siteId - Site ID
	 *
     */
     self.sites.deleteSite = function(siteId){
		var path = '/api/v1/configuration/sites/{siteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};
	self.sites.numberplans = self.sites.numberplans || {};

	/**
     * 
     * @method getNumberPlans
	 * @memberof configuration/sites/numberplans

	* @param {string} siteId - Site ID
	 *
     */
     self.sites.numberplans.getNumberPlans = function(siteId){
		var path = '/api/v1/configuration/sites/{siteId}/numberplans';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};
	self.sites.numberplans = self.sites.numberplans || {};

	/**
     * 
     * @method updateNumberPlans
	 * @memberof configuration/sites/numberplans

	* @param {string} siteId - Site ID

	* @param {} body - 
	 *
     */
     self.sites.numberplans.updateNumberPlans = function(siteId, body){
		var path = '/api/v1/configuration/sites/{siteId}/numberplans';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};
	self.sites.numberplans = self.sites.numberplans || {};
	self.sites.numberplans.classifications = self.sites.numberplans.classifications || {};

	/**
     * 
     * @method getNumberPlanClassificationList
	 * @memberof configuration/sites/numberplans/classifications

	* @param {string} siteId - Site ID

	* @param {string} classification - Classification
	 *
     */
     self.sites.numberplans.classifications.getNumberPlanClassificationList = function(siteId, classification){
		var path = '/api/v1/configuration/sites/{siteId}/numberplans/classifications';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }


		if(classification !== undefined && classification !== null){
			queryParameters.classification = classification;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};
	self.sites.numberplans = self.sites.numberplans || {};

	/**
     * 
     * @method getANumberPlan
	 * @memberof configuration/sites/numberplans

	* @param {string} siteId - Site ID

	* @param {string} numberPlanId - Number Plan ID
	 *
     */
     self.sites.numberplans.getANumberPlan = function(siteId, numberPlanId){
		var path = '/api/v1/configuration/sites/{siteId}/numberplans/{numberPlanId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }

        path = path.replace('{numberPlanId}', numberPlanId);

        if(numberPlanId === undefined && numberPlanId !== null){
			throw 'Missing required  parameter: numberPlanId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sites = self.sites || {};
	self.sites.rebalance = self.sites.rebalance || {};

	/**
     * 
     * @method rebalanceSite
	 * @memberof configuration/sites/rebalance

	* @param {string} siteId - Site ID
	 *
     */
     self.sites.rebalance.rebalanceSite = function(siteId){
		var path = '/api/v1/configuration/sites/{siteId}/rebalance';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{siteId}', siteId);

        if(siteId === undefined && siteId !== null){
			throw 'Missing required  parameter: siteId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uservoicemailpolicies = self.uservoicemailpolicies || {};

	/**
     * 
     * @method getVoicemailuserpolicy
	 * @memberof configuration/uservoicemailpolicies

	* @param {string} userId - User ID
	 *
     */
     self.uservoicemailpolicies.getVoicemailuserpolicy = function(userId){
		var path = '/api/v1/configuration/uservoicemailpolicies/{userId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uservoicemailpolicies = self.uservoicemailpolicies || {};

	/**
     * 
     * @method updateVoicemailuserpolicy
	 * @memberof configuration/uservoicemailpolicies

	* @param {string} userId - User ID

	* @param {} body - The user's voicemail policy
	 * @example
	 * Body Example:
	 * {
   "enabled": true,
   "alertTimeoutSeconds": 0,
   "minimumRecordingTimeSeconds": 0,
   "maximumRecordingTimeSeconds": 0,
   "unavailableMessageUri": "",
   "namePromptMessageUri": "",
   "fullMessageUri": "",
   "pin": "",
   "quotaSizeBytes": 0,
   "createdDate": "",
   "modifiedDate": ""
}
	 *
     */
     self.uservoicemailpolicies.updateVoicemailuserpolicy = function(userId, body){
		var path = '/api/v1/configuration/uservoicemailpolicies/{userId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicemailpolicy = self.voicemailpolicy || {};

	/**
     * 
     * @method getPolicy
	 * @memberof configuration/voicemailpolicy
	 *
     */
     self.voicemailpolicy.getPolicy = function(){
		var path = '/api/v1/configuration/voicemailpolicy';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicemailpolicy = self.voicemailpolicy || {};

	/**
     * 
     * @method updatePolicy
	 * @memberof configuration/voicemailpolicy

	* @param {} body - Policy
	 * @example
	 * Body Example:
	 * {
   "enabled": true,
   "retentionTimeDays": 0,
   "alertTimeoutSeconds": 0,
   "minimumRecordingTimeSeconds": 0,
   "maximumRecordingTimeSeconds": 0,
   "unavailableMessageUri": "",
   "namePromptMessageUri": "",
   "fullMessageUri": "",
   "compressSilence": true,
   "pinConfiguration": {
      "minimumLength": 0,
      "maximumLength": 0
   },
   "quotaSizeBytes": 0,
   "createdDate": "",
   "modifiedDate": "",
   "voicemailExtension": "",
   "pinRequired": true
}
	 *
     */
     self.voicemailpolicy.updatePolicy = function(body){
		var path = '/api/v1/configuration/voicemailpolicy';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.contentmanagement";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.contentmanagement = (function (PureCloud) {
	/**
	* @namespace contentmanagement/auditquery
	**/
	/**
	* @namespace contentmanagement/documents
	**/
	/**
	* @namespace contentmanagement/documents/audits
	**/
	/**
	* @namespace contentmanagement/documents/content
	**/
	/**
	* @namespace contentmanagement/query
	**/
	/**
	* @namespace contentmanagement/securityprofiles
	**/
	/**
	* @namespace contentmanagement/shared
	**/
	/**
	* @namespace contentmanagement/shares
	**/
	/**
	* @namespace contentmanagement/status
	**/
	/**
	* @namespace contentmanagement/workspaces
	**/
	/**
	* @namespace contentmanagement/workspaces/members
	**/
	/**
	* @namespace contentmanagement/workspaces/tagvalues
	**/
	/**
	* @namespace contentmanagement/workspaces/tagvalues/query
	**/

	var self = {};
	self.auditquery = self.auditquery || {};

	/**
     * 
     * @method queryAudits
	 * @memberof contentmanagement/auditquery

	* @param {} body - Allows for a filtered query returning facet information
	 * @example
	 * Body Example:
	 * {
   "queryPhrase": "",
   "pageNumber": 0,
   "pageSize": 0,
   "facetNameRequests": [],
   "sort": [],
   "filters": []
}
	 *
     */
     self.auditquery.queryAudits = function(body){
		var path = '/api/v1/contentmanagement/auditquery';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method getDocuments
	 * @memberof contentmanagement/documents

	* @param {string} workspaceId - Workspace ID

	* @param {string} name - Name

	* @param {string} expand - Expand some document fields
	acl,
	workspace,

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - name or dateCreated

	* @param {string} sortOrder - ascending or descending
	 *
     */
     self.documents.getDocuments = function(workspaceId, name, expand, pageSize, pageNumber, sortBy, sortOrder){
		var path = '/api/v1/contentmanagement/documents';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(workspaceId !== undefined && workspaceId !== null){
			queryParameters.workspaceId = workspaceId;
		}

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method addDocument
	 * @memberof contentmanagement/documents

	* @param {} body - Document

	* @param {string} copySource - Copy a document within a workspace or to a new workspace. Provide a document ID as the copy source.

	* @param {string} moveSource - Move a document to a new workspace. Provide a document ID as the move source.

	* @param {boolean} override - Override any lock on the source document
	 * @example
	 * Body Example:
	 * {
   "name": "",
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "tags": [],
   "tagIds": [],
   "attributes": [],
   "attributeGroupInstances": []
}
	 *
     */
     self.documents.addDocument = function(body, copySource, moveSource, override){
		var path = '/api/v1/contentmanagement/documents';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(copySource !== undefined && copySource !== null){
			queryParameters.copySource = copySource;
		}


		if(moveSource !== undefined && moveSource !== null){
			queryParameters.moveSource = moveSource;
		}


		if(override !== undefined && override !== null){
			queryParameters.override = override;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method getDocument
	 * @memberof contentmanagement/documents

	* @param {string} documentId - Document ID

	* @param {string} expand - Expand some document fields
	lockInfo,
	acl,
	workspace,
	 *
     */
     self.documents.getDocument = function(documentId, expand){
		var path = '/api/v1/contentmanagement/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method updateDocument
	 * @memberof contentmanagement/documents

	* @param {string} documentId - Document ID

	* @param {} body - Document

	* @param {string} expand - Expand some document fields
	acl,

	* @param {boolean} override - Override any lock on the document
	 * @example
	 * Body Example:
	 * {
   "changeNumber": 0,
   "name": "",
   "read": true,
   "updateAttributes": [],
   "removeAttributes": [],
   "addTags": [],
   "removeTags": [],
   "addTagIds": [],
   "removeTagIds": [],
   "addAttributeGroupInstanceIds": [],
   "removeAttributeGroupInstanceIds": []
}
	 *
     */
     self.documents.updateDocument = function(documentId, body, expand, override){
		var path = '/api/v1/contentmanagement/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(override !== undefined && override !== null){
			queryParameters.override = override;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method deleteDocument
	 * @memberof contentmanagement/documents

	* @param {string} documentId - Document ID

	* @param {boolean} override - Override any lock on the document
	 *
     */
     self.documents.deleteDocument = function(documentId, override){
		var path = '/api/v1/contentmanagement/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }


		if(override !== undefined && override !== null){
			queryParameters.override = override;
		}



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};
	self.documents.audits = self.documents.audits || {};

	/**
     * 
     * @method getAudits
	 * @memberof contentmanagement/documents/audits

	* @param {string} documentId - Document ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} transactionFilter - Transaction filter

	* @param {string} level - level

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	 *
     */
     self.documents.audits.getAudits = function(documentId, pageSize, pageNumber, transactionFilter, level, sortBy, sortOrder){
		var path = '/api/v1/contentmanagement/documents/{documentId}/audits';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(transactionFilter !== undefined && transactionFilter !== null){
			queryParameters.transactionFilter = transactionFilter;
		}


		if(level !== undefined && level !== null){
			queryParameters.level = level;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};
	self.documents.content = self.documents.content || {};

	/**
     * 
     * @method downloadDocumentContent
	 * @memberof contentmanagement/documents/content

	* @param {string} documentId - Document ID

	* @param {string} disposition - Request how the content will be downloaded: attached as a file or inline. Default is attachment.
	attachment,
	inline,
	 *
     */
     self.documents.content.downloadDocumentContent = function(documentId, disposition){
		var path = '/api/v1/contentmanagement/documents/{documentId}/content';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }


		if(disposition !== undefined && disposition !== null){
			queryParameters.disposition = disposition;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};
	self.documents.content = self.documents.content || {};

	/**
     * 
     * @method replaceDocumentContent
	 * @memberof contentmanagement/documents/content

	* @param {string} documentId - Document ID

	* @param {} body - Replace Request

	* @param {boolean} override - Override any lock on the document
	 * @example
	 * Body Example:
	 * {
   "changeNumber": 0,
   "name": "",
   "authToken": ""
}
	 *
     */
     self.documents.content.replaceDocumentContent = function(documentId, body, override){
		var path = '/api/v1/contentmanagement/documents/{documentId}/content';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(override !== undefined && override !== null){
			queryParameters.override = override;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.query = self.query || {};

	/**
     * 
     * @method queryContent
	 * @memberof contentmanagement/query

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - name or dateCreated

	* @param {string} sortOrder - ascending or descending

	* @param {string} queryPhrase - Phrase tokens are ANDed together over all searchable fields

	* @param {string} expand - Expand some document fields
	acl,
	workspace,
	 *
     */
     self.query.queryContent = function(pageSize, pageNumber, sortBy, sortOrder, queryPhrase, expand){
		var path = '/api/v1/contentmanagement/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(queryPhrase !== undefined && queryPhrase !== null){
			queryParameters.queryPhrase = queryPhrase;
		}

        if(queryPhrase === undefined && queryPhrase !== null){
			throw 'Missing required  parameter: queryPhrase';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.query = self.query || {};

	/**
     * 
     * @method queryContent
	 * @memberof contentmanagement/query

	* @param {} body - Allows for a filtered query returning facet information

	* @param {string} expand - Expand some document fields
	acl,
	workspace,
	 * @example
	 * Body Example:
	 * {
   "queryPhrase": "",
   "pageNumber": 0,
   "pageSize": 0,
   "facetNameRequests": [],
   "sort": [],
   "filters": []
}
	 *
     */
     self.query.queryContent = function(body, expand){
		var path = '/api/v1/contentmanagement/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.securityprofiles = self.securityprofiles || {};

	/**
     * 
     * @method getSecurityProfiles
	 * @memberof contentmanagement/securityprofiles
	 *
     */
     self.securityprofiles.getSecurityProfiles = function(){
		var path = '/api/v1/contentmanagement/securityprofiles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.securityprofiles = self.securityprofiles || {};

	/**
     * 
     * @method getSecurityProfile
	 * @memberof contentmanagement/securityprofiles

	* @param {string} securityProfileId - Security Profile Id
	 *
     */
     self.securityprofiles.getSecurityProfile = function(securityProfileId){
		var path = '/api/v1/contentmanagement/securityprofiles/{securityProfileId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{securityProfileId}', securityProfileId);

        if(securityProfileId === undefined && securityProfileId !== null){
			throw 'Missing required  parameter: securityProfileId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.shared = self.shared || {};

	/**
     * This method requires the download sharing URI obtained in the get document response (downloadSharingUri). Documents may be shared between users in the same workspace. Documents may also be shared between any user by creating a content management share.
     * @method getSharedDocuments
	 * @memberof contentmanagement/shared

	* @param {string} sharedId - Shared ID

	* @param {boolean} redirect - Turn on or off redirect

	* @param {string} disposition - Request how the share content will be downloaded: attached as a file or inline. Default is attachment.
	attachment,
	inline,
	none,

	* @param {string} expand - Expand some document fields
	document.acl,
	 *
     */
     self.shared.getSharedDocuments = function(sharedId, redirect, disposition, expand){
		var path = '/api/v1/contentmanagement/shared/{sharedId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sharedId}', sharedId);

        if(sharedId === undefined && sharedId !== null){
			throw 'Missing required  parameter: sharedId';
        }


		if(redirect !== undefined && redirect !== null){
			queryParameters.redirect = redirect;
		}


		if(disposition !== undefined && disposition !== null){
			queryParameters.disposition = disposition;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.shares = self.shares || {};

	/**
     * Failing to specify a filter will return 400.
     * @method getAListOfShares
	 * @memberof contentmanagement/shares

	* @param {string} entityId - Filters the shares returned to only the entity specified by the value of this parameter.

	* @param {string} expand - Expand share fields
	member,

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.shares.getAListOfShares = function(entityId, expand, pageSize, pageNumber){
		var path = '/api/v1/contentmanagement/shares';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(entityId !== undefined && entityId !== null){
			queryParameters.entityId = entityId;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.shares = self.shares || {};

	/**
     * 
     * @method createAShare
	 * @memberof contentmanagement/shares

	* @param {} body - CreateShareRequest - entity id and type and a single member or list of members are required
	 * @example
	 * Body Example:
	 * {
   "sharedEntityType": "",
   "sharedEntity": {
      "kind": "",
      "id": "",
      "name": ""
   },
   "memberType": "",
   "member": {
      "kind": "",
      "id": "",
      "name": ""
   },
   "members": []
}
	 *
     */
     self.shares.createAShare = function(body){
		var path = '/api/v1/contentmanagement/shares';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.shares = self.shares || {};

	/**
     * 
     * @method getAShare
	 * @memberof contentmanagement/shares

	* @param {string} shareId - Share ID

	* @param {string} expand - Expand share fields
	member,
	 *
     */
     self.shares.getAShare = function(shareId, expand){
		var path = '/api/v1/contentmanagement/shares/{shareId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{shareId}', shareId);

        if(shareId === undefined && shareId !== null){
			throw 'Missing required  parameter: shareId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.shares = self.shares || {};

	/**
     * This revokes sharing rights specified in the share record
     * @method deleteAShare
	 * @memberof contentmanagement/shares

	* @param {string} shareId - Share ID
	 *
     */
     self.shares.deleteAShare = function(shareId){
		var path = '/api/v1/contentmanagement/shares/{shareId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{shareId}', shareId);

        if(shareId === undefined && shareId !== null){
			throw 'Missing required  parameter: shareId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.status = self.status || {};

	/**
     * 
     * @method getStatuses
	 * @memberof contentmanagement/status

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.status.getStatuses = function(pageSize, pageNumber){
		var path = '/api/v1/contentmanagement/status';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.status = self.status || {};

	/**
     * 
     * @method getStatus
	 * @memberof contentmanagement/status

	* @param {string} statusId - Status ID
	 *
     */
     self.status.getStatus = function(statusId){
		var path = '/api/v1/contentmanagement/status/{statusId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{statusId}', statusId);

        if(statusId === undefined && statusId !== null){
			throw 'Missing required  parameter: statusId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.status = self.status || {};

	/**
     * 
     * @method cancelStatusCommand
	 * @memberof contentmanagement/status

	* @param {string} statusId - Status ID
	 *
     */
     self.status.cancelStatusCommand = function(statusId){
		var path = '/api/v1/contentmanagement/status/{statusId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{statusId}', statusId);

        if(statusId === undefined && statusId !== null){
			throw 'Missing required  parameter: statusId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};

	/**
     * Specifying 'content' access will return all workspaces the user has document access to, while 'admin' access will return all group workspaces the user has administrative rights to.
     * @method getWorkspaces
	 * @memberof contentmanagement/workspaces

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} access - Requested access level
	content,
	admin,
	document:create,
	document:viewContent,
	document:viewMetadata,
	document:download,
	document:delete,
	document:update,
	document:share,
	document:shareView,
	document:email,
	document:print,
	document:auditView,
	document:replace,
	document:tag,
	tag:create,
	tag:view,
	tag:update,
	tag:apply,
	tag:remove,
	tag:delete,

	* @param {string} expand - Expand some workspace fields
	summary,
	acl,
	 *
     */
     self.workspaces.getWorkspaces = function(pageSize, pageNumber, access, expand){
		var path = '/api/v1/contentmanagement/workspaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(access !== undefined && access !== null){
			queryParameters.access = access;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};

	/**
     * 
     * @method createGroupWorkspace
	 * @memberof contentmanagement/workspaces

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "name": "",
   "bucket": ""
}
	 *
     */
     self.workspaces.createGroupWorkspace = function(body){
		var path = '/api/v1/contentmanagement/workspaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};

	/**
     * 
     * @method getWorkspace
	 * @memberof contentmanagement/workspaces

	* @param {string} workspaceId - Workspace ID

	* @param {string} expand - Expand some workspace fields
	summary,
	acl,
	 *
     */
     self.workspaces.getWorkspace = function(workspaceId, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};

	/**
     * 
     * @method updateWorkspace
	 * @memberof contentmanagement/workspaces

	* @param {string} workspaceId - Workspace ID

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "isCurrentUserWorkspace": true,
   "user": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "bucket": "",
   "dateCreated": "",
   "dateModified": "",
   "summary": {
      "totalDocumentCount": 0
   },
   "acl": [],
   "selfUri": ""
}
	 *
     */
     self.workspaces.updateWorkspace = function(workspaceId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};

	/**
     * 
     * @method deleteWorkspace
	 * @memberof contentmanagement/workspaces

	* @param {string} workspaceId - Workspace ID

	* @param {string} moveChildrenToWorkspaceId - New location for objects in deleted workspace.
	 *
     */
     self.workspaces.deleteWorkspace = function(workspaceId, moveChildrenToWorkspaceId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }


		if(moveChildrenToWorkspaceId !== undefined && moveChildrenToWorkspaceId !== null){
			queryParameters.moveChildrenToWorkspaceId = moveChildrenToWorkspaceId;
		}



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.members = self.workspaces.members || {};

	/**
     * 
     * @method getWorkspaceMembers
	 * @memberof contentmanagement/workspaces/members

	* @param {string} workspaceId - Workspace ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand workspace member fields
	member,
	 *
     */
     self.workspaces.members.getWorkspaceMembers = function(workspaceId, pageSize, pageNumber, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/members';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.members = self.workspaces.members || {};

	/**
     * 
     * @method getWorkspaceMember
	 * @memberof contentmanagement/workspaces/members

	* @param {string} workspaceId - Workspace ID

	* @param {string} memberId - Member ID

	* @param {string} expand - Expand workspace member fields
	member,
	 *
     */
     self.workspaces.members.getWorkspaceMember = function(workspaceId, memberId, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/members/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.members = self.workspaces.members || {};

	/**
     * 
     * @method addWorkspaceMember
	 * @memberof contentmanagement/workspaces/members

	* @param {string} workspaceId - Workspace ID

	* @param {string} memberId - Member ID

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "memberType": "",
   "member": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "group": {
      "id": "",
      "name": "",
      "description": "",
      "memberCount": 0,
      "groupType": "",
      "groupImages": {},
      "groupState": "",
      "selfUri": ""
   },
   "securityProfile": {
      "id": "",
      "name": "",
      "permissions": [],
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.workspaces.members.addWorkspaceMember = function(workspaceId, memberId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/members/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.members = self.workspaces.members || {};

	/**
     * 
     * @method deleteWorkspaceMember
	 * @memberof contentmanagement/workspaces/members

	* @param {string} workspaceId - Workspace ID

	* @param {string} memberId - Member ID
	 *
     */
     self.workspaces.members.deleteWorkspaceMember = function(workspaceId, memberId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/members/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};

	/**
     * 
     * @method getWorkspaceTags
	 * @memberof contentmanagement/workspaces/tagvalues

	* @param {string} workspaceId - Workspace ID

	* @param {string} value - filter the list of tags returned

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand some document fields
	acl,
	 *
     */
     self.workspaces.tagvalues.getWorkspaceTags = function(workspaceId, value, pageSize, pageNumber, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }


		if(value !== undefined && value !== null){
			queryParameters.value = value;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};

	/**
     * 
     * @method createWorkspaceTag
	 * @memberof contentmanagement/workspaces/tagvalues

	* @param {string} workspaceId - Workspace ID

	* @param {} body - tag
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "inUse": true,
   "acl": [],
   "selfUri": ""
}
	 *
     */
     self.workspaces.tagvalues.createWorkspaceTag = function(workspaceId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};
	self.workspaces.tagvalues.query = self.workspaces.tagvalues.query || {};

	/**
     * 
     * @method queryWorkspaceTags
	 * @memberof contentmanagement/workspaces/tagvalues/query

	* @param {string} workspaceId - Workspace ID

	* @param {} body - query

	* @param {string} expand - Expand some document fields
	acl,
	 * @example
	 * Body Example:
	 * {
   "query": "",
   "pageNumber": 0,
   "pageSize": 0
}
	 *
     */
     self.workspaces.tagvalues.query.queryWorkspaceTags = function(workspaceId, body, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};

	/**
     * 
     * @method getWorkspaceTag
	 * @memberof contentmanagement/workspaces/tagvalues

	* @param {string} workspaceId - Workspace ID

	* @param {string} tagId - Tag ID

	* @param {string} expand - Expand some document fields
	acl,
	 *
     */
     self.workspaces.tagvalues.getWorkspaceTag = function(workspaceId, tagId, expand){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues/{tagId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{tagId}', tagId);

        if(tagId === undefined && tagId !== null){
			throw 'Missing required  parameter: tagId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};

	/**
     * 
     * @method updateWorkspaceTag
	 * @memberof contentmanagement/workspaces/tagvalues

	* @param {string} workspaceId - Workspace ID

	* @param {string} tagId - Tag ID

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "inUse": true,
   "acl": [],
   "selfUri": ""
}
	 *
     */
     self.workspaces.tagvalues.updateWorkspaceTag = function(workspaceId, tagId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues/{tagId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{tagId}', tagId);

        if(tagId === undefined && tagId !== null){
			throw 'Missing required  parameter: tagId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.tagvalues = self.workspaces.tagvalues || {};

	/**
     * Delete a tag from a workspace. Will remove this tag from all documents.
     * @method deleteWorkspaceTag
	 * @memberof contentmanagement/workspaces/tagvalues

	* @param {string} workspaceId - Workspace ID

	* @param {string} tagId - Tag ID
	 *
     */
     self.workspaces.tagvalues.deleteWorkspaceTag = function(workspaceId, tagId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/tagvalues/{tagId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{tagId}', tagId);

        if(tagId === undefined && tagId !== null){
			throw 'Missing required  parameter: tagId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.conversations";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.conversations = (function (PureCloud) {
	/**
	* @namespace conversations
	**/
	/**
	* @namespace conversations/maximumconferenceparties
	**/
	/**
	* @namespace conversations/query
	**/
	/**
	* @namespace conversations/messages
	**/
	/**
	* @namespace conversations/messages/draft
	**/
	/**
	* @namespace conversations/participants
	**/
	/**
	* @namespace conversations/participants/attributes
	**/
	/**
	* @namespace conversations/participants/consult
	**/
	/**
	* @namespace conversations/participants/monitor
	**/
	/**
	* @namespace conversations/participants/replace
	**/
	/**
	* @namespace conversations/participants/wrapup
	**/
	/**
	* @namespace conversations/participants/wrapupcodes
	**/
	/**
	* @namespace conversations/recordings
	**/
	/**
	* @namespace conversations/recordings/annotations
	**/
	/**
	* @namespace conversations/tags
	**/
	/**
	* @namespace conversations/wrapupcodes
	**/

	var self = {};

	/**
     * 
     * @method getConversations
	 * @memberof conversations

	* @param {string} communicationType - Call or Chat communication filtering
	 *
     */
     self.getConversations = function(communicationType){
		var path = '/api/v1/conversations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(communicationType !== undefined && communicationType !== null){
			queryParameters.communicationType = communicationType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createConversation
	 * @memberof conversations

	* @param {string} call - Phone number to call

	* @param {string} callFrom - Queue id to place the call from

	* @param {string} callQueueId - Queue id to call

	* @param {string} callUserId - User id to call (this will call the default number)

	* @param {integer} priority - Priority level to use for routing when calling a queue

	* @param {string} languageId - Language id to use for routing when calling a queue

	* @param {array} skillIds - Skill ids to use for routing when calling a queue

	* @param {} body - 
	 *
     */
     self.createConversation = function(call, callFrom, callQueueId, callUserId, priority, languageId, skillIds, body){
		var path = '/api/v1/conversations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(call !== undefined && call !== null){
			queryParameters.call = call;
		}


		if(callFrom !== undefined && callFrom !== null){
			queryParameters.callFrom = callFrom;
		}


		if(callQueueId !== undefined && callQueueId !== null){
			queryParameters.callQueueId = callQueueId;
		}


		if(callUserId !== undefined && callUserId !== null){
			queryParameters.callUserId = callUserId;
		}


		if(priority !== undefined && priority !== null){
			queryParameters.priority = priority;
		}


		if(languageId !== undefined && languageId !== null){
			queryParameters.languageId = languageId;
		}


		if(skillIds !== undefined && skillIds !== null){
			queryParameters.skillIds = skillIds;
		}

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.maximumconferenceparties = self.maximumconferenceparties || {};

	/**
     * 
     * @method getMaximumParticipants
	 * @memberof conversations/maximumconferenceparties
	 *
     */
     self.maximumconferenceparties.getMaximumParticipants = function(){
		var path = '/api/v1/conversations/maximumconferenceparties';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.query = self.query || {};

	/**
     * 
     * @method queryHistoricalConversations
	 * @memberof conversations/query

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "pageSize": 0,
   "maximum": 0,
   "filters": [],
   "facets": []
}
	 *
     */
     self.query.queryHistoricalConversations = function(body){
		var path = '/api/v1/conversations/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.query = self.query || {};

	/**
     * 
     * @method queryHistoricalConversations
	 * @memberof conversations/query

	* @param {string} anchor - Anchor

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "pageSize": 0,
   "maximum": 0,
   "filters": [],
   "facets": []
}
	 *
     */
     self.query.queryHistoricalConversations = function(anchor, body){
		var path = '/api/v1/conversations/query/{anchor}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{anchor}', anchor);

        if(anchor === undefined && anchor !== null){
			throw 'Missing required  parameter: anchor';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getConversation
	 * @memberof conversations

	* @param {string} conversationId - conversation ID
	 *
     */
     self.getConversation = function(conversationId){
		var path = '/api/v1/conversations/{conversationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateConversation
	 * @memberof conversations

	* @param {string} conversationId - conversation ID

	* @param {} body - Conversation
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "startTime": "",
   "endTime": "",
   "participants": [],
   "conversationIds": [],
   "maxParticipants": 0,
   "recordingState": "",
   "selfUri": ""
}
	 *
     */
     self.updateConversation = function(conversationId, body){
		var path = '/api/v1/conversations/{conversationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method getConversationMessages
	 * @memberof conversations/messages

	* @param {string} conversationId - conversation ID
	 *
     */
     self.messages.getConversationMessages = function(conversationId){
		var path = '/api/v1/conversations/{conversationId}/messages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method sendAnEmailReply
	 * @memberof conversations/messages

	* @param {string} conversationId - conversation ID

	* @param {} body - Reply
	 * @example
	 * Body Example:
	 * {
   "htmlBody": "",
   "textBody": "",
   "id": "",
   "to": [],
   "cc": [],
   "bcc": [],
   "from": {
      "email": "",
      "name": ""
   },
   "subject": "",
   "attachments": [],
   "time": ""
}
	 *
     */
     self.messages.sendAnEmailReply = function(conversationId, body){
		var path = '/api/v1/conversations/{conversationId}/messages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};
	self.messages.draft = self.messages.draft || {};

	/**
     * 
     * @method getConversationDraftReply
	 * @memberof conversations/messages/draft

	* @param {string} conversationId - conversation ID
	 *
     */
     self.messages.draft.getConversationDraftReply = function(conversationId){
		var path = '/api/v1/conversations/{conversationId}/messages/draft';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};
	self.messages.draft = self.messages.draft || {};

	/**
     * 
     * @method updateConversationDraftReply
	 * @memberof conversations/messages/draft

	* @param {string} conversationId - conversation ID

	* @param {} body - Draft
	 * @example
	 * Body Example:
	 * {
   "htmlBody": "",
   "textBody": "",
   "id": "",
   "to": [],
   "cc": [],
   "bcc": [],
   "from": {
      "email": "",
      "name": ""
   },
   "subject": "",
   "attachments": [],
   "time": ""
}
	 *
     */
     self.messages.draft.updateConversationDraftReply = function(conversationId, body){
		var path = '/api/v1/conversations/{conversationId}/messages/draft';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method getConversationMessage
	 * @memberof conversations/messages

	* @param {string} conversationId - conversation ID

	* @param {string} id - message ID
	 *
     */
     self.messages.getConversationMessage = function(conversationId, id){
		var path = '/api/v1/conversations/{conversationId}/messages/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};

	/**
     * 
     * @method addParticipants
	 * @memberof conversations/participants

	* @param {string} conversationId - conversation ID

	* @param {} body - Conversation
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "startTime": "",
   "endTime": "",
   "participants": [],
   "conversationIds": [],
   "maxParticipants": 0,
   "recordingState": "",
   "selfUri": ""
}
	 *
     */
     self.participants.addParticipants = function(conversationId, body){
		var path = '/api/v1/conversations/{conversationId}/participants';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};

	/**
     * Specify the state as CONNECTED, DISCONNECTED. You can specify a wrap-up code.
     * @method updateParticipant
	 * @memberof conversations/participants

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "wrapup": {
      "code": "",
      "name": "",
      "notes": "",
      "tags": [],
      "durationSeconds": 0,
      "endTime": "",
      "provisional": true
   },
   "state": "",
   "recording": true,
   "muted": true,
   "confined": true,
   "held": true,
   "wrapupSkipped": true
}
	 *
     */
     self.participants.updateParticipant = function(conversationId, participantId, body){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.attributes = self.participants.attributes || {};

	/**
     * 
     * @method updateAttributes
	 * @memberof conversations/participants/attributes

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "attributes": {}
}
	 *
     */
     self.participants.attributes.updateAttributes = function(conversationId, participantId, body){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/attributes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.consult = self.participants.consult || {};

	/**
     * 
     * @method initiateConsultTransfer
	 * @memberof conversations/participants/consult

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - The object of the transfer

	* @param {} body - Destination address & initial speak to
	 * @example
	 * Body Example:
	 * {
   "speakTo": "",
   "destination": {
      "accountCodeDigits": "",
      "postConnectDigits": "",
      "address": "",
      "name": "",
      "userId": "",
      "queueId": ""
   }
}
	 *
     */
     self.participants.consult.initiateConsultTransfer = function(conversationId, participantId, body){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/consult';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.consult = self.participants.consult || {};

	/**
     * 
     * @method updateConsultTransfer
	 * @memberof conversations/participants/consult

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - The object of the transfer

	* @param {} body - new speak to
	 * @example
	 * Body Example:
	 * {
   "speakTo": ""
}
	 *
     */
     self.participants.consult.updateConsultTransfer = function(conversationId, participantId, body){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/consult';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.consult = self.participants.consult || {};

	/**
     * 
     * @method cancelConsultTransfer
	 * @memberof conversations/participants/consult

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - The object of the transfer
	 *
     */
     self.participants.consult.cancelConsultTransfer = function(conversationId, participantId){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/consult';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.monitor = self.participants.monitor || {};

	/**
     * 
     * @method monitorsParticipant
	 * @memberof conversations/participants/monitor

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID
	 *
     */
     self.participants.monitor.monitorsParticipant = function(conversationId, participantId){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/monitor';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.replace = self.participants.replace || {};

	/**
     * 
     * @method replaceParticipant
	 * @memberof conversations/participants/replace

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID

	* @param {string} userId - The user that will replace this participant.  If address is not supplied then the user's Work address will be used.  This parameter is required when replacing a participant that has an active chat.

	* @param {string} address - The address that will be used to contact the new participant

	* @param {string} username - The username of the person that will replace this participant.  This field is only used if the userId is blank.

	* @param {string} queueId - The id of the queue that will replace this participant.

	* @param {boolean} voicemail - Indicates this participant will be replaced by the voicemail inbox of the participant.
	 *
     */
     self.participants.replace.replaceParticipant = function(conversationId, participantId, userId, address, username, queueId, voicemail){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/replace';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }


		if(userId !== undefined && userId !== null){
			queryParameters.userId = userId;
		}


		if(address !== undefined && address !== null){
			queryParameters.address = address;
		}


		if(username !== undefined && username !== null){
			queryParameters.username = username;
		}


		if(queueId !== undefined && queueId !== null){
			queryParameters.queueId = queueId;
		}


		if(voicemail !== undefined && voicemail !== null){
			queryParameters.voicemail = voicemail;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.wrapup = self.participants.wrapup || {};

	/**
     * 
     * @method getParticipantWrapup
	 * @memberof conversations/participants/wrapup

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID

	* @param {boolean} provisional - Indicates if the wrap-up code is provisional.
	 *
     */
     self.participants.wrapup.getParticipantWrapup = function(conversationId, participantId, provisional){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/wrapup';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }


		if(provisional !== undefined && provisional !== null){
			queryParameters.provisional = provisional;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.participants = self.participants || {};
	self.participants.wrapupcodes = self.participants.wrapupcodes || {};

	/**
     * 
     * @method getWrapupCodes
	 * @memberof conversations/participants/wrapupcodes

	* @param {string} conversationId - conversation ID

	* @param {string} participantId - participant ID
	 *
     */
     self.participants.wrapupcodes.getWrapupCodes = function(conversationId, participantId){
		var path = '/api/v1/conversations/{conversationId}/participants/{participantId}/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{participantId}', participantId);

        if(participantId === undefined && participantId !== null){
			throw 'Missing required  parameter: participantId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};

	/**
     * 
     * @method getConversationRecordings
	 * @memberof conversations/recordings

	* @param {string} conversationId - Conversation ID

	* @param {integer} maxWaitMs - The maximum number of milliseconds to wait for completion.
	Any integer greater than or equal to 0.,

	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,
	 *
     */
     self.recordings.getConversationRecordings = function(conversationId, maxWaitMs, formatId){
		var path = '/api/v1/conversations/{conversationId}/recordings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }


		if(maxWaitMs !== undefined && maxWaitMs !== null){
			queryParameters.maxWaitMs = maxWaitMs;
		}


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};

	/**
     * 
     * @method getConversationRecording
	 * @memberof conversations/recordings

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {integer} maxWaitMs - The maximum number of milliseconds to wait for completion.
	Any integer greater than or equal to 0.,

	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,

	* @param {boolean} download - requesting a download format of the recording
	true,
	false,

	* @param {string} fileName - the name of the downloaded fileName
	 *
     */
     self.recordings.getConversationRecording = function(conversationId, recordingId, maxWaitMs, formatId, download, fileName){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		if(maxWaitMs !== undefined && maxWaitMs !== null){
			queryParameters.maxWaitMs = maxWaitMs;
		}


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}


		if(download !== undefined && download !== null){
			queryParameters.download = download;
		}


		if(fileName !== undefined && fileName !== null){
			queryParameters.fileName = fileName;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};

	/**
     * It is not currently possible to force something into long term storage, so this can only be used to request a restoration. In addition, a restoration takes some time, and so it is not guaranteed to be completed for several hours.
     * @method updateConversationRecording
	 * @memberof conversations/recordings

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {} body - recording

	* @param {integer} restoreDays - The number of days the recording will be available before it is re-archived.
	Any integer greater than or equal to 1.,
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "conversationId": "",
   "path": "",
   "startTime": "",
   "endTime": "",
   "media": "",
   "mediaUri": "",
   "waveUri": "",
   "annotations": [],
   "transcript": [],
   "emailTranscript": [],
   "fileState": "",
   "restoreExpirationTime": "",
   "mediaUris": {},
   "estimatedTranscodeTimeMs": 0,
   "actualTranscodeTimeMs": 0,
   "archiveDate": "",
   "archiveMedium": "",
   "deleteDate": "",
   "maxAllowedRestorationsForOrg": 0,
   "remainingRestorationsAllowedForOrg": 0,
   "recordingId": ""
}
	 *
     */
     self.recordings.updateConversationRecording = function(conversationId, recordingId, body, restoreDays){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }


		if(restoreDays !== undefined && restoreDays !== null){
			queryParameters.restoreDays = restoreDays;
		}



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};

	/**
     * 
     * @method updateRecordingRetentionDurationData
	 * @memberof conversations/recordings

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {} body - recording
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "conversationId": "",
   "path": "",
   "startTime": "",
   "endTime": "",
   "media": "",
   "mediaUri": "",
   "waveUri": "",
   "annotations": [],
   "transcript": [],
   "emailTranscript": [],
   "fileState": "",
   "restoreExpirationTime": "",
   "mediaUris": {},
   "estimatedTranscodeTimeMs": 0,
   "actualTranscodeTimeMs": 0,
   "archiveDate": "",
   "archiveMedium": "",
   "deleteDate": "",
   "maxAllowedRestorationsForOrg": 0,
   "remainingRestorationsAllowedForOrg": 0,
   "recordingId": ""
}
	 *
     */
     self.recordings.updateRecordingRetentionDurationData = function(conversationId, recordingId, body){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};
	self.recordings.annotations = self.recordings.annotations || {};

	/**
     * 
     * @method getAnnotations
	 * @memberof conversations/recordings/annotations

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID
	 *
     */
     self.recordings.annotations.getAnnotations = function(conversationId, recordingId){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}/annotations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};
	self.recordings.annotations = self.recordings.annotations || {};

	/**
     * 
     * @method createAnnotation
	 * @memberof conversations/recordings/annotations

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {} body - annotation
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "location": 0,
   "durationMs": 0,
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "description": "",
   "selfUri": ""
}
	 *
     */
     self.recordings.annotations.createAnnotation = function(conversationId, recordingId, body){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}/annotations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};
	self.recordings.annotations = self.recordings.annotations || {};

	/**
     * 
     * @method getAnnotation
	 * @memberof conversations/recordings/annotations

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {string} annotationId - Annotation ID
	 *
     */
     self.recordings.annotations.getAnnotation = function(conversationId, recordingId, annotationId){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}/annotations/{annotationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        path = path.replace('{annotationId}', annotationId);

        if(annotationId === undefined && annotationId !== null){
			throw 'Missing required  parameter: annotationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};
	self.recordings.annotations = self.recordings.annotations || {};

	/**
     * 
     * @method updateAnnotation
	 * @memberof conversations/recordings/annotations

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {string} annotationId - Annotation ID

	* @param {} body - annotation
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "location": 0,
   "durationMs": 0,
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "description": "",
   "selfUri": ""
}
	 *
     */
     self.recordings.annotations.updateAnnotation = function(conversationId, recordingId, annotationId, body){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}/annotations/{annotationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        path = path.replace('{annotationId}', annotationId);

        if(annotationId === undefined && annotationId !== null){
			throw 'Missing required  parameter: annotationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.recordings = self.recordings || {};
	self.recordings.annotations = self.recordings.annotations || {};

	/**
     * 
     * @method deleteAnnotation
	 * @memberof conversations/recordings/annotations

	* @param {string} conversationId - Conversation ID

	* @param {string} recordingId - Recording ID

	* @param {string} annotationId - Annotation ID
	 *
     */
     self.recordings.annotations.deleteAnnotation = function(conversationId, recordingId, annotationId){
		var path = '/api/v1/conversations/{conversationId}/recordings/{recordingId}/annotations/{annotationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        path = path.replace('{annotationId}', annotationId);

        if(annotationId === undefined && annotationId !== null){
			throw 'Missing required  parameter: annotationId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.tags = self.tags || {};

	/**
     * 
     * @method getTags
	 * @memberof conversations/tags

	* @param {string} conversationId - conversation ID
	 *
     */
     self.tags.getTags = function(conversationId){
		var path = '/api/v1/conversations/{conversationId}/tags';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method getWrapupCode
	 * @memberof conversations/wrapupcodes

	* @param {string} conversationId - conversation ID
	 *
     */
     self.wrapupcodes.getWrapupCode = function(conversationId){
		var path = '/api/v1/conversations/{conversationId}/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.downloads";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.downloads = (function (PureCloud) {
	/**
	* @namespace downloads/callback
	**/
	/**
	* @namespace downloads
	**/

	var self = {};
	self.callback = self.callback || {};

	/**
     * 
     * @method oauthCallback
	 * @memberof downloads/callback

	* @param {string} code - 

	* @param {string} state - 
	 *
     */
     self.callback.oauthCallback = function(code, state){
		var path = '/api/v1/downloads/callback';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(code !== undefined && code !== null){
			queryParameters.code = code;
		}


		if(state !== undefined && state !== null){
			queryParameters.state = state;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * this method will issue a redirect to the url to the content
     * @method getSecureDownload
	 * @memberof downloads

	* @param {string} downloadId - Download ID

	* @param {string} contentDisposition - 
	 *
     */
     self.getSecureDownload = function(downloadId, contentDisposition){
		var path = '/api/v1/downloads/{downloadId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{downloadId}', downloadId);

        if(downloadId === undefined && downloadId !== null){
			throw 'Missing required  parameter: downloadId';
        }


		if(contentDisposition !== undefined && contentDisposition !== null){
			queryParameters.contentDisposition = contentDisposition;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.fax";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.fax = (function (PureCloud) {
	/**
	* @namespace fax/documents
	**/
	/**
	* @namespace fax/documents/content
	**/
	/**
	* @namespace fax/summary
	**/

	var self = {};
	self.documents = self.documents || {};

	/**
     * 
     * @method listFaxDocuments
	 * @memberof fax/documents

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.documents.listFaxDocuments = function(pageSize, pageNumber){
		var path = '/api/v1/fax/documents';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method getDocument
	 * @memberof fax/documents

	* @param {string} documentId - Document ID
	 *
     */
     self.documents.getDocument = function(documentId){
		var path = '/api/v1/fax/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method updateFaxDocument
	 * @memberof fax/documents

	* @param {string} documentId - Document ID

	* @param {} body - Document
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "contentUri": "",
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "createdBy": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "contentType": "",
   "contentLength": 0,
   "filename": "",
   "read": true,
   "pageCount": 0,
   "callerAddress": "",
   "receiverAddress": "",
   "thumbnails": [],
   "sharingUri": "",
   "downloadSharingUri": "",
   "selfUri": ""
}
	 *
     */
     self.documents.updateFaxDocument = function(documentId, body){
		var path = '/api/v1/fax/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};

	/**
     * 
     * @method deleteFaxDocument
	 * @memberof fax/documents

	* @param {string} documentId - Document ID
	 *
     */
     self.documents.deleteFaxDocument = function(documentId){
		var path = '/api/v1/fax/documents/{documentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.documents = self.documents || {};
	self.documents.content = self.documents.content || {};

	/**
     * 
     * @method downloadFaxDocument
	 * @memberof fax/documents/content

	* @param {string} documentId - Document ID
	 *
     */
     self.documents.content.downloadFaxDocument = function(documentId){
		var path = '/api/v1/fax/documents/{documentId}/content';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{documentId}', documentId);

        if(documentId === undefined && documentId !== null){
			throw 'Missing required  parameter: documentId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.summary = self.summary || {};

	/**
     * 
     * @method getFaxSummary
	 * @memberof fax/summary
	 *
     */
     self.summary.getFaxSummary = function(){
		var path = '/api/v1/fax/summary';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.flows";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.flows = (function (PureCloud) {
	/**
	* @namespace flows
	**/

	var self = {};

	/**
     * Multiple IDs can be specified, in which case all matching flows will be returned, and no other parameters will be evaluated.
     * @method getFlows
	 * @memberof flows

	* @param {string} type - Type

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {array} id - ID

	* @param {string} name - Name

	* @param {string} description - Description

	* @param {string} nameOrDescription - Name or description

	* @param {string} publishVersionId - Publish version ID

	* @param {string} lockedBy - Locked by
	 *
     */
     self.getFlows = function(type, pageNumber, pageSize, sortBy, sortOrder, id, name, description, nameOrDescription, publishVersionId, lockedBy){
		var path = '/api/v1/flows';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(description !== undefined && description !== null){
			queryParameters.description = description;
		}


		if(nameOrDescription !== undefined && nameOrDescription !== null){
			queryParameters.nameOrDescription = nameOrDescription;
		}


		if(publishVersionId !== undefined && publishVersionId !== null){
			queryParameters.publishVersionId = publishVersionId;
		}


		if(lockedBy !== undefined && lockedBy !== null){
			queryParameters.lockedBy = lockedBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createFlow
	 * @memberof flows

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "type": "",
   "lockedUser": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "active": true,
   "deleted": true,
   "publishedVersion": {
      "id": "",
      "name": "",
      "commitVersion": "",
      "configurationVersion": "",
      "type": "",
      "createdBy": {},
      "configurationUri": "",
      "dateCreated": 0,
      "generationId": "",
      "publishResultUri": "",
      "selfUri": ""
   },
   "checkedInVersion": {
      "id": "",
      "name": "",
      "commitVersion": "",
      "configurationVersion": "",
      "type": "",
      "createdBy": {},
      "configurationUri": "",
      "dateCreated": 0,
      "generationId": "",
      "publishResultUri": "",
      "selfUri": ""
   },
   "savedVersion": {
      "id": "",
      "name": "",
      "commitVersion": "",
      "configurationVersion": "",
      "type": "",
      "createdBy": {},
      "configurationUri": "",
      "dateCreated": 0,
      "generationId": "",
      "publishResultUri": "",
      "selfUri": ""
   },
   "system": true,
   "selfUri": ""
}
	 *
     */
     self.createFlow = function(body){
		var path = '/api/v1/flows';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.greetings";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.greetings = (function (PureCloud) {
	/**
	* @namespace greetings
	**/
	/**
	* @namespace greetings/defaults
	**/
	/**
	* @namespace greetings/media
	**/

	var self = {};

	/**
     * 
     * @method getOrganizationGreetings
	 * @memberof greetings

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.getOrganizationGreetings = function(pageSize, pageNumber){
		var path = '/api/v1/greetings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createOrganizationGreeting
	 * @memberof greetings

	* @param {} body - The Greeting to create
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "ownerType": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "audioFile": {
      "durationMilliseconds": 0,
      "sizeBytes": 0,
      "selfUri": ""
   },
   "audioTTS": "",
   "createdDate": "",
   "createdBy": "",
   "modifiedDate": "",
   "modifiedBy": "",
   "selfUri": ""
}
	 *
     */
     self.createOrganizationGreeting = function(body){
		var path = '/api/v1/greetings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.defaults = self.defaults || {};

	/**
     * 
     * @method getOrganizationDefaultgreetingslist
	 * @memberof greetings/defaults
	 *
     */
     self.defaults.getOrganizationDefaultgreetingslist = function(){
		var path = '/api/v1/greetings/defaults';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.defaults = self.defaults || {};

	/**
     * 
     * @method updateOrganizationDefaultgreetingslist
	 * @memberof greetings/defaults

	* @param {} body - The updated defaultGreetingList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "ownerType": "",
   "greetings": {},
   "createdDate": "",
   "createdBy": "",
   "modifiedDate": "",
   "modifiedBy": "",
   "selfUri": ""
}
	 *
     */
     self.defaults.updateOrganizationDefaultgreetingslist = function(body){
		var path = '/api/v1/greetings/defaults';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getGreeting
	 * @memberof greetings

	* @param {string} greetingId - Greeting ID
	 *
     */
     self.getGreeting = function(greetingId){
		var path = '/api/v1/greetings/{greetingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{greetingId}', greetingId);

        if(greetingId === undefined && greetingId !== null){
			throw 'Missing required  parameter: greetingId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateGreeting
	 * @memberof greetings

	* @param {string} greetingId - Greeting ID

	* @param {} body - The updated Greeting
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "ownerType": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "audioFile": {
      "durationMilliseconds": 0,
      "sizeBytes": 0,
      "selfUri": ""
   },
   "audioTTS": "",
   "createdDate": "",
   "createdBy": "",
   "modifiedDate": "",
   "modifiedBy": "",
   "selfUri": ""
}
	 *
     */
     self.updateGreeting = function(greetingId, body){
		var path = '/api/v1/greetings/{greetingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{greetingId}', greetingId);

        if(greetingId === undefined && greetingId !== null){
			throw 'Missing required  parameter: greetingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteGreeting
	 * @memberof greetings

	* @param {string} greetingId - Greeting ID
	 *
     */
     self.deleteGreeting = function(greetingId){
		var path = '/api/v1/greetings/{greetingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{greetingId}', greetingId);

        if(greetingId === undefined && greetingId !== null){
			throw 'Missing required  parameter: greetingId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.media = self.media || {};

	/**
     * 
     * @method getMedia
	 * @memberof greetings/media

	* @param {string} greetingId - Greeting ID

	* @param {string} formatId - The desired format (WAV, etc.)
	WAV,
	 *
     */
     self.media.getMedia = function(greetingId, formatId){
		var path = '/api/v1/greetings/{greetingId}/media';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{greetingId}', greetingId);

        if(greetingId === undefined && greetingId !== null){
			throw 'Missing required  parameter: greetingId';
        }


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.groups";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.groups = (function (PureCloud) {
	/**
	* @namespace groups
	**/
	/**
	* @namespace groups/members
	**/

	var self = {};

	/**
     * 
     * @method getGroupList
	 * @memberof groups

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name
	 *
     */
     self.getGroupList = function(pageSize, pageNumber, name){
		var path = '/api/v1/groups';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getGroup
	 * @memberof groups

	* @param {string} groupId - Group ID
	 *
     */
     self.getGroup = function(groupId){
		var path = '/api/v1/groups/{groupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{groupId}', groupId);

        if(groupId === undefined && groupId !== null){
			throw 'Missing required  parameter: groupId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.members = self.members || {};

	/**
     * 
     * @method getGroupMembers
	 * @memberof groups/members

	* @param {string} groupId - Group ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.members.getGroupMembers = function(groupId, pageSize, pageNumber){
		var path = '/api/v1/groups/{groupId}/members';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{groupId}', groupId);

        if(groupId === undefined && groupId !== null){
			throw 'Missing required  parameter: groupId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.identityproviders";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.identityproviders = (function (PureCloud) {
	/**
	* @namespace identityproviders
	**/
	/**
	* @namespace identityproviders/onelogin
	**/
	/**
	* @namespace identityproviders/purecloud
	**/

	var self = {};

	/**
     * 
     * @method getIdentityProviders
	 * @memberof identityproviders
	 *
     */
     self.getIdentityProviders = function(){
		var path = '/api/v1/identityproviders';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.onelogin = self.onelogin || {};

	/**
     * 
     * @method getOneloginIdentityProvider
	 * @memberof identityproviders/onelogin
	 *
     */
     self.onelogin.getOneloginIdentityProvider = function(){
		var path = '/api/v1/identityproviders/onelogin';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.onelogin = self.onelogin || {};

	/**
     * 
     * @method updatecreateOneloginIdentityProvider
	 * @memberof identityproviders/onelogin

	* @param {} body - Provider
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "certificate": "",
   "issuerURI": "",
   "ssoTargetURI": "",
   "selfUri": ""
}
	 *
     */
     self.onelogin.updatecreateOneloginIdentityProvider = function(body){
		var path = '/api/v1/identityproviders/onelogin';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.onelogin = self.onelogin || {};

	/**
     * 
     * @method deleteOneloginIdentityProvider
	 * @memberof identityproviders/onelogin
	 *
     */
     self.onelogin.deleteOneloginIdentityProvider = function(){
		var path = '/api/v1/identityproviders/onelogin';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.purecloud = self.purecloud || {};

	/**
     * 
     * @method getPurecloudIdentityProvider
	 * @memberof identityproviders/purecloud
	 *
     */
     self.purecloud.getPurecloudIdentityProvider = function(){
		var path = '/api/v1/identityproviders/purecloud';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.purecloud = self.purecloud || {};

	/**
     * 
     * @method updatecreatePurecloudIdentityProvider
	 * @memberof identityproviders/purecloud

	* @param {} body - Provider
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "selfUri": ""
}
	 *
     */
     self.purecloud.updatecreatePurecloudIdentityProvider = function(body){
		var path = '/api/v1/identityproviders/purecloud';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.purecloud = self.purecloud || {};

	/**
     * 
     * @method deletePurecloudIdentityProvider
	 * @memberof identityproviders/purecloud
	 *
     */
     self.purecloud.deletePurecloudIdentityProvider = function(){
		var path = '/api/v1/identityproviders/purecloud';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getIdentityProvider
	 * @memberof identityproviders
	 *
     */
     self.getIdentityProvider = function(){
		var path = '/api/v1/identityproviders/{providerId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateIdentityProvider
	 * @memberof identityproviders

	* @param {} body - Provider
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "selfUri": ""
}
	 *
     */
     self.updateIdentityProvider = function(body){
		var path = '/api/v1/identityproviders/{providerId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteIdentityProvider
	 * @memberof identityproviders
	 *
     */
     self.deleteIdentityProvider = function(){
		var path = '/api/v1/identityproviders/{providerId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.languages";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.languages = (function (PureCloud) {
	/**
	* @namespace languages
	**/

	var self = {};

	/**
     * 
     * @method getLanguageList
	 * @memberof languages

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.getLanguageList = function(pageSize, pageNumber){
		var path = '/api/v1/languages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getLanguage
	 * @memberof languages

	* @param {string} languageId - Language ID
	 *
     */
     self.getLanguage = function(languageId){
		var path = '/api/v1/languages/{languageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{languageId}', languageId);

        if(languageId === undefined && languageId !== null){
			throw 'Missing required  parameter: languageId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.licensing";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.licensing = (function (PureCloud) {
	/**
	* @namespace licensing/licenses
	**/
	/**
	* @namespace licensing/orgassignments
	**/
	/**
	* @namespace licensing/permissions
	**/
	/**
	* @namespace licensing/userassignments
	**/

	var self = {};
	self.licenses = self.licenses || {};

	/**
     * 
     * @method getPermissionLicenses
	 * @memberof licensing/licenses

	* @param {array} permission - Permission
	 *
     */
     self.licenses.getPermissionLicenses = function(permission){
		var path = '/api/v1/licensing/licenses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(permission !== undefined && permission !== null){
			queryParameters.permission = permission;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.orgassignments = self.orgassignments || {};

	/**
     * 
     * @method getOrgLicenseAssignments
	 * @memberof licensing/orgassignments
	 *
     */
     self.orgassignments.getOrgLicenseAssignments = function(){
		var path = '/api/v1/licensing/orgassignments';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.orgassignments = self.orgassignments || {};

	/**
     * 
     * @method getOrgLicenseAssignment
	 * @memberof licensing/orgassignments

	* @param {string} id - ID
	 *
     */
     self.orgassignments.getOrgLicenseAssignment = function(id){
		var path = '/api/v1/licensing/orgassignments/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.permissions = self.permissions || {};

	/**
     * 
     * @method getPermissionLicenses
	 * @memberof licensing/permissions

	* @param {array} id - ID
	 *
     */
     self.permissions.getPermissionLicenses = function(id){
		var path = '/api/v1/licensing/permissions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.userassignments = self.userassignments || {};

	/**
     * 
     * @method getUserLicenseAssignments
	 * @memberof licensing/userassignments
	 *
     */
     self.userassignments.getUserLicenseAssignments = function(){
		var path = '/api/v1/licensing/userassignments';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.userassignments = self.userassignments || {};

	/**
     * 
     * @method getUserLicenseAssignment
	 * @memberof licensing/userassignments

	* @param {string} id - ID
	 *
     */
     self.userassignments.getUserLicenseAssignment = function(id){
		var path = '/api/v1/licensing/userassignments/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.locations";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.locations = (function (PureCloud) {
	/**
	* @namespace locations
	**/

	var self = {};

	/**
     * 
     * @method getLocationList
	 * @memberof locations

	* @param {string} state - Location state
	ACTIVE,
	DELETED,

	* @param {string} name - Location name

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.getLocationList = function(state, name, pageSize, pageNumber){
		var path = '/api/v1/locations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(state !== undefined && state !== null){
			queryParameters.state = state;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getLocation
	 * @memberof locations

	* @param {string} locationId - Location ID
	 *
     */
     self.getLocation = function(locationId){
		var path = '/api/v1/locations/{locationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{locationId}', locationId);

        if(locationId === undefined && locationId !== null){
			throw 'Missing required  parameter: locationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.notifications";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.notifications = (function (PureCloud) {
	/**
	* @namespace notifications/availabletopics
	**/
	/**
	* @namespace notifications/channels
	**/
	/**
	* @namespace notifications/channels/subscriptions
	**/

	var self = {};
	self.availabletopics = self.availabletopics || {};

	/**
     * 
     * @method getAvailableNotificationTopics
	 * @memberof notifications/availabletopics
	 *
     */
     self.availabletopics.getAvailableNotificationTopics = function(){
		var path = '/api/v1/notifications/availabletopics';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};

	/**
     * 
     * @method getChannels
	 * @memberof notifications/channels
	 *
     */
     self.channels.getChannels = function(){
		var path = '/api/v1/notifications/channels';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};

	/**
     * There is a limit of 10 channels. Creating an 11th channel will remove the channel with oldest last used date.
     * @method createChannel
	 * @memberof notifications/channels
	 *
     */
     self.channels.createChannel = function(){
		var path = '/api/v1/notifications/channels';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};
	self.channels.subscriptions = self.channels.subscriptions || {};

	/**
     * 
     * @method getSubscriptions
	 * @memberof notifications/channels/subscriptions

	* @param {string} channelId - Channel ID
	 *
     */
     self.channels.subscriptions.getSubscriptions = function(channelId){
		var path = '/api/v1/notifications/channels/{channelId}/subscriptions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{channelId}', channelId);

        if(channelId === undefined && channelId !== null){
			throw 'Missing required  parameter: channelId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};
	self.channels.subscriptions = self.channels.subscriptions || {};

	/**
     * 
     * @method addSubscription
	 * @memberof notifications/channels/subscriptions

	* @param {string} channelId - Channel ID

	* @param {} body - Topic
	 *
     */
     self.channels.subscriptions.addSubscription = function(channelId, body){
		var path = '/api/v1/notifications/channels/{channelId}/subscriptions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{channelId}', channelId);

        if(channelId === undefined && channelId !== null){
			throw 'Missing required  parameter: channelId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};
	self.channels.subscriptions = self.channels.subscriptions || {};

	/**
     * 
     * @method replaceSubscriptions
	 * @memberof notifications/channels/subscriptions

	* @param {string} channelId - Channel ID

	* @param {} body - Topic
	 *
     */
     self.channels.subscriptions.replaceSubscriptions = function(channelId, body){
		var path = '/api/v1/notifications/channels/{channelId}/subscriptions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{channelId}', channelId);

        if(channelId === undefined && channelId !== null){
			throw 'Missing required  parameter: channelId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.channels = self.channels || {};
	self.channels.subscriptions = self.channels.subscriptions || {};

	/**
     * 
     * @method removeAllSubscriptions
	 * @memberof notifications/channels/subscriptions

	* @param {string} channelId - Channel ID
	 *
     */
     self.channels.subscriptions.removeAllSubscriptions = function(channelId){
		var path = '/api/v1/notifications/channels/{channelId}/subscriptions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{channelId}', channelId);

        if(channelId === undefined && channelId !== null){
			throw 'Missing required  parameter: channelId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.oauth";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.oauth = (function (PureCloud) {
	/**
	* @namespace oauth/clients
	**/
	/**
	* @namespace oauth/clients/secret
	**/

	var self = {};
	self.clients = self.clients || {};

	/**
     * 
     * @method getOauthClients
	 * @memberof oauth/clients
	 *
     */
     self.clients.getOauthClients = function(){
		var path = '/api/v1/oauth/clients';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.clients = self.clients || {};

	/**
     * The OAuth Grant/Client is required in order to create an authentication token and gain access to PureCloud. 
The preferred authorizedGrantTypes is 'CODE' which requires applications to send a client ID and client secret. This is typically a web server. 
If the client is unable to secure the client secret then the 'TOKEN' grant type aka IMPLICIT should be used. This is would be for browser or mobile apps.
     * @method createOauthClient
	 * @memberof oauth/clients

	* @param {} body - Client
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "accessTokenValiditySeconds": 0,
   "authorizedGrantTypes": [],
   "description": "",
   "registeredRedirectUri": [],
   "secret": "",
   "selfUri": ""
}
	 *
     */
     self.clients.createOauthClient = function(body){
		var path = '/api/v1/oauth/clients';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.clients = self.clients || {};

	/**
     * 
     * @method getOauthClient
	 * @memberof oauth/clients

	* @param {string} clientId - Client ID
	 *
     */
     self.clients.getOauthClient = function(clientId){
		var path = '/api/v1/oauth/clients/{clientId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{clientId}', clientId);

        if(clientId === undefined && clientId !== null){
			throw 'Missing required  parameter: clientId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.clients = self.clients || {};

	/**
     * 
     * @method updateOauthClient
	 * @memberof oauth/clients

	* @param {string} clientId - Client ID

	* @param {} body - Client
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "accessTokenValiditySeconds": 0,
   "authorizedGrantTypes": [],
   "description": "",
   "registeredRedirectUri": [],
   "secret": "",
   "selfUri": ""
}
	 *
     */
     self.clients.updateOauthClient = function(clientId, body){
		var path = '/api/v1/oauth/clients/{clientId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{clientId}', clientId);

        if(clientId === undefined && clientId !== null){
			throw 'Missing required  parameter: clientId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.clients = self.clients || {};

	/**
     * 
     * @method deleteOauthClient
	 * @memberof oauth/clients

	* @param {string} clientId - Client ID
	 *
     */
     self.clients.deleteOauthClient = function(clientId){
		var path = '/api/v1/oauth/clients/{clientId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{clientId}', clientId);

        if(clientId === undefined && clientId !== null){
			throw 'Missing required  parameter: clientId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.clients = self.clients || {};
	self.clients.secret = self.clients.secret || {};

	/**
     * This operation will set the client secret to a randomly generated cryptographically random value. All clients must be updated with the new secret. This operation should be used with caution.
     * @method regenSecret
	 * @memberof oauth/clients/secret

	* @param {string} clientId - Client ID
	 *
     */
     self.clients.secret.regenSecret = function(clientId){
		var path = '/api/v1/oauth/clients/{clientId}/secret';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{clientId}', clientId);

        if(clientId === undefined && clientId !== null){
			throw 'Missing required  parameter: clientId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.orphanrecordings";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.orphanrecordings = (function (PureCloud) {
	/**
	* @namespace orphanrecordings
	**/

	var self = {};

	/**
     * 
     * @method getOrphanRecordings
	 * @memberof orphanrecordings

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list
	 *
     */
     self.getOrphanRecordings = function(pageSize, pageNumber, sortBy, expand){
		var path = '/api/v1/orphanrecordings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getAnOrphanRecording
	 * @memberof orphanrecordings

	* @param {string} orphanId - Orphan ID

	* @param {integer} maxWaitMs - The maximum number of milliseconds to wait for completion.
	Any integer greater than or equal to 0.,

	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,

	* @param {boolean} download - requesting a download format of the recording
	true,
	false,

	* @param {string} fileName - the name of the downloaded fileName
	 *
     */
     self.getAnOrphanRecording = function(orphanId, maxWaitMs, formatId, download, fileName){
		var path = '/api/v1/orphanrecordings/{orphanId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{orphanId}', orphanId);

        if(orphanId === undefined && orphanId !== null){
			throw 'Missing required  parameter: orphanId';
        }


		if(maxWaitMs !== undefined && maxWaitMs !== null){
			queryParameters.maxWaitMs = maxWaitMs;
		}


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}


		if(download !== undefined && download !== null){
			queryParameters.download = download;
		}


		if(fileName !== undefined && fileName !== null){
			queryParameters.fileName = fileName;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteAnOrphanRecording
	 * @memberof orphanrecordings

	* @param {string} orphanId - Orphan ID
	 *
     */
     self.deleteAnOrphanRecording = function(orphanId){
		var path = '/api/v1/orphanrecordings/{orphanId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{orphanId}', orphanId);

        if(orphanId === undefined && orphanId !== null){
			throw 'Missing required  parameter: orphanId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.outbound";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.outbound = (function (PureCloud) {
	/**
	* @namespace outbound/audits
	**/
	/**
	* @namespace outbound/callabletimesets
	**/
	/**
	* @namespace outbound/callanalysisresponsesets
	**/
	/**
	* @namespace outbound/campaigns
	**/
	/**
	* @namespace outbound/campaigns/agents
	**/
	/**
	* @namespace outbound/campaigns/callback/schedule
	**/
	/**
	* @namespace outbound/campaigns/diagnostics
	**/
	/**
	* @namespace outbound/campaigns/stats
	**/
	/**
	* @namespace outbound/contactlists
	**/
	/**
	* @namespace outbound/contactlists/penetrationrates
	**/
	/**
	* @namespace outbound/contactlists/contacts
	**/
	/**
	* @namespace outbound/contactlists/export
	**/
	/**
	* @namespace outbound/contactlists/importstatus
	**/
	/**
	* @namespace outbound/contactlists/penetrationrate
	**/
	/**
	* @namespace outbound/conversations/dnc
	**/
	/**
	* @namespace outbound/dnclists
	**/
	/**
	* @namespace outbound/dnclists/export
	**/
	/**
	* @namespace outbound/dnclists/importstatus
	**/
	/**
	* @namespace outbound/dnclists/phonenumbers
	**/
	/**
	* @namespace outbound/previews
	**/
	/**
	* @namespace outbound/previews/dispositioncall
	**/
	/**
	* @namespace outbound/previews/placecall
	**/
	/**
	* @namespace outbound/rulesets
	**/
	/**
	* @namespace outbound/schedules/campaigns
	**/
	/**
	* @namespace outbound/schedules/sequences
	**/
	/**
	* @namespace outbound/sequences
	**/
	/**
	* @namespace outbound/wrapupcodemappings
	**/

	var self = {};
	self.audits = self.audits || {};

	/**
     * 
     * @method searchDialerAudits
	 * @memberof outbound/audits

	* @param {} body - AuditSearch

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {boolean} facetsOnly - Facets only
	 * @example
	 * Body Example:
	 * {
   "queryPhrase": "",
   "queryFields": [],
   "facets": [],
   "filters": []
}
	 *
     */
     self.audits.searchDialerAudits = function(body, pageSize, pageNumber, sortBy, sortOrder, facetsOnly){
		var path = '/api/v1/outbound/audits';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(facetsOnly !== undefined && facetsOnly !== null){
			queryParameters.facetsOnly = facetsOnly;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callabletimesets = self.callabletimesets || {};

	/**
     * 
     * @method queryCallableTimeSets
	 * @memberof outbound/callabletimesets

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.callabletimesets.queryCallableTimeSets = function(pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/callabletimesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callabletimesets = self.callabletimesets || {};

	/**
     * 
     * @method createCallableTimeSet
	 * @memberof outbound/callabletimesets

	* @param {} body - DialerCallableTimeSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "callableTimes": [],
   "selfUri": ""
}
	 *
     */
     self.callabletimesets.createCallableTimeSet = function(body){
		var path = '/api/v1/outbound/callabletimesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callabletimesets = self.callabletimesets || {};

	/**
     * 
     * @method getCallableTimeSet
	 * @memberof outbound/callabletimesets

	* @param {string} callableTimeSetId - Callable Time Set ID
	 *
     */
     self.callabletimesets.getCallableTimeSet = function(callableTimeSetId){
		var path = '/api/v1/outbound/callabletimesets/{callableTimeSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callableTimeSetId}', callableTimeSetId);

        if(callableTimeSetId === undefined && callableTimeSetId !== null){
			throw 'Missing required  parameter: callableTimeSetId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callabletimesets = self.callabletimesets || {};

	/**
     * 
     * @method updateCallableTimeSet
	 * @memberof outbound/callabletimesets

	* @param {string} callableTimeSetId - Callable Time Set ID

	* @param {} body - DialerCallableTimeSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "callableTimes": [],
   "selfUri": ""
}
	 *
     */
     self.callabletimesets.updateCallableTimeSet = function(callableTimeSetId, body){
		var path = '/api/v1/outbound/callabletimesets/{callableTimeSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callableTimeSetId}', callableTimeSetId);

        if(callableTimeSetId === undefined && callableTimeSetId !== null){
			throw 'Missing required  parameter: callableTimeSetId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callabletimesets = self.callabletimesets || {};

	/**
     * 
     * @method deleteCallableTimeSet
	 * @memberof outbound/callabletimesets

	* @param {string} callableTimeSetId - Callable Time Set ID
	 *
     */
     self.callabletimesets.deleteCallableTimeSet = function(callableTimeSetId){
		var path = '/api/v1/outbound/callabletimesets/{callableTimeSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callableTimeSetId}', callableTimeSetId);

        if(callableTimeSetId === undefined && callableTimeSetId !== null){
			throw 'Missing required  parameter: callableTimeSetId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callanalysisresponsesets = self.callanalysisresponsesets || {};

	/**
     * 
     * @method queryDialerResponseset
	 * @memberof outbound/callanalysisresponsesets

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.callanalysisresponsesets.queryDialerResponseset = function(pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/callanalysisresponsesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callanalysisresponsesets = self.callanalysisresponsesets || {};

	/**
     * 
     * @method createDialerResponseset
	 * @memberof outbound/callanalysisresponsesets

	* @param {} body - ResponseSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "responses": {},
   "selfUri": ""
}
	 *
     */
     self.callanalysisresponsesets.createDialerResponseset = function(body){
		var path = '/api/v1/outbound/callanalysisresponsesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callanalysisresponsesets = self.callanalysisresponsesets || {};

	/**
     * 
     * @method getADialerResponseset
	 * @memberof outbound/callanalysisresponsesets

	* @param {string} callAnalysisSetId - Call Analysis Response Set ID
	 *
     */
     self.callanalysisresponsesets.getADialerResponseset = function(callAnalysisSetId){
		var path = '/api/v1/outbound/callanalysisresponsesets/{callAnalysisSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callAnalysisSetId}', callAnalysisSetId);

        if(callAnalysisSetId === undefined && callAnalysisSetId !== null){
			throw 'Missing required  parameter: callAnalysisSetId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callanalysisresponsesets = self.callanalysisresponsesets || {};

	/**
     * 
     * @method updateDialerResponseset
	 * @memberof outbound/callanalysisresponsesets

	* @param {string} callAnalysisSetId - Call Analysis Response Set ID

	* @param {} body - ResponseSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "responses": {},
   "selfUri": ""
}
	 *
     */
     self.callanalysisresponsesets.updateDialerResponseset = function(callAnalysisSetId, body){
		var path = '/api/v1/outbound/callanalysisresponsesets/{callAnalysisSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callAnalysisSetId}', callAnalysisSetId);

        if(callAnalysisSetId === undefined && callAnalysisSetId !== null){
			throw 'Missing required  parameter: callAnalysisSetId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callanalysisresponsesets = self.callanalysisresponsesets || {};

	/**
     * 
     * @method deleteDialerResponseset
	 * @memberof outbound/callanalysisresponsesets

	* @param {string} callAnalysisSetId - Call Analysis Response Set ID
	 *
     */
     self.callanalysisresponsesets.deleteDialerResponseset = function(callAnalysisSetId){
		var path = '/api/v1/outbound/callanalysisresponsesets/{callAnalysisSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{callAnalysisSetId}', callAnalysisSetId);

        if(callAnalysisSetId === undefined && callAnalysisSetId !== null){
			throw 'Missing required  parameter: callAnalysisSetId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};

	/**
     * 
     * @method queryDialerCampaigns
	 * @memberof outbound/campaigns

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} contactListId - Contact List ID

	* @param {string} dncListId - DNC list ID

	* @param {string} distributionQueueId - Distribution queue ID

	* @param {string} edgeGroupId - Edge group ID

	* @param {string} callAnalysisResponseSetId - Call analysis response set ID

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.campaigns.queryDialerCampaigns = function(pageSize, pageNumber, filterType, name, contactListId, dncListId, distributionQueueId, edgeGroupId, callAnalysisResponseSetId, sortBy, sortOrder){
		var path = '/api/v1/outbound/campaigns';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(contactListId !== undefined && contactListId !== null){
			queryParameters.contactListId = contactListId;
		}


		if(dncListId !== undefined && dncListId !== null){
			queryParameters.dncListId = dncListId;
		}


		if(distributionQueueId !== undefined && distributionQueueId !== null){
			queryParameters.distributionQueueId = distributionQueueId;
		}


		if(edgeGroupId !== undefined && edgeGroupId !== null){
			queryParameters.edgeGroupId = edgeGroupId;
		}


		if(callAnalysisResponseSetId !== undefined && callAnalysisResponseSetId !== null){
			queryParameters.callAnalysisResponseSetId = callAnalysisResponseSetId;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};

	/**
     * 
     * @method createDialerCampaign
	 * @memberof outbound/campaigns

	* @param {} body - Campaign
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "selfUri": "",
   "phoneNumberColumns": [],
   "skipPreviewDisabled": true,
   "previewTimeOutSeconds": 0
}
	 *
     */
     self.campaigns.createDialerCampaign = function(body){
		var path = '/api/v1/outbound/campaigns';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};

	/**
     * 
     * @method getDialerCampaign
	 * @memberof outbound/campaigns

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.campaigns.getDialerCampaign = function(campaignId){
		var path = '/api/v1/outbound/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};

	/**
     * 
     * @method updateDialerCampaign
	 * @memberof outbound/campaigns

	* @param {string} campaignId - Campaign ID

	* @param {} body - Campaign
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "selfUri": "",
   "phoneNumberColumns": [],
   "skipPreviewDisabled": true,
   "previewTimeOutSeconds": 0
}
	 *
     */
     self.campaigns.updateDialerCampaign = function(campaignId, body){
		var path = '/api/v1/outbound/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};

	/**
     * 
     * @method deleteDialerCampaign
	 * @memberof outbound/campaigns

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.campaigns.deleteDialerCampaign = function(campaignId){
		var path = '/api/v1/outbound/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};
	self.campaigns.agents = self.campaigns.agents || {};

	/**
     * New agent state.
     * @method updateAgent
	 * @memberof outbound/campaigns/agents

	* @param {string} campaignId - Campaign ID

	* @param {string} userId - Agent's user ID

	* @param {} body - agent
	 * @example
	 * Body Example:
	 * {
   "stage": ""
}
	 *
     */
     self.campaigns.agents.updateAgent = function(campaignId, userId, body){
		var path = '/api/v1/outbound/campaigns/{campaignId}/agents/{userId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};
	self.campaigns.callback = self.campaigns.callback || {};
	self.campaigns.callback.schedule = self.campaigns.callback.schedule || {};

	/**
     * 
     * @method scheduleCallback
	 * @memberof outbound/campaigns/callback/schedule

	* @param {string} campaignId - Campaign ID

	* @param {} body - ContactCallbackRequest
	 * @example
	 * Body Example:
	 * {
   "campaignId": "",
   "contactListId": "",
   "contactId": "",
   "phoneColumn": "",
   "schedule": ""
}
	 *
     */
     self.campaigns.callback.schedule.scheduleCallback = function(campaignId, body){
		var path = '/api/v1/outbound/campaigns/{campaignId}/callback/schedule';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};
	self.campaigns.diagnostics = self.campaigns.diagnostics || {};

	/**
     * 
     * @method requestCampaignDiagnostics
	 * @memberof outbound/campaigns/diagnostics

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.campaigns.diagnostics.requestCampaignDiagnostics = function(campaignId){
		var path = '/api/v1/outbound/campaigns/{campaignId}/diagnostics';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.campaigns = self.campaigns || {};
	self.campaigns.stats = self.campaigns.stats || {};

	/**
     * 
     * @method getDialerCampaignStats
	 * @memberof outbound/campaigns/stats

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.campaigns.stats.getDialerCampaignStats = function(campaignId){
		var path = '/api/v1/outbound/campaigns/{campaignId}/stats';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};

	/**
     * 
     * @method queryDialerContactlists
	 * @memberof outbound/contactlists

	* @param {boolean} importStatus - Import status

	* @param {boolean} includeSize - Include size

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.contactlists.queryDialerContactlists = function(importStatus, includeSize, pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/contactlists';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(importStatus !== undefined && importStatus !== null){
			queryParameters.importStatus = importStatus;
		}


		if(includeSize !== undefined && includeSize !== null){
			queryParameters.includeSize = includeSize;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};

	/**
     * 
     * @method createDialerContactlist
	 * @memberof outbound/contactlists

	* @param {} body - ContactList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "columnNames": [],
   "phoneColumns": [],
   "importStatus": {
      "state": "",
      "totalRecords": 0,
      "completedRecords": 0,
      "percentComplete": 0,
      "failureReason": ""
   },
   "previewModeColumnName": "",
   "previewModeAcceptedValues": [],
   "size": 0,
   "selfUri": ""
}
	 *
     */
     self.contactlists.createDialerContactlist = function(body){
		var path = '/api/v1/outbound/contactlists';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.penetrationrates = self.contactlists.penetrationrates || {};

	/**
     * 
     * @method getPenetrationRates
	 * @memberof outbound/contactlists/penetrationrates

	* @param {} body - PenetrationRateIdentifierList
	 *
     */
     self.contactlists.penetrationrates.getPenetrationRates = function(body){
		var path = '/api/v1/outbound/contactlists/penetrationrates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};

	/**
     * 
     * @method getDialerContactlist
	 * @memberof outbound/contactlists

	* @param {string} contactListId - ContactList ID

	* @param {boolean} importStatus - Import status

	* @param {boolean} includeSize - Include size
	 *
     */
     self.contactlists.getDialerContactlist = function(contactListId, importStatus, includeSize){
		var path = '/api/v1/outbound/contactlists/{contactListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }


		if(importStatus !== undefined && importStatus !== null){
			queryParameters.importStatus = importStatus;
		}


		if(includeSize !== undefined && includeSize !== null){
			queryParameters.includeSize = includeSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};

	/**
     * 
     * @method updateDialerContactlist
	 * @memberof outbound/contactlists

	* @param {string} contactListId - ContactList ID

	* @param {} body - ContactList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "columnNames": [],
   "phoneColumns": [],
   "importStatus": {
      "state": "",
      "totalRecords": 0,
      "completedRecords": 0,
      "percentComplete": 0,
      "failureReason": ""
   },
   "previewModeColumnName": "",
   "previewModeAcceptedValues": [],
   "size": 0,
   "selfUri": ""
}
	 *
     */
     self.contactlists.updateDialerContactlist = function(contactListId, body){
		var path = '/api/v1/outbound/contactlists/{contactListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};

	/**
     * 
     * @method deleteDialerContactList
	 * @memberof outbound/contactlists

	* @param {string} contactListId - ContactList ID
	 *
     */
     self.contactlists.deleteDialerContactList = function(contactListId){
		var path = '/api/v1/outbound/contactlists/{contactListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.contacts = self.contactlists.contacts || {};

	/**
     * 
     * @method createDialerContacts
	 * @memberof outbound/contactlists/contacts

	* @param {string} contactListId - Contact List ID

	* @param {} body - Contact

	* @param {boolean} priority - 
	 *
     */
     self.contactlists.contacts.createDialerContacts = function(contactListId, body, priority){
		var path = '/api/v1/outbound/contactlists/{contactListId}/contacts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(priority !== undefined && priority !== null){
			queryParameters.priority = priority;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.contacts = self.contactlists.contacts || {};

	/**
     * 
     * @method getDialerContact
	 * @memberof outbound/contactlists/contacts

	* @param {string} contactListId - Contact List ID

	* @param {string} contactId - Contact ID
	 *
     */
     self.contactlists.contacts.getDialerContact = function(contactListId, contactId){
		var path = '/api/v1/outbound/contactlists/{contactListId}/contacts/{contactId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        path = path.replace('{contactId}', contactId);

        if(contactId === undefined && contactId !== null){
			throw 'Missing required  parameter: contactId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.contacts = self.contactlists.contacts || {};

	/**
     * 
     * @method updateDialerContact
	 * @memberof outbound/contactlists/contacts

	* @param {string} contactListId - Contact List ID

	* @param {string} contactId - Contact ID

	* @param {} body - Contact
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "contactListId": "",
   "data": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "callRecords": {},
   "callable": true,
   "phoneNumberStatus": {},
   "selfUri": ""
}
	 *
     */
     self.contactlists.contacts.updateDialerContact = function(contactListId, contactId, body){
		var path = '/api/v1/outbound/contactlists/{contactListId}/contacts/{contactId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        path = path.replace('{contactId}', contactId);

        if(contactId === undefined && contactId !== null){
			throw 'Missing required  parameter: contactId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.contacts = self.contactlists.contacts || {};

	/**
     * 
     * @method deleteDialerContact
	 * @memberof outbound/contactlists/contacts

	* @param {string} contactListId - Contact List ID

	* @param {string} contactId - Contact ID
	 *
     */
     self.contactlists.contacts.deleteDialerContact = function(contactListId, contactId){
		var path = '/api/v1/outbound/contactlists/{contactListId}/contacts/{contactId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        path = path.replace('{contactId}', contactId);

        if(contactId === undefined && contactId !== null){
			throw 'Missing required  parameter: contactId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.export = self.contactlists.export || {};

	/**
     * Returns 200 if received OK.
     * @method exportContactList
	 * @memberof outbound/contactlists/export

	* @param {string} contactListId - ContactList ID
	 *
     */
     self.contactlists.export.exportContactList = function(contactListId){
		var path = '/api/v1/outbound/contactlists/{contactListId}/export';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.importstatus = self.contactlists.importstatus || {};

	/**
     * 
     * @method getDialerContactlistImportStatus
	 * @memberof outbound/contactlists/importstatus

	* @param {string} contactListId - ContactList ID
	 *
     */
     self.contactlists.importstatus.getDialerContactlistImportStatus = function(contactListId){
		var path = '/api/v1/outbound/contactlists/{contactListId}/importstatus';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactlists = self.contactlists || {};
	self.contactlists.penetrationrate = self.contactlists.penetrationrate || {};

	/**
     * Get dialer campaign's penetration rate.
     * @method getDialerCampaignsPenetrationRate
	 * @memberof outbound/contactlists/penetrationrate

	* @param {string} contactListId - ContactList ID

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.contactlists.penetrationrate.getDialerCampaignsPenetrationRate = function(contactListId, campaignId){
		var path = '/api/v1/outbound/contactlists/{contactListId}/{campaignId}/penetrationrate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{contactListId}', contactListId);

        if(contactListId === undefined && contactListId !== null){
			throw 'Missing required  parameter: contactListId';
        }

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.dnc = self.conversations.dnc || {};

	/**
     * 
     * @method addCurrentPhoneNumberToDncList
	 * @memberof outbound/conversations/dnc

	* @param {string} conversationId - Conversation ID
	 *
     */
     self.conversations.dnc.addCurrentPhoneNumberToDncList = function(conversationId){
		var path = '/api/v1/outbound/conversations/{conversationId}/dnc';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};

	/**
     * 
     * @method queryDialerDncLists
	 * @memberof outbound/dnclists

	* @param {boolean} importStatus - Import status

	* @param {boolean} includeSize - Include size

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.dnclists.queryDialerDncLists = function(importStatus, includeSize, pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/dnclists';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(importStatus !== undefined && importStatus !== null){
			queryParameters.importStatus = importStatus;
		}


		if(includeSize !== undefined && includeSize !== null){
			queryParameters.includeSize = includeSize;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};

	/**
     * 
     * @method createDialerDncList
	 * @memberof outbound/dnclists

	* @param {} body - DncList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "phoneNumberColumns": [],
   "importStatus": {
      "state": "",
      "totalRecords": 0,
      "completedRecords": 0,
      "percentComplete": 0,
      "failureReason": ""
   },
   "fileKey": "",
   "size": 0,
   "selfUri": ""
}
	 *
     */
     self.dnclists.createDialerDncList = function(body){
		var path = '/api/v1/outbound/dnclists';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};

	/**
     * 
     * @method getDialerDncList
	 * @memberof outbound/dnclists

	* @param {string} dncListId - DncList ID

	* @param {boolean} importStatus - Import status

	* @param {boolean} includeSize - Include size
	 *
     */
     self.dnclists.getDialerDncList = function(dncListId, importStatus, includeSize){
		var path = '/api/v1/outbound/dnclists/{dncListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }


		if(importStatus !== undefined && importStatus !== null){
			queryParameters.importStatus = importStatus;
		}


		if(includeSize !== undefined && includeSize !== null){
			queryParameters.includeSize = includeSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};

	/**
     * 
     * @method updateDialerDncList
	 * @memberof outbound/dnclists

	* @param {string} dncListId - DncList ID

	* @param {} body - DncList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "phoneNumberColumns": [],
   "importStatus": {
      "state": "",
      "totalRecords": 0,
      "completedRecords": 0,
      "percentComplete": 0,
      "failureReason": ""
   },
   "fileKey": "",
   "size": 0,
   "selfUri": ""
}
	 *
     */
     self.dnclists.updateDialerDncList = function(dncListId, body){
		var path = '/api/v1/outbound/dnclists/{dncListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};

	/**
     * 
     * @method deleteDialerDncList
	 * @memberof outbound/dnclists

	* @param {string} dncListId - DncList ID
	 *
     */
     self.dnclists.deleteDialerDncList = function(dncListId){
		var path = '/api/v1/outbound/dnclists/{dncListId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};
	self.dnclists.export = self.dnclists.export || {};

	/**
     * Returns 200 if received OK.
     * @method exportDncList
	 * @memberof outbound/dnclists/export

	* @param {string} dncListId - DncList ID
	 *
     */
     self.dnclists.export.exportDncList = function(dncListId){
		var path = '/api/v1/outbound/dnclists/{dncListId}/export';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};
	self.dnclists.importstatus = self.dnclists.importstatus || {};

	/**
     * 
     * @method getDialerDnclistImportStatus
	 * @memberof outbound/dnclists/importstatus

	* @param {string} dncListId - DncList ID
	 *
     */
     self.dnclists.importstatus.getDialerDnclistImportStatus = function(dncListId){
		var path = '/api/v1/outbound/dnclists/{dncListId}/importstatus';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dnclists = self.dnclists || {};
	self.dnclists.phonenumbers = self.dnclists.phonenumbers || {};

	/**
     * 
     * @method addDialerDncListPhoneNumber
	 * @memberof outbound/dnclists/phonenumbers

	* @param {string} dncListId - DncList ID

	* @param {} body - DNC Phone Numbers
	 *
     */
     self.dnclists.phonenumbers.addDialerDncListPhoneNumber = function(dncListId, body){
		var path = '/api/v1/outbound/dnclists/{dncListId}/phonenumbers';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{dncListId}', dncListId);

        if(dncListId === undefined && dncListId !== null){
			throw 'Missing required  parameter: dncListId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.previews = self.previews || {};

	/**
     * 
     * @method getUserDialerPreview
	 * @memberof outbound/previews
	 *
     */
     self.previews.getUserDialerPreview = function(){
		var path = '/api/v1/outbound/previews';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.previews = self.previews || {};

	/**
     * 
     * @method getDialerPreview
	 * @memberof outbound/previews

	* @param {string} previewId - preview ID
	 *
     */
     self.previews.getDialerPreview = function(previewId){
		var path = '/api/v1/outbound/previews/{previewId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{previewId}', previewId);

        if(previewId === undefined && previewId !== null){
			throw 'Missing required  parameter: previewId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.previews = self.previews || {};
	self.previews.dispositioncall = self.previews.dispositioncall || {};

	/**
     * 
     * @method dispositionPreviewCall
	 * @memberof outbound/previews/dispositioncall

	* @param {string} previewId - preview ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "callId": "",
   "wrapupCodeId": "",
   "contact": {
      "id": "",
      "name": "",
      "contactListId": "",
      "data": {},
      "callRecords": {},
      "callable": true,
      "phoneNumberStatus": {},
      "selfUri": ""
   }
}
	 *
     */
     self.previews.dispositioncall.dispositionPreviewCall = function(previewId, body){
		var path = '/api/v1/outbound/previews/{previewId}/dispositioncall';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{previewId}', previewId);

        if(previewId === undefined && previewId !== null){
			throw 'Missing required  parameter: previewId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.previews = self.previews || {};
	self.previews.placecall = self.previews.placecall || {};

	/**
     * 
     * @method placePreviewCall
	 * @memberof outbound/previews/placecall

	* @param {string} previewId - preview ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "callId": "",
   "phoneNumber": ""
}
	 *
     */
     self.previews.placecall.placePreviewCall = function(previewId, body){
		var path = '/api/v1/outbound/previews/{previewId}/placecall';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{previewId}', previewId);

        if(previewId === undefined && previewId !== null){
			throw 'Missing required  parameter: previewId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rulesets = self.rulesets || {};

	/**
     * 
     * @method queryRuleSets
	 * @memberof outbound/rulesets

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.rulesets.queryRuleSets = function(pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/rulesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rulesets = self.rulesets || {};

	/**
     * 
     * @method createDialerRuleset
	 * @memberof outbound/rulesets

	* @param {} body - RuleSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "contactList": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "queue": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "rules": [],
   "selfUri": ""
}
	 *
     */
     self.rulesets.createDialerRuleset = function(body){
		var path = '/api/v1/outbound/rulesets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rulesets = self.rulesets || {};

	/**
     * 
     * @method getARuleSetById
	 * @memberof outbound/rulesets

	* @param {string} ruleSetId - Rule Set ID
	 *
     */
     self.rulesets.getARuleSetById = function(ruleSetId){
		var path = '/api/v1/outbound/rulesets/{ruleSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleSetId}', ruleSetId);

        if(ruleSetId === undefined && ruleSetId !== null){
			throw 'Missing required  parameter: ruleSetId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rulesets = self.rulesets || {};

	/**
     * 
     * @method updateARuleset
	 * @memberof outbound/rulesets

	* @param {string} ruleSetId - Rule Set ID

	* @param {} body - RuleSet
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "contactList": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "queue": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "rules": [],
   "selfUri": ""
}
	 *
     */
     self.rulesets.updateARuleset = function(ruleSetId, body){
		var path = '/api/v1/outbound/rulesets/{ruleSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleSetId}', ruleSetId);

        if(ruleSetId === undefined && ruleSetId !== null){
			throw 'Missing required  parameter: ruleSetId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rulesets = self.rulesets || {};

	/**
     * 
     * @method deleteARuleSet
	 * @memberof outbound/rulesets

	* @param {string} ruleSetId - Rule Set ID
	 *
     */
     self.rulesets.deleteARuleSet = function(ruleSetId){
		var path = '/api/v1/outbound/rulesets/{ruleSetId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ruleSetId}', ruleSetId);

        if(ruleSetId === undefined && ruleSetId !== null){
			throw 'Missing required  parameter: ruleSetId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.campaigns = self.schedules.campaigns || {};

	/**
     * 
     * @method queryDialerCampaignSchedules
	 * @memberof outbound/schedules/campaigns
	 *
     */
     self.schedules.campaigns.queryDialerCampaignSchedules = function(){
		var path = '/api/v1/outbound/schedules/campaigns';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.campaigns = self.schedules.campaigns || {};

	/**
     * 
     * @method getDialerCampaignSchedule
	 * @memberof outbound/schedules/campaigns

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.schedules.campaigns.getDialerCampaignSchedule = function(campaignId){
		var path = '/api/v1/outbound/schedules/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.campaigns = self.schedules.campaigns || {};

	/**
     * 
     * @method updateDialerCampaignSchedule
	 * @memberof outbound/schedules/campaigns

	* @param {string} campaignId - Campaign ID

	* @param {} body - CampaignSchedule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "intervals": [],
   "timeZone": "",
   "campaign": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.schedules.campaigns.updateDialerCampaignSchedule = function(campaignId, body){
		var path = '/api/v1/outbound/schedules/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.campaigns = self.schedules.campaigns || {};

	/**
     * 
     * @method deleteDialerCampaignSchedule
	 * @memberof outbound/schedules/campaigns

	* @param {string} campaignId - Campaign ID
	 *
     */
     self.schedules.campaigns.deleteDialerCampaignSchedule = function(campaignId){
		var path = '/api/v1/outbound/schedules/campaigns/{campaignId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{campaignId}', campaignId);

        if(campaignId === undefined && campaignId !== null){
			throw 'Missing required  parameter: campaignId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.sequences = self.schedules.sequences || {};

	/**
     * 
     * @method queryDialerSequenceSchedules
	 * @memberof outbound/schedules/sequences
	 *
     */
     self.schedules.sequences.queryDialerSequenceSchedules = function(){
		var path = '/api/v1/outbound/schedules/sequences';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.sequences = self.schedules.sequences || {};

	/**
     * 
     * @method getDialerSequenceSchedule
	 * @memberof outbound/schedules/sequences

	* @param {string} sequenceId - Sequence ID
	 *
     */
     self.schedules.sequences.getDialerSequenceSchedule = function(sequenceId){
		var path = '/api/v1/outbound/schedules/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.sequences = self.schedules.sequences || {};

	/**
     * 
     * @method updateDialerSequenceSchedule
	 * @memberof outbound/schedules/sequences

	* @param {string} sequenceId - Sequence ID

	* @param {} body - SequenceSchedule
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "intervals": [],
   "timeZone": "",
   "sequence": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.schedules.sequences.updateDialerSequenceSchedule = function(sequenceId, body){
		var path = '/api/v1/outbound/schedules/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};
	self.schedules.sequences = self.schedules.sequences || {};

	/**
     * 
     * @method deleteDialerSequenceSchedule
	 * @memberof outbound/schedules/sequences

	* @param {string} sequenceId - Sequence ID
	 *
     */
     self.schedules.sequences.deleteDialerSequenceSchedule = function(sequenceId){
		var path = '/api/v1/outbound/schedules/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sequences = self.sequences || {};

	/**
     * 
     * @method queryDialerCampaignSequences
	 * @memberof outbound/sequences

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} filterType - Filter type
	EQUALS,
	REGEX,
	CONTAINS,
	PREFIX,
	LESSTHAN,
	LESSTHANEQUALTO,
	GREATERTHAN,
	GREATERTHANEQUALTO,
	BEGINSWITH,
	ENDSWITH,

	* @param {string} name - Name

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	ascending,
	descending,
	 *
     */
     self.sequences.queryDialerCampaignSequences = function(pageSize, pageNumber, filterType, name, sortBy, sortOrder){
		var path = '/api/v1/outbound/sequences';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(filterType !== undefined && filterType !== null){
			queryParameters.filterType = filterType;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sequences = self.sequences || {};

	/**
     * 
     * @method createDialerCampaignSequence
	 * @memberof outbound/sequences

	* @param {} body - Organization
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "campaigns": [],
   "currentCampaign": 0,
   "status": "",
   "stopMessage": "",
   "selfUri": ""
}
	 *
     */
     self.sequences.createDialerCampaignSequence = function(body){
		var path = '/api/v1/outbound/sequences';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sequences = self.sequences || {};

	/**
     * 
     * @method getDialerCampaignSequence
	 * @memberof outbound/sequences

	* @param {string} sequenceId - Campaign Sequence ID
	 *
     */
     self.sequences.getDialerCampaignSequence = function(sequenceId){
		var path = '/api/v1/outbound/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sequences = self.sequences || {};

	/**
     * 
     * @method updateDialerCampaignSequence
	 * @memberof outbound/sequences

	* @param {string} sequenceId - Campaign Sequence ID

	* @param {} body - Organization
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "campaigns": [],
   "currentCampaign": 0,
   "status": "",
   "stopMessage": "",
   "selfUri": ""
}
	 *
     */
     self.sequences.updateDialerCampaignSequence = function(sequenceId, body){
		var path = '/api/v1/outbound/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.sequences = self.sequences || {};

	/**
     * 
     * @method deleteDialerCampaignSequence
	 * @memberof outbound/sequences

	* @param {string} sequenceId - Campaign Sequence ID
	 *
     */
     self.sequences.deleteDialerCampaignSequence = function(sequenceId){
		var path = '/api/v1/outbound/sequences/{sequenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sequenceId}', sequenceId);

        if(sequenceId === undefined && sequenceId !== null){
			throw 'Missing required  parameter: sequenceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodemappings = self.wrapupcodemappings || {};

	/**
     * 
     * @method getDialerWrapupCodeMapping
	 * @memberof outbound/wrapupcodemappings
	 *
     */
     self.wrapupcodemappings.getDialerWrapupCodeMapping = function(){
		var path = '/api/v1/outbound/wrapupcodemappings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodemappings = self.wrapupcodemappings || {};

	/**
     * 
     * @method updateDialerWrapupCodeMapping
	 * @memberof outbound/wrapupcodemappings

	* @param {} body - wrapUpCodeMapping
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "version": 0,
   "defaultSet": [],
   "mapping": {},
   "selfUri": ""
}
	 *
     */
     self.wrapupcodemappings.updateDialerWrapupCodeMapping = function(body){
		var path = '/api/v1/outbound/wrapupcodemappings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.presencedefinitions";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.presencedefinitions = (function (PureCloud) {
	/**
	* @namespace presencedefinitions
	**/

	var self = {};

	/**
     * 
     * @method getOrganizationpresences
	 * @memberof presencedefinitions

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.getOrganizationpresences = function(pageNumber, pageSize){
		var path = '/api/v1/presencedefinitions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createOrganizationpresences
	 * @memberof presencedefinitions

	* @param {} body - The OrganizationPresence to create
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "languageLabels": {},
   "systemPresence": "",
   "deactivated": true,
   "createdBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "createdDate": "",
   "modifiedBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.createOrganizationpresences = function(body){
		var path = '/api/v1/presencedefinitions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getOrganizationpresence
	 * @memberof presencedefinitions

	* @param {string} presenceId - Organization Presence ID
	 *
     */
     self.getOrganizationpresence = function(presenceId){
		var path = '/api/v1/presencedefinitions/{presenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{presenceId}', presenceId);

        if(presenceId === undefined && presenceId !== null){
			throw 'Missing required  parameter: presenceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateOrganizationpresences
	 * @memberof presencedefinitions

	* @param {string} presenceId - Organization Presence ID

	* @param {} body - The OrganizationPresence to update
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "languageLabels": {},
   "systemPresence": "",
   "deactivated": true,
   "createdBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "createdDate": "",
   "modifiedBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.updateOrganizationpresences = function(presenceId, body){
		var path = '/api/v1/presencedefinitions/{presenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{presenceId}', presenceId);

        if(presenceId === undefined && presenceId !== null){
			throw 'Missing required  parameter: presenceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteOrganizationpresences
	 * @memberof presencedefinitions

	* @param {string} presenceId - Organization Presence ID
	 *
     */
     self.deleteOrganizationpresences = function(presenceId){
		var path = '/api/v1/presencedefinitions/{presenceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{presenceId}', presenceId);

        if(presenceId === undefined && presenceId !== null){
			throw 'Missing required  parameter: presenceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.quality";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.quality = (function (PureCloud) {
	/**
	* @namespace quality/agents/activity
	**/
	/**
	* @namespace quality/calibrations
	**/
	/**
	* @namespace quality/conversations/audits
	**/
	/**
	* @namespace quality/conversations/evaluations
	**/
	/**
	* @namespace quality/evaluations/query
	**/
	/**
	* @namespace quality/evaluations/scoring
	**/
	/**
	* @namespace quality/evaluators/activity
	**/
	/**
	* @namespace quality/forms
	**/
	/**
	* @namespace quality/forms/versions
	**/
	/**
	* @namespace quality/publishedforms
	**/

	var self = {};
	self.agents = self.agents || {};
	self.agents.activity = self.agents.activity || {};

	/**
     * Including the number of evaluations and average evaluation score
     * @method getAgentActivity
	 * @memberof quality/agents/activity

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} startTime - Start time of agent activity

	* @param {string} endTime - End time of agent activity

	* @param {array} agentUserId - user id of agent requested

	* @param {string} evaluatorUserId - user id of the evaluator

	* @param {string} name - name
	 *
     */
     self.agents.activity.getAgentActivity = function(pageSize, pageNumber, sortBy, expand, startTime, endTime, agentUserId, evaluatorUserId, name){
		var path = '/api/v1/quality/agents/activity';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(startTime !== undefined && startTime !== null){
			queryParameters.startTime = startTime;
		}


		if(endTime !== undefined && endTime !== null){
			queryParameters.endTime = endTime;
		}


		if(agentUserId !== undefined && agentUserId !== null){
			queryParameters.agentUserId = agentUserId;
		}


		if(evaluatorUserId !== undefined && evaluatorUserId !== null){
			queryParameters.evaluatorUserId = evaluatorUserId;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.calibrations = self.calibrations || {};

	/**
     * 
     * @method getCalibrations
	 * @memberof quality/calibrations

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} conversationId - conversation id

	* @param {string} startTime - Beginning of the calibration query

	* @param {string} endTime - end of the calibration query

	* @param {string} calibratorId - user id of calibrator
	 *
     */
     self.calibrations.getCalibrations = function(pageSize, pageNumber, sortBy, expand, conversationId, startTime, endTime, calibratorId){
		var path = '/api/v1/quality/calibrations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(conversationId !== undefined && conversationId !== null){
			queryParameters.conversationId = conversationId;
		}


		if(startTime !== undefined && startTime !== null){
			queryParameters.startTime = startTime;
		}


		if(endTime !== undefined && endTime !== null){
			queryParameters.endTime = endTime;
		}


		if(calibratorId !== undefined && calibratorId !== null){
			queryParameters.calibratorId = calibratorId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.calibrations = self.calibrations || {};

	/**
     * 
     * @method createCalibration
	 * @memberof quality/calibrations

	* @param {} body - calibration

	* @param {string} expand - calibratorId
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "calibrator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "agent": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "evaluationForm": {
      "id": "",
      "name": "",
      "type": "",
      "modifiedDate": "",
      "published": true,
      "contextId": "",
      "questionGroups": [],
      "publishedVersions": {},
      "selfUri": ""
   },
   "contextId": "",
   "averageScore": 0,
   "highScore": 0,
   "lowScore": 0,
   "createdDate": "",
   "evaluations": [],
   "evaluators": [],
   "scoringIndex": {
      "id": "",
      "name": "",
      "conversation": {},
      "evaluationForm": {},
      "evaluator": {},
      "agent": {},
      "calibration": {},
      "status": "",
      "answers": {},
      "agentHasRead": true,
      "releaseDate": "",
      "assignedDate": "",
      "changedDate": "",
      "queue": {},
      "isScoringIndex": true,
      "selfUri": ""
   },
   "expertEvaluator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.calibrations.createCalibration = function(body, expand){
		var path = '/api/v1/quality/calibrations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.calibrations = self.calibrations || {};

	/**
     * 
     * @method getACalibration
	 * @memberof quality/calibrations

	* @param {string} calibrationId - Calibration ID

	* @param {string} calibratorId - calibratorId
	 *
     */
     self.calibrations.getACalibration = function(calibrationId, calibratorId){
		var path = '/api/v1/quality/calibrations/{calibrationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{calibrationId}', calibrationId);

        if(calibrationId === undefined && calibrationId !== null){
			throw 'Missing required  parameter: calibrationId';
        }


		if(calibratorId !== undefined && calibratorId !== null){
			queryParameters.calibratorId = calibratorId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.calibrations = self.calibrations || {};

	/**
     * 
     * @method updateACalibration
	 * @memberof quality/calibrations

	* @param {string} calibrationId - Calibration ID

	* @param {} body - Calibration
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "calibrator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "agent": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "evaluationForm": {
      "id": "",
      "name": "",
      "type": "",
      "modifiedDate": "",
      "published": true,
      "contextId": "",
      "questionGroups": [],
      "publishedVersions": {},
      "selfUri": ""
   },
   "contextId": "",
   "averageScore": 0,
   "highScore": 0,
   "lowScore": 0,
   "createdDate": "",
   "evaluations": [],
   "evaluators": [],
   "scoringIndex": {
      "id": "",
      "name": "",
      "conversation": {},
      "evaluationForm": {},
      "evaluator": {},
      "agent": {},
      "calibration": {},
      "status": "",
      "answers": {},
      "agentHasRead": true,
      "releaseDate": "",
      "assignedDate": "",
      "changedDate": "",
      "queue": {},
      "isScoringIndex": true,
      "selfUri": ""
   },
   "expertEvaluator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.calibrations.updateACalibration = function(calibrationId, body){
		var path = '/api/v1/quality/calibrations/{calibrationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{calibrationId}', calibrationId);

        if(calibrationId === undefined && calibrationId !== null){
			throw 'Missing required  parameter: calibrationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.calibrations = self.calibrations || {};

	/**
     * 
     * @method deleteCalibration
	 * @memberof quality/calibrations

	* @param {string} calibrationId - Calibration ID

	* @param {string} calibratorId - calibratorId
	 *
     */
     self.calibrations.deleteCalibration = function(calibrationId, calibratorId){
		var path = '/api/v1/quality/calibrations/{calibrationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{calibrationId}', calibrationId);

        if(calibrationId === undefined && calibrationId !== null){
			throw 'Missing required  parameter: calibrationId';
        }


		if(calibratorId !== undefined && calibratorId !== null){
			queryParameters.calibratorId = calibratorId;
		}



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.audits = self.conversations.audits || {};

	/**
     * 
     * @method getConversationAudits
	 * @memberof quality/conversations/audits

	* @param {string} conversationId - Conversation ID

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} recordingId - id of the recording

	* @param {string} entityType - entity type options: Recording, Calibration, Evaluation, Annotation
	 *
     */
     self.conversations.audits.getConversationAudits = function(conversationId, pageSize, pageNumber, sortBy, expand, recordingId, entityType){
		var path = '/api/v1/quality/conversations/{conversationId}/audits';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(recordingId !== undefined && recordingId !== null){
			queryParameters.recordingId = recordingId;
		}


		if(entityType !== undefined && entityType !== null){
			queryParameters.entityType = entityType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.evaluations = self.conversations.evaluations || {};

	/**
     * 
     * @method createEvaluation
	 * @memberof quality/conversations/evaluations

	* @param {string} conversationId - 

	* @param {} body - evaluation

	* @param {string} expand - evaluatorId
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "evaluationForm": {
      "id": "",
      "name": "",
      "type": "",
      "modifiedDate": "",
      "published": true,
      "contextId": "",
      "questionGroups": [],
      "publishedVersions": {},
      "selfUri": ""
   },
   "evaluator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "agent": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "calibration": {
      "id": "",
      "name": "",
      "calibrator": {},
      "agent": {},
      "conversation": {},
      "evaluationForm": {},
      "contextId": "",
      "averageScore": 0,
      "highScore": 0,
      "lowScore": 0,
      "createdDate": "",
      "evaluations": [],
      "evaluators": [],
      "scoringIndex": {},
      "expertEvaluator": {},
      "selfUri": ""
   },
   "status": "",
   "answers": {
      "totalScore": {},
      "totalCriticalScore": {},
      "questionGroupScores": [],
      "anyFailedKillQuestions": true,
      "comments": "",
      "agentComments": ""
   },
   "agentHasRead": true,
   "releaseDate": "",
   "assignedDate": "",
   "changedDate": "",
   "queue": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "wrapupCodes": [],
      "mediaSettings": {},
      "bullseye": {},
      "acwSettings": {},
      "phoneNumber": "",
      "skillEvaluationMethod": "",
      "queueFlow": {},
      "callingPartyName": "",
      "callingPartyNumber": "",
      "memberCount": 0,
      "selfUri": ""
   },
   "isScoringIndex": true,
   "selfUri": ""
}
	 *
     */
     self.conversations.evaluations.createEvaluation = function(conversationId, body, expand){
		var path = '/api/v1/quality/conversations/{conversationId}/evaluations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.evaluations = self.conversations.evaluations || {};

	/**
     * 
     * @method getEvaluation
	 * @memberof quality/conversations/evaluations

	* @param {string} conversationId - 

	* @param {string} evaluationId - 

	* @param {string} expand - agent, evaluator, evaluationForm
	 *
     */
     self.conversations.evaluations.getEvaluation = function(conversationId, evaluationId, expand){
		var path = '/api/v1/quality/conversations/{conversationId}/evaluations/{evaluationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{evaluationId}', evaluationId);

        if(evaluationId === undefined && evaluationId !== null){
			throw 'Missing required  parameter: evaluationId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.evaluations = self.conversations.evaluations || {};

	/**
     * 
     * @method updateEvaluation
	 * @memberof quality/conversations/evaluations

	* @param {string} conversationId - 

	* @param {string} evaluationId - 

	* @param {} body - evaluation

	* @param {string} expand - evaluatorId
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "evaluationForm": {
      "id": "",
      "name": "",
      "type": "",
      "modifiedDate": "",
      "published": true,
      "contextId": "",
      "questionGroups": [],
      "publishedVersions": {},
      "selfUri": ""
   },
   "evaluator": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "agent": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "calibration": {
      "id": "",
      "name": "",
      "calibrator": {},
      "agent": {},
      "conversation": {},
      "evaluationForm": {},
      "contextId": "",
      "averageScore": 0,
      "highScore": 0,
      "lowScore": 0,
      "createdDate": "",
      "evaluations": [],
      "evaluators": [],
      "scoringIndex": {},
      "expertEvaluator": {},
      "selfUri": ""
   },
   "status": "",
   "answers": {
      "totalScore": {},
      "totalCriticalScore": {},
      "questionGroupScores": [],
      "anyFailedKillQuestions": true,
      "comments": "",
      "agentComments": ""
   },
   "agentHasRead": true,
   "releaseDate": "",
   "assignedDate": "",
   "changedDate": "",
   "queue": {
      "id": "",
      "name": "",
      "description": "",
      "version": 0,
      "dateCreated": "",
      "dateModified": "",
      "modifiedBy": "",
      "createdBy": "",
      "state": "",
      "modifiedByApp": "",
      "createdByApp": "",
      "wrapupCodes": [],
      "mediaSettings": {},
      "bullseye": {},
      "acwSettings": {},
      "phoneNumber": "",
      "skillEvaluationMethod": "",
      "queueFlow": {},
      "callingPartyName": "",
      "callingPartyNumber": "",
      "memberCount": 0,
      "selfUri": ""
   },
   "isScoringIndex": true,
   "selfUri": ""
}
	 *
     */
     self.conversations.evaluations.updateEvaluation = function(conversationId, evaluationId, body, expand){
		var path = '/api/v1/quality/conversations/{conversationId}/evaluations/{evaluationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{evaluationId}', evaluationId);

        if(evaluationId === undefined && evaluationId !== null){
			throw 'Missing required  parameter: evaluationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.conversations = self.conversations || {};
	self.conversations.evaluations = self.conversations.evaluations || {};

	/**
     * 
     * @method deleteEvaluation
	 * @memberof quality/conversations/evaluations

	* @param {string} conversationId - 

	* @param {string} evaluationId - 

	* @param {string} expand - evaluatorId
	 *
     */
     self.conversations.evaluations.deleteEvaluation = function(conversationId, evaluationId, expand){
		var path = '/api/v1/quality/conversations/{conversationId}/evaluations/{evaluationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{conversationId}', conversationId);

        if(conversationId === undefined && conversationId !== null){
			throw 'Missing required  parameter: conversationId';
        }

        path = path.replace('{evaluationId}', evaluationId);

        if(evaluationId === undefined && evaluationId !== null){
			throw 'Missing required  parameter: evaluationId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.evaluations = self.evaluations || {};
	self.evaluations.query = self.evaluations.query || {};

	/**
     * Query params must include one of conversationId, evaluatorUserId, or agentUserId
     * @method queryEvaluationsPaged
	 * @memberof quality/evaluations/query

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} conversationId - conversationId specified

	* @param {string} agentUserId - user id of the agent

	* @param {string} evaluatorUserId - evaluator user id

	* @param {string} queueId - queue id

	* @param {string} startTime - start time of the evaluation query

	* @param {string} endTime - end time of the evaluation query

	* @param {array} evaluationState - evaluation state options: Pending, InProgress, Finished

	* @param {boolean} isReleased - the evaluation has been released

	* @param {boolean} agentHasRead - agent has the evaluation

	* @param {boolean} expandAnswerTotalScores - get the total scores for evaluations

	* @param {integer} maximum - maximum
	 *
     */
     self.evaluations.query.queryEvaluationsPaged = function(pageSize, pageNumber, sortBy, expand, conversationId, agentUserId, evaluatorUserId, queueId, startTime, endTime, evaluationState, isReleased, agentHasRead, expandAnswerTotalScores, maximum){
		var path = '/api/v1/quality/evaluations/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(conversationId !== undefined && conversationId !== null){
			queryParameters.conversationId = conversationId;
		}


		if(agentUserId !== undefined && agentUserId !== null){
			queryParameters.agentUserId = agentUserId;
		}


		if(evaluatorUserId !== undefined && evaluatorUserId !== null){
			queryParameters.evaluatorUserId = evaluatorUserId;
		}


		if(queueId !== undefined && queueId !== null){
			queryParameters.queueId = queueId;
		}


		if(startTime !== undefined && startTime !== null){
			queryParameters.startTime = startTime;
		}


		if(endTime !== undefined && endTime !== null){
			queryParameters.endTime = endTime;
		}


		if(evaluationState !== undefined && evaluationState !== null){
			queryParameters.evaluationState = evaluationState;
		}


		if(isReleased !== undefined && isReleased !== null){
			queryParameters.isReleased = isReleased;
		}


		if(agentHasRead !== undefined && agentHasRead !== null){
			queryParameters.agentHasRead = agentHasRead;
		}


		if(expandAnswerTotalScores !== undefined && expandAnswerTotalScores !== null){
			queryParameters.expandAnswerTotalScores = expandAnswerTotalScores;
		}


		if(maximum !== undefined && maximum !== null){
			queryParameters.maximum = maximum;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.evaluations = self.evaluations || {};
	self.evaluations.query = self.evaluations.query || {};

	/**
     * 
     * @method queryEvaluations
	 * @memberof quality/evaluations/query

	* @param {} body - query

	* @param {string} expand - evaluator,agent
	 * @example
	 * Body Example:
	 * {
   "conversationId": "",
   "userType": "",
   "currentUserId": "",
   "agentId": "",
   "queueId": "",
   "interval": "",
   "evaluationState": [],
   "isReleased": true,
   "agentHasRead": true,
   "expandAnswerTotalScores": true,
   "maximum": 0
}
	 *
     */
     self.evaluations.query.queryEvaluations = function(body, expand){
		var path = '/api/v1/quality/evaluations/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.evaluations = self.evaluations || {};
	self.evaluations.scoring = self.evaluations.scoring || {};

	/**
     * 
     * @method scoreEvaluation
	 * @memberof quality/evaluations/scoring

	* @param {} body - evaluationAndScoringSet
	 * @example
	 * Body Example:
	 * {
   "evaluationForm": {
      "id": "",
      "name": "",
      "type": "",
      "modifiedDate": "",
      "published": true,
      "contextId": "",
      "questionGroups": [],
      "publishedVersions": {},
      "selfUri": ""
   },
   "answers": {
      "totalScore": {},
      "totalCriticalScore": {},
      "questionGroupScores": [],
      "anyFailedKillQuestions": true,
      "comments": "",
      "agentComments": ""
   }
}
	 *
     */
     self.evaluations.scoring.scoreEvaluation = function(body){
		var path = '/api/v1/quality/evaluations/scoring';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.evaluators = self.evaluators || {};
	self.evaluators.activity = self.evaluators.activity || {};

	/**
     * 
     * @method getEvaluatorActivity
	 * @memberof quality/evaluators/activity

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} startTime - The start time specified

	* @param {string} endTime - The end time specified

	* @param {string} name - Evaluator name

	* @param {array} permission - permission strings
	 *
     */
     self.evaluators.activity.getEvaluatorActivity = function(pageSize, pageNumber, sortBy, expand, startTime, endTime, name, permission){
		var path = '/api/v1/quality/evaluators/activity';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(startTime !== undefined && startTime !== null){
			queryParameters.startTime = startTime;
		}


		if(endTime !== undefined && endTime !== null){
			queryParameters.endTime = endTime;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(permission !== undefined && permission !== null){
			queryParameters.permission = permission;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};

	/**
     * 
     * @method getEvaluationForms
	 * @memberof quality/forms

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand

	* @param {string} name - Name
	 *
     */
     self.forms.getEvaluationForms = function(pageSize, pageNumber, expand, name){
		var path = '/api/v1/quality/forms';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};

	/**
     * 
     * @method createEvaluationForm
	 * @memberof quality/forms

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "modifiedDate": "",
   "published": true,
   "contextId": "",
   "questionGroups": [],
   "publishedVersions": {
      "pageSize": 0,
      "pageNumber": 0,
      "total": 0,
      "entities": [],
      "selfUri": "",
      "firstUri": "",
      "previousUri": "",
      "nextUri": "",
      "lastUri": "",
      "pageCount": 0
   },
   "selfUri": ""
}
	 *
     */
     self.forms.createEvaluationForm = function(body){
		var path = '/api/v1/quality/forms';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};

	/**
     * 
     * @method getEvaluationForm
	 * @memberof quality/forms

	* @param {string} formId - Form ID
	 *
     */
     self.forms.getEvaluationForm = function(formId){
		var path = '/api/v1/quality/forms/{formId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{formId}', formId);

        if(formId === undefined && formId !== null){
			throw 'Missing required  parameter: formId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};

	/**
     * 
     * @method updateEvaluationForm
	 * @memberof quality/forms

	* @param {string} formId - Form ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "modifiedDate": "",
   "published": true,
   "contextId": "",
   "questionGroups": [],
   "publishedVersions": {
      "pageSize": 0,
      "pageNumber": 0,
      "total": 0,
      "entities": [],
      "selfUri": "",
      "firstUri": "",
      "previousUri": "",
      "nextUri": "",
      "lastUri": "",
      "pageCount": 0
   },
   "selfUri": ""
}
	 *
     */
     self.forms.updateEvaluationForm = function(formId, body){
		var path = '/api/v1/quality/forms/{formId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{formId}', formId);

        if(formId === undefined && formId !== null){
			throw 'Missing required  parameter: formId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};

	/**
     * 
     * @method deleteEvaluationForm
	 * @memberof quality/forms

	* @param {string} formId - Form ID
	 *
     */
     self.forms.deleteEvaluationForm = function(formId){
		var path = '/api/v1/quality/forms/{formId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{formId}', formId);

        if(formId === undefined && formId !== null){
			throw 'Missing required  parameter: formId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.forms = self.forms || {};
	self.forms.versions = self.forms.versions || {};

	/**
     * 
     * @method getEvaluationFormRevisions
	 * @memberof quality/forms/versions

	* @param {string} formId - Form ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.forms.versions.getEvaluationFormRevisions = function(formId, pageSize, pageNumber){
		var path = '/api/v1/quality/forms/{formId}/versions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{formId}', formId);

        if(formId === undefined && formId !== null){
			throw 'Missing required  parameter: formId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.publishedforms = self.publishedforms || {};

	/**
     * 
     * @method getPublishedEvaluationForms
	 * @memberof quality/publishedforms

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name
	 *
     */
     self.publishedforms.getPublishedEvaluationForms = function(pageSize, pageNumber, name){
		var path = '/api/v1/quality/publishedforms';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.publishedforms = self.publishedforms || {};

	/**
     * 
     * @method publishEvaluationForm
	 * @memberof quality/publishedforms

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "modifiedDate": "",
   "published": true,
   "contextId": "",
   "questionGroups": [],
   "publishedVersions": {
      "pageSize": 0,
      "pageNumber": 0,
      "total": 0,
      "entities": [],
      "selfUri": "",
      "firstUri": "",
      "previousUri": "",
      "nextUri": "",
      "lastUri": "",
      "pageCount": 0
   },
   "selfUri": ""
}
	 *
     */
     self.publishedforms.publishEvaluationForm = function(body){
		var path = '/api/v1/quality/publishedforms';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.publishedforms = self.publishedforms || {};

	/**
     * 
     * @method getPublishedEvaluationForms
	 * @memberof quality/publishedforms

	* @param {string} formId - Form ID
	 *
     */
     self.publishedforms.getPublishedEvaluationForms = function(formId){
		var path = '/api/v1/quality/publishedforms/{formId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{formId}', formId);

        if(formId === undefined && formId !== null){
			throw 'Missing required  parameter: formId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.routing";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.routing = (function (PureCloud) {
	/**
	* @namespace routing/email/domains
	**/
	/**
	* @namespace routing/email/domains/routes
	**/
	/**
	* @namespace routing/email/setup
	**/
	/**
	* @namespace routing/queues
	**/
	/**
	* @namespace routing/queues/members
	**/
	/**
	* @namespace routing/queues/users
	**/
	/**
	* @namespace routing/queues/wrapupcodes
	**/
	/**
	* @namespace routing/skills
	**/
	/**
	* @namespace routing/wrapupcodes
	**/

	var self = {};
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};

	/**
     * 
     * @method getDomains
	 * @memberof routing/email/domains
	 *
     */
     self.email.domains.getDomains = function(){
		var path = '/api/v1/routing/email/domains';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};

	/**
     * 
     * @method createADomain
	 * @memberof routing/email/domains

	* @param {} body - Domain
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "mxRecordStatus": "",
   "selfUri": ""
}
	 *
     */
     self.email.domains.createADomain = function(body){
		var path = '/api/v1/routing/email/domains';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};
	self.email.domains.routes = self.email.domains.routes || {};

	/**
     * 
     * @method getRoutes
	 * @memberof routing/email/domains/routes

	* @param {string} domain - email domain
	 *
     */
     self.email.domains.routes.getRoutes = function(domain){
		var path = '/api/v1/routing/email/domains/{domain}/routes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{domain}', domain);

        if(domain === undefined && domain !== null){
			throw 'Missing required  parameter: domain';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};
	self.email.domains.routes = self.email.domains.routes || {};

	/**
     * 
     * @method createARoute
	 * @memberof routing/email/domains/routes

	* @param {string} domain - email domain

	* @param {} body - Route
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "pattern": "",
   "queue": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "priority": 0,
   "skills": [],
   "language": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "fromName": "",
   "fromEmail": "",
   "spamThreshold": {},
   "selfUri": ""
}
	 *
     */
     self.email.domains.routes.createARoute = function(domain, body){
		var path = '/api/v1/routing/email/domains/{domain}/routes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{domain}', domain);

        if(domain === undefined && domain !== null){
			throw 'Missing required  parameter: domain';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};
	self.email.domains.routes = self.email.domains.routes || {};

	/**
     * 
     * @method getARoute
	 * @memberof routing/email/domains/routes

	* @param {string} domain - email domain

	* @param {string} id - route ID
	 *
     */
     self.email.domains.routes.getARoute = function(domain, id){
		var path = '/api/v1/routing/email/domains/{domain}/routes/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{domain}', domain);

        if(domain === undefined && domain !== null){
			throw 'Missing required  parameter: domain';
        }

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};
	self.email.domains.routes = self.email.domains.routes || {};

	/**
     * 
     * @method updateARoute
	 * @memberof routing/email/domains/routes

	* @param {string} domain - email domain

	* @param {string} id - route ID

	* @param {} body - Route
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "pattern": "",
   "queue": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "priority": 0,
   "skills": [],
   "language": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "fromName": "",
   "fromEmail": "",
   "spamThreshold": {},
   "selfUri": ""
}
	 *
     */
     self.email.domains.routes.updateARoute = function(domain, id, body){
		var path = '/api/v1/routing/email/domains/{domain}/routes/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{domain}', domain);

        if(domain === undefined && domain !== null){
			throw 'Missing required  parameter: domain';
        }

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};
	self.email.domains.routes = self.email.domains.routes || {};

	/**
     * 
     * @method deleteARoute
	 * @memberof routing/email/domains/routes

	* @param {string} domain - email domain

	* @param {string} id - route ID
	 *
     */
     self.email.domains.routes.deleteARoute = function(domain, id){
		var path = '/api/v1/routing/email/domains/{domain}/routes/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{domain}', domain);

        if(domain === undefined && domain !== null){
			throw 'Missing required  parameter: domain';
        }

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.domains = self.email.domains || {};

	/**
     * 
     * @method deleteADomain
	 * @memberof routing/email/domains

	* @param {string} id - domain ID
	 *
     */
     self.email.domains.deleteADomain = function(id){
		var path = '/api/v1/routing/email/domains/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.email = self.email || {};
	self.email.setup = self.email.setup || {};

	/**
     * 
     * @method getEmailSetup
	 * @memberof routing/email/setup
	 *
     */
     self.email.setup.getEmailSetup = function(){
		var path = '/api/v1/routing/email/setup';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method getQueues
	 * @memberof routing/queues

	* @param {string} QueueId - Queue ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} name - Name

	* @param {boolean} active - Active
	 *
     */
     self.queues.getQueues = function(QueueId, pageSize, pageNumber, sortBy, name, active){
		var path = '/api/v1/routing/queues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{QueueId}', QueueId);

        if(QueueId === undefined && QueueId !== null){
			throw 'Missing required  parameter: QueueId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(active !== undefined && active !== null){
			queryParameters.active = active;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method createQueue
	 * @memberof routing/queues

	* @param {string} QueueId - Queue ID

	* @param {} body - Queue
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "wrapupCodes": [],
   "mediaSettings": {},
   "bullseye": {
      "rings": []
   },
   "acwSettings": {
      "wrapupPrompt": "",
      "timeoutMs": 0
   },
   "phoneNumber": "",
   "skillEvaluationMethod": "",
   "queueFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "callingPartyName": "",
   "callingPartyNumber": "",
   "memberCount": 0,
   "selfUri": ""
}
	 *
     */
     self.queues.createQueue = function(QueueId, body){
		var path = '/api/v1/routing/queues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{QueueId}', QueueId);

        if(QueueId === undefined && QueueId !== null){
			throw 'Missing required  parameter: QueueId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method getQueue
	 * @memberof routing/queues

	* @param {string} queueId - Queue ID
	 *
     */
     self.queues.getQueue = function(queueId){
		var path = '/api/v1/routing/queues/{queueId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method updateQueue
	 * @memberof routing/queues

	* @param {string} queueId - Queue ID

	* @param {} body - Queue
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "wrapupCodes": [],
   "mediaSettings": {},
   "bullseye": {
      "rings": []
   },
   "acwSettings": {
      "wrapupPrompt": "",
      "timeoutMs": 0
   },
   "phoneNumber": "",
   "skillEvaluationMethod": "",
   "queueFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "callingPartyName": "",
   "callingPartyNumber": "",
   "memberCount": 0,
   "selfUri": ""
}
	 *
     */
     self.queues.updateQueue = function(queueId, body){
		var path = '/api/v1/routing/queues/{queueId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method deleteQueue
	 * @memberof routing/queues

	* @param {string} queueId - Queue ID
	 *
     */
     self.queues.deleteQueue = function(queueId){
		var path = '/api/v1/routing/queues/{queueId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.members = self.queues.members || {};

	/**
     * Get the list of members of a queue
     * @method getMembers
	 * @memberof routing/queues/members

	* @param {string} queueId - 

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} userId - UserID

	* @param {string} statusId - Status ID

	* @param {boolean} joined - Joined

	* @param {string} expand - expand
	routingStatus,
	 *
     */
     self.queues.members.getMembers = function(queueId, pageSize, pageNumber, userId, statusId, joined, expand){
		var path = '/api/v1/routing/queues/{queueId}/members';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(userId !== undefined && userId !== null){
			queryParameters.userId = userId;
		}


		if(statusId !== undefined && statusId !== null){
			queryParameters.statusId = statusId;
		}


		if(joined !== undefined && joined !== null){
			queryParameters.joined = joined;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.members = self.queues.members || {};

	/**
     * 
     * @method joinunjoinQueue
	 * @memberof routing/queues/members

	* @param {string} queueId - Queue ID

	* @param {string} memberId - Member/User ID

	* @param {} body - To join queue ~ "joined":true
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "ringNumber": 0,
   "joined": true,
   "memberBy": "",
   "routingStatus": {
      "userId": "",
      "status": "",
      "startTime": ""
   },
   "selfUri": ""
}
	 *
     */
     self.queues.members.joinunjoinQueue = function(queueId, memberId, body){
		var path = '/api/v1/routing/queues/{queueId}/members/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.users = self.queues.users || {};

	/**
     * 
     * @method getQueueMembers
	 * @memberof routing/queues/users

	* @param {string} queueId - Queue ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} expand - expand

	* @param {boolean} directMembers - Only get users that are direct members of the queue
	 *
     */
     self.queues.users.getQueueMembers = function(queueId, pageSize, pageNumber, sortBy, expand, directMembers){
		var path = '/api/v1/routing/queues/{queueId}/users';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(directMembers !== undefined && directMembers !== null){
			queryParameters.directMembers = directMembers;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.users = self.queues.users || {};

	/**
     * 
     * @method addQueueMembers
	 * @memberof routing/queues/users

	* @param {string} queueId - Queue ID

	* @param {} body - Queue Members

	* @param {boolean} doDelete - True to delete queue members
	 *
     */
     self.queues.users.addQueueMembers = function(queueId, body, doDelete){
		var path = '/api/v1/routing/queues/{queueId}/users';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(doDelete !== undefined && doDelete !== null){
			queryParameters.delete = doDelete;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.users = self.queues.users || {};

	/**
     * 
     * @method updateUsersInQueue
	 * @memberof routing/queues/users

	* @param {string} queueId - Queue ID

	* @param {} body - Queue Members
	 *
     */
     self.queues.users.updateUsersInQueue = function(queueId, body){
		var path = '/api/v1/routing/queues/{queueId}/users';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.users = self.queues.users || {};

	/**
     * 
     * @method deleteQueueMember
	 * @memberof routing/queues/users

	* @param {string} queueId - Queue ID

	* @param {string} memberId - Member ID
	 *
     */
     self.queues.users.deleteQueueMember = function(queueId, memberId){
		var path = '/api/v1/routing/queues/{queueId}/users/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.users = self.queues.users || {};

	/**
     * 
     * @method patchQueueMember
	 * @memberof routing/queues/users

	* @param {string} queueId - Queue ID

	* @param {string} memberId - Member ID

	* @param {} body - Queue Member
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "ringNumber": 0,
   "joined": true,
   "memberBy": "",
   "routingStatus": {
      "userId": "",
      "status": "",
      "startTime": ""
   },
   "selfUri": ""
}
	 *
     */
     self.queues.users.patchQueueMember = function(queueId, memberId, body){
		var path = '/api/v1/routing/queues/{queueId}/users/{memberId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{memberId}', memberId);

        if(memberId === undefined && memberId !== null){
			throw 'Missing required  parameter: memberId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.wrapupcodes = self.queues.wrapupcodes || {};

	/**
     * 
     * @method getWrapupCodes
	 * @memberof routing/queues/wrapupcodes

	* @param {string} queueId - Queue ID

	* @param {string} codeId - Code ID
	 *
     */
     self.queues.wrapupcodes.getWrapupCodes = function(queueId, codeId){
		var path = '/api/v1/routing/queues/{queueId}/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.wrapupcodes = self.queues.wrapupcodes || {};

	/**
     * 
     * @method addWrapupCodes
	 * @memberof routing/queues/wrapupcodes

	* @param {string} queueId - Queue ID

	* @param {string} codeId - Code ID

	* @param {} body - 
	 *
     */
     self.queues.wrapupcodes.addWrapupCodes = function(queueId, codeId, body){
		var path = '/api/v1/routing/queues/{queueId}/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};
	self.queues.wrapupcodes = self.queues.wrapupcodes || {};

	/**
     * 
     * @method deleteWrapupCode
	 * @memberof routing/queues/wrapupcodes

	* @param {string} queueId - Queue ID

	* @param {string} codeId - Code ID
	 *
     */
     self.queues.wrapupcodes.deleteWrapupCode = function(queueId, codeId){
		var path = '/api/v1/routing/queues/{queueId}/wrapupcodes/{codeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.skills = self.skills || {};

	/**
     * 
     * @method getSkills
	 * @memberof routing/skills

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} name - Name
	 *
     */
     self.skills.getSkills = function(pageSize, pageNumber, sortBy, name){
		var path = '/api/v1/routing/skills';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method getWrapupCodes
	 * @memberof routing/wrapupcodes

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by
	 *
     */
     self.wrapupcodes.getWrapupCodes = function(pageSize, pageNumber, sortBy){
		var path = '/api/v1/routing/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method createWrapupCode
	 * @memberof routing/wrapupcodes

	* @param {} body - WrapupCode
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "selfUri": ""
}
	 *
     */
     self.wrapupcodes.createWrapupCode = function(body){
		var path = '/api/v1/routing/wrapupcodes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method getWrapupCode
	 * @memberof routing/wrapupcodes

	* @param {string} codeId - Wrapup Code ID
	 *
     */
     self.wrapupcodes.getWrapupCode = function(codeId){
		var path = '/api/v1/routing/wrapupcodes/{codeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method updateWrapupCode
	 * @memberof routing/wrapupcodes

	* @param {string} codeId - Wrapup Code ID

	* @param {} body - WrapupCode
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "selfUri": ""
}
	 *
     */
     self.wrapupcodes.updateWrapupCode = function(codeId, body){
		var path = '/api/v1/routing/wrapupcodes/{codeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.wrapupcodes = self.wrapupcodes || {};

	/**
     * 
     * @method deleteWrapupCode
	 * @memberof routing/wrapupcodes

	* @param {string} codeId - Wrapup Code ID
	 *
     */
     self.wrapupcodes.deleteWrapupCode = function(codeId){
		var path = '/api/v1/routing/wrapupcodes/{codeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{codeId}', codeId);

        if(codeId === undefined && codeId !== null){
			throw 'Missing required  parameter: codeId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.scripts";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.scripts = (function (PureCloud) {
	/**
	* @namespace scripts
	**/

	var self = {};

	/**
     * 
     * @method getScripts
	 * @memberof scripts

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand

	* @param {string} name - Name

	* @param {string} feature - Feature
	 *
     */
     self.getScripts = function(pageSize, pageNumber, expand, name, feature){
		var path = '/api/v1/scripts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(feature !== undefined && feature !== null){
			queryParameters.feature = feature;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createScript
	 * @memberof scripts

	* @param {} body - 
	 *
     */
     self.createScript = function(body){
		var path = '/api/v1/scripts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.search";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.search = (function (PureCloud) {
	/**
	* @namespace search/chats
	**/

	var self = {};
	self.chats = self.chats || {};

	/**
     * 
     * @method searchChatHistory
	 * @memberof search/chats

	* @param {} body - Search request options
	 * @example
	 * Body Example:
	 * {
   "query": "",
   "order": "",
   "targetJids": [],
   "pageSize": 0,
   "pageNumber": 0,
   "fromDate": "",
   "toDate": "",
   "expand": ""
}
	 *
     */
     self.chats.searchChatHistory = function(body){
		var path = '/api/v1/search/chats';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.stations";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.stations = (function (PureCloud) {
	/**
	* @namespace stations
	**/
	/**
	* @namespace stations/associateduser
	**/

	var self = {};

	/**
     * 
     * @method getStations
	 * @memberof stations

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} sortBy - Sort by

	* @param {string} name - Name
	 *
     */
     self.getStations = function(pageSize, pageNumber, sortBy, name){
		var path = '/api/v1/stations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getStation
	 * @memberof stations

	* @param {string} id - Station ID
	 *
     */
     self.getStation = function(id){
		var path = '/api/v1/stations/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.associateduser = self.associateduser || {};

	/**
     * 
     * @method unassignUserFromStation
	 * @memberof stations/associateduser

	* @param {string} id - Station ID
	 *
     */
     self.associateduser.unassignUserFromStation = function(id){
		var path = '/api/v1/stations/{id}/associateduser';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.statuses";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.statuses = (function (PureCloud) {
	/**
	* @namespace statuses
	**/

	var self = {};

	/**
     * 
     * @method getStatuses
	 * @memberof statuses
	 *
     */
     self.getStatuses = function(){
		var path = '/api/v1/statuses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.telephony";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.telephony = (function (PureCloud) {
	/**
	* @namespace telephony/providers/edge/linebasesettings
	**/
	/**
	* @namespace telephony/providers/edge/lines
	**/
	/**
	* @namespace telephony/providers/edge/lines/template
	**/
	/**
	* @namespace telephony/providers/edge/phonebasesettings
	**/
	/**
	* @namespace telephony/providers/edge/phonebasesettings/availablemetabases
	**/
	/**
	* @namespace telephony/providers/edge/phonebasesettings/template
	**/
	/**
	* @namespace telephony/providers/edge/phones
	**/
	/**
	* @namespace telephony/providers/edge/phones/template
	**/
	/**
	* @namespace telephony/providers/edge/phones/reboot
	**/
	/**
	* @namespace telephony/providers/edge/timezones
	**/
	/**
	* @namespace telephony/providers/edge/trunkbasesettings
	**/
	/**
	* @namespace telephony/providers/edge/trunkbasesettings/availablemetabases
	**/
	/**
	* @namespace telephony/providers/edge/trunkbasesettings/template
	**/

	var self = {};
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.linebasesettings = self.providers.edge.linebasesettings || {};

	/**
     * 
     * @method getAListingOfLineBaseSettingsObjects
	 * @memberof telephony/providers/edge/linebasesettings

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Value by which to sort

	* @param {string} sortOrder - Sort order
	 *
     */
     self.providers.edge.linebasesettings.getAListingOfLineBaseSettingsObjects = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/telephony/providers/edge/linebasesettings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.linebasesettings = self.providers.edge.linebasesettings || {};

	/**
     * 
     * @method getALineBaseSettingsObject
	 * @memberof telephony/providers/edge/linebasesettings

	* @param {string} lineBaseId - Line base ID
	 *
     */
     self.providers.edge.linebasesettings.getALineBaseSettingsObject = function(lineBaseId){
		var path = '/api/v1/telephony/providers/edge/linebasesettings/{lineBaseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{lineBaseId}', lineBaseId);

        if(lineBaseId === undefined && lineBaseId !== null){
			throw 'Missing required  parameter: lineBaseId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.lines = self.providers.edge.lines || {};

	/**
     * 
     * @method getLines
	 * @memberof telephony/providers/edge/lines

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} name - Name

	* @param {string} sortBy - Value by which to sort

	* @param {array} expand - Fields to expand in the response, comma-separated
	 *
     */
     self.providers.edge.lines.getLines = function(pageSize, pageNumber, name, sortBy, expand){
		var path = '/api/v1/telephony/providers/edge/lines';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.lines = self.providers.edge.lines || {};
	self.providers.edge.lines.template = self.providers.edge.lines.template || {};

	/**
     * 
     * @method getNewLineInstance
	 * @memberof telephony/providers/edge/lines/template

	* @param {string} lineBaseSettingsId - The id of a Line Base Settings object upon which to base this Line
	 *
     */
     self.providers.edge.lines.template.getNewLineInstance = function(lineBaseSettingsId){
		var path = '/api/v1/telephony/providers/edge/lines/template';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(lineBaseSettingsId !== undefined && lineBaseSettingsId !== null){
			queryParameters.lineBaseSettingsId = lineBaseSettingsId;
		}

        if(lineBaseSettingsId === undefined && lineBaseSettingsId !== null){
			throw 'Missing required  parameter: lineBaseSettingsId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.lines = self.providers.edge.lines || {};

	/**
     * 
     * @method getLine
	 * @memberof telephony/providers/edge/lines

	* @param {string} lineId - Line ID
	 *
     */
     self.providers.edge.lines.getLine = function(lineId){
		var path = '/api/v1/telephony/providers/edge/lines/{lineId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{lineId}', lineId);

        if(lineId === undefined && lineId !== null){
			throw 'Missing required  parameter: lineId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};

	/**
     * 
     * @method getPhoneBaseSettings
	 * @memberof telephony/providers/edge/phonebasesettings

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Value by which to sort

	* @param {string} sortOrder - Sort order
	 *
     */
     self.providers.edge.phonebasesettings.getPhoneBaseSettings = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};

	/**
     * 
     * @method createPhoneBaseSettings
	 * @memberof telephony/providers/edge/phonebasesettings

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "phoneMetaBase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lines": [],
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "dualRegisters": true,
      "hardwareIdType": "",
      "allowReboot": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.phonebasesettings.createPhoneBaseSettings = function(body){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};
	self.providers.edge.phonebasesettings.availablemetabases = self.providers.edge.phonebasesettings.availablemetabases || {};

	/**
     * 
     * @method getPhoneMakesAndModels
	 * @memberof telephony/providers/edge/phonebasesettings/availablemetabases

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.providers.edge.phonebasesettings.availablemetabases.getPhoneMakesAndModels = function(pageSize, pageNumber){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings/availablemetabases';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};
	self.providers.edge.phonebasesettings.template = self.providers.edge.phonebasesettings.template || {};

	/**
     * 
     * @method getNewPhoneBaseSettingsInstance
	 * @memberof telephony/providers/edge/phonebasesettings/template

	* @param {string} phoneMetabaseId - The id of a metabase object upon which to base this Phone Base Settings
	 *
     */
     self.providers.edge.phonebasesettings.template.getNewPhoneBaseSettingsInstance = function(phoneMetabaseId){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings/template';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(phoneMetabaseId !== undefined && phoneMetabaseId !== null){
			queryParameters.phoneMetabaseId = phoneMetabaseId;
		}

        if(phoneMetabaseId === undefined && phoneMetabaseId !== null){
			throw 'Missing required  parameter: phoneMetabaseId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};

	/**
     * 
     * @method getPhoneBaseSettings
	 * @memberof telephony/providers/edge/phonebasesettings

	* @param {string} phoneBaseId - Phone base ID
	 *
     */
     self.providers.edge.phonebasesettings.getPhoneBaseSettings = function(phoneBaseId){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings/{phoneBaseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneBaseId}', phoneBaseId);

        if(phoneBaseId === undefined && phoneBaseId !== null){
			throw 'Missing required  parameter: phoneBaseId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};

	/**
     * 
     * @method updatePhoneBaseSettings
	 * @memberof telephony/providers/edge/phonebasesettings

	* @param {string} phoneBaseId - Phone base ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "phoneMetaBase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lines": [],
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "dualRegisters": true,
      "hardwareIdType": "",
      "allowReboot": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.phonebasesettings.updatePhoneBaseSettings = function(phoneBaseId, body){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings/{phoneBaseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneBaseId}', phoneBaseId);

        if(phoneBaseId === undefined && phoneBaseId !== null){
			throw 'Missing required  parameter: phoneBaseId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phonebasesettings = self.providers.edge.phonebasesettings || {};

	/**
     * 
     * @method deletePhoneBaseSettings
	 * @memberof telephony/providers/edge/phonebasesettings

	* @param {string} phoneBaseId - Phone base ID
	 *
     */
     self.providers.edge.phonebasesettings.deletePhoneBaseSettings = function(phoneBaseId){
		var path = '/api/v1/telephony/providers/edge/phonebasesettings/{phoneBaseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneBaseId}', phoneBaseId);

        if(phoneBaseId === undefined && phoneBaseId !== null){
			throw 'Missing required  parameter: phoneBaseId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};

	/**
     * 
     * @method getAListOfPhoneInstances
	 * @memberof telephony/providers/edge/phones

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Value by which to sort

	* @param {string} sortOrder - Sort order

	* @param {string} siteid - Filter by site.id

	* @param {string} phoneBaseSettingsid - Filter by phoneBaseSettings.id

	* @param {string} phone_hardwareId - Filter by phone_hardwareId

	* @param {array} expand - Fields to expand in the response, comma-separated

	* @param {array} fields - Fields under properties to get, comma-separated
	 *
     */
     self.providers.edge.phones.getAListOfPhoneInstances = function(pageNumber, pageSize, sortBy, sortOrder, siteid, phoneBaseSettingsid, phone_hardwareId, expand, fields){
		var path = '/api/v1/telephony/providers/edge/phones';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}


		if(siteid !== undefined && siteid !== null){
			queryParameters.site.id = siteid;
		}


		if(phoneBaseSettingsid !== undefined && phoneBaseSettingsid !== null){
			queryParameters.phoneBaseSettings.id = phoneBaseSettingsid;
		}


		if(phone_hardwareId !== undefined && phone_hardwareId !== null){
			queryParameters.phone_hardwareId = phone_hardwareId;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}


		if(fields !== undefined && fields !== null){
			queryParameters.fields = fields;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};

	/**
     * 
     * @method createPhoneInstances
	 * @memberof telephony/providers/edge/phones

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "edgeGroup": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "phoneBaseSettings": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lineBaseSettings": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "phoneMetaBase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lines": [],
   "status": {
      "id": "",
      "name": "",
      "operationalStatus": "",
      "edgesStatus": "",
      "provision": {},
      "lineStatuses": [],
      "phoneAssignmentToEdgeType": "",
      "edge": {},
      "selfUri": ""
   },
   "secondaryStatus": {
      "id": "",
      "name": "",
      "operationalStatus": "",
      "edgesStatus": "",
      "provision": {},
      "lineStatuses": [],
      "phoneAssignmentToEdgeType": "",
      "edge": {},
      "selfUri": ""
   },
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "dualRegisters": true,
      "hardwareIdType": "",
      "allowReboot": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.phones.createPhoneInstances = function(body){
		var path = '/api/v1/telephony/providers/edge/phones';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};
	self.providers.edge.phones.template = self.providers.edge.phones.template || {};

	/**
     * 
     * @method getNewPhoneInstance
	 * @memberof telephony/providers/edge/phones/template

	* @param {string} phoneBaseSettingsId - The id of a Phone Base Settings object upon which to base this Phone
	 *
     */
     self.providers.edge.phones.template.getNewPhoneInstance = function(phoneBaseSettingsId){
		var path = '/api/v1/telephony/providers/edge/phones/template';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(phoneBaseSettingsId !== undefined && phoneBaseSettingsId !== null){
			queryParameters.phoneBaseSettingsId = phoneBaseSettingsId;
		}

        if(phoneBaseSettingsId === undefined && phoneBaseSettingsId !== null){
			throw 'Missing required  parameter: phoneBaseSettingsId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};

	/**
     * 
     * @method getPhoneInstance
	 * @memberof telephony/providers/edge/phones

	* @param {string} phoneId - Phone ID
	 *
     */
     self.providers.edge.phones.getPhoneInstance = function(phoneId){
		var path = '/api/v1/telephony/providers/edge/phones/{phoneId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneId}', phoneId);

        if(phoneId === undefined && phoneId !== null){
			throw 'Missing required  parameter: phoneId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};

	/**
     * 
     * @method updatePhoneInstance
	 * @memberof telephony/providers/edge/phones

	* @param {string} phoneId - Phone ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "edgeGroup": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "site": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "phoneBaseSettings": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lineBaseSettings": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "phoneMetaBase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "lines": [],
   "status": {
      "id": "",
      "name": "",
      "operationalStatus": "",
      "edgesStatus": "",
      "provision": {},
      "lineStatuses": [],
      "phoneAssignmentToEdgeType": "",
      "edge": {},
      "selfUri": ""
   },
   "secondaryStatus": {
      "id": "",
      "name": "",
      "operationalStatus": "",
      "edgesStatus": "",
      "provision": {},
      "lineStatuses": [],
      "phoneAssignmentToEdgeType": "",
      "edge": {},
      "selfUri": ""
   },
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "dualRegisters": true,
      "hardwareIdType": "",
      "allowReboot": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.phones.updatePhoneInstance = function(phoneId, body){
		var path = '/api/v1/telephony/providers/edge/phones/{phoneId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneId}', phoneId);

        if(phoneId === undefined && phoneId !== null){
			throw 'Missing required  parameter: phoneId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};

	/**
     * 
     * @method deletePhoneInstance
	 * @memberof telephony/providers/edge/phones

	* @param {string} phoneId - Phone ID
	 *
     */
     self.providers.edge.phones.deletePhoneInstance = function(phoneId){
		var path = '/api/v1/telephony/providers/edge/phones/{phoneId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneId}', phoneId);

        if(phoneId === undefined && phoneId !== null){
			throw 'Missing required  parameter: phoneId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.phones = self.providers.edge.phones || {};
	self.providers.edge.phones.reboot = self.providers.edge.phones.reboot || {};

	/**
     * 
     * @method rebootPhone
	 * @memberof telephony/providers/edge/phones/reboot

	* @param {string} phoneId - Phone Id
	 *
     */
     self.providers.edge.phones.reboot.rebootPhone = function(phoneId){
		var path = '/api/v1/telephony/providers/edge/phones/{phoneId}/reboot';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{phoneId}', phoneId);

        if(phoneId === undefined && phoneId !== null){
			throw 'Missing required  parameter: phoneId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.timezones = self.providers.edge.timezones || {};

	/**
     * 
     * @method getTimeZonesList
	 * @memberof telephony/providers/edge/timezones

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.providers.edge.timezones.getTimeZonesList = function(pageSize, pageNumber){
		var path = '/api/v1/telephony/providers/edge/timezones';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};

	/**
     * 
     * @method getTrunkBaseSettings
	 * @memberof telephony/providers/edge/trunkbasesettings

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Value by which to sort

	* @param {string} sortOrder - Sort order
	 *
     */
     self.providers.edge.trunkbasesettings.getTrunkBaseSettings = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(sortOrder !== undefined && sortOrder !== null){
			queryParameters.sortOrder = sortOrder;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};

	/**
     * 
     * @method createTrunkBaseSettings
	 * @memberof telephony/providers/edge/trunkbasesettings

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "trunkMetabase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.trunkbasesettings.createTrunkBaseSettings = function(body){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};
	self.providers.edge.trunkbasesettings.availablemetabases = self.providers.edge.trunkbasesettings.availablemetabases || {};

	/**
     * 
     * @method getTrunkMakesAndModels
	 * @memberof telephony/providers/edge/trunkbasesettings/availablemetabases

	* @param {string} type - 
	EXTERNAL,
	PHONE,
	EDGE,

	* @param {integer} pageSize - 

	* @param {integer} pageNumber - 
	 *
     */
     self.providers.edge.trunkbasesettings.availablemetabases.getTrunkMakesAndModels = function(type, pageSize, pageNumber){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings/availablemetabases';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};
	self.providers.edge.trunkbasesettings.template = self.providers.edge.trunkbasesettings.template || {};

	/**
     * 
     * @method getNewPhoneBaseSettingsInstance
	 * @memberof telephony/providers/edge/trunkbasesettings/template

	* @param {string} trunkMetabaseId - The id of a metabase object upon which to base this Trunk Base Settings
	 *
     */
     self.providers.edge.trunkbasesettings.template.getNewPhoneBaseSettingsInstance = function(trunkMetabaseId){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings/template';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(trunkMetabaseId !== undefined && trunkMetabaseId !== null){
			queryParameters.trunkMetabaseId = trunkMetabaseId;
		}

        if(trunkMetabaseId === undefined && trunkMetabaseId !== null){
			throw 'Missing required  parameter: trunkMetabaseId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};

	/**
     * 
     * @method getTrunkBaseSettings
	 * @memberof telephony/providers/edge/trunkbasesettings

	* @param {string} trunkBaseSettingsId - Trunk Base ID
	 *
     */
     self.providers.edge.trunkbasesettings.getTrunkBaseSettings = function(trunkBaseSettingsId){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings/{trunkBaseSettingsId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{trunkBaseSettingsId}', trunkBaseSettingsId);

        if(trunkBaseSettingsId === undefined && trunkBaseSettingsId !== null){
			throw 'Missing required  parameter: trunkBaseSettingsId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};

	/**
     * 
     * @method updateTrunkBaseSettings
	 * @memberof telephony/providers/edge/trunkbasesettings

	* @param {string} trunkBaseSettingsId - Trunk Base ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "trunkMetabase": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "properties": {
      "nodeType": "",
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "pojo": true,
      "number": true,
      "integralNumber": true,
      "floatingPointNumber": true,
      "short": true,
      "int": true,
      "long": true,
      "float": true,
      "double": true,
      "bigDecimal": true,
      "bigInteger": true,
      "textual": true,
      "boolean": true,
      "binary": true,
      "array": true,
      "null": true
   },
   "selfUri": ""
}
	 *
     */
     self.providers.edge.trunkbasesettings.updateTrunkBaseSettings = function(trunkBaseSettingsId, body){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings/{trunkBaseSettingsId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{trunkBaseSettingsId}', trunkBaseSettingsId);

        if(trunkBaseSettingsId === undefined && trunkBaseSettingsId !== null){
			throw 'Missing required  parameter: trunkBaseSettingsId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.providers = self.providers || {};
	self.providers.edge = self.providers.edge || {};
	self.providers.edge.trunkbasesettings = self.providers.edge.trunkbasesettings || {};

	/**
     * 
     * @method deleteTrunkBaseSettings
	 * @memberof telephony/providers/edge/trunkbasesettings

	* @param {string} trunkBaseSettingsId - Trunk Base ID
	 *
     */
     self.providers.edge.trunkbasesettings.deleteTrunkBaseSettings = function(trunkBaseSettingsId){
		var path = '/api/v1/telephony/providers/edge/trunkbasesettings/{trunkBaseSettingsId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{trunkBaseSettingsId}', trunkBaseSettingsId);

        if(trunkBaseSettingsId === undefined && trunkBaseSettingsId !== null){
			throw 'Missing required  parameter: trunkBaseSettingsId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.timezones";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.timezones = (function (PureCloud) {
	/**
	* @namespace timezones
	**/

	var self = {};

	/**
     * 
     * @method getTimezones
	 * @memberof timezones

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.getTimezones = function(pageSize, pageNumber){
		var path = '/api/v1/timezones';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.userrecordings";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.userrecordings = (function (PureCloud) {
	/**
	* @namespace userrecordings
	**/
	/**
	* @namespace userrecordings/summary
	**/
	/**
	* @namespace userrecordings/media
	**/

	var self = {};

	/**
     * 
     * @method listUserRecordings
	 * @memberof userrecordings

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - conversation
	 *
     */
     self.listUserRecordings = function(pageSize, pageNumber, expand){
		var path = '/api/v1/userrecordings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.summary = self.summary || {};

	/**
     * 
     * @method getUserRecordingSummary
	 * @memberof userrecordings/summary
	 *
     */
     self.summary.getUserRecordingSummary = function(){
		var path = '/api/v1/userrecordings/summary';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getUserRecording
	 * @memberof userrecordings

	* @param {string} recordingId - User Recording ID

	* @param {string} expand - conversation
	 *
     */
     self.getUserRecording = function(recordingId, expand){
		var path = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateUserRecording
	 * @memberof userrecordings

	* @param {string} recordingId - User Recording ID

	* @param {} body - UserRecording

	* @param {string} expand - conversation
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "dateCreated": "",
   "dateModified": "",
   "contentUri": "",
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "createdBy": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "contentLength": 0,
   "durationMilliseconds": 0,
   "thumbnails": [],
   "read": true,
   "selfUri": ""
}
	 *
     */
     self.updateUserRecording = function(recordingId, body, expand){
		var path = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteUserRecording
	 * @memberof userrecordings

	* @param {string} recordingId - User Recording ID
	 *
     */
     self.deleteUserRecording = function(recordingId){
		var path = '/api/v1/userrecordings/{recordingId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.media = self.media || {};

	/**
     * 
     * @method downloadUserRecording
	 * @memberof userrecordings/media

	* @param {string} recordingId - User Recording ID

	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,
	 *
     */
     self.media.downloadUserRecording = function(recordingId, formatId){
		var path = '/api/v1/userrecordings/{recordingId}/media';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{recordingId}', recordingId);

        if(recordingId === undefined && recordingId !== null){
			throw 'Missing required  parameter: recordingId';
        }


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.users";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.users = (function (PureCloud) {
	/**
	* @namespace users
	**/
	/**
	* @namespace users/me
	**/
	/**
	* @namespace users/callforwarding
	**/
	/**
	* @namespace users/greetings
	**/
	/**
	* @namespace users/greetings/defaults
	**/
	/**
	* @namespace users/outofoffice
	**/
	/**
	* @namespace users/presences
	**/
	/**
	* @namespace users/primarypresence
	**/
	/**
	* @namespace users/queues
	**/
	/**
	* @namespace users/roles
	**/
	/**
	* @namespace users/routingstatus
	**/
	/**
	* @namespace users/settablestatuses
	**/
	/**
	* @namespace users/skills
	**/

	var self = {};

	/**
     * 
     * @method getUsers
	 * @memberof users

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {array} id - id

	* @param {string} sortBy - Sort by

	* @param {string} role - Role

	* @param {string} name - Name

	* @param {string} username - Username

	* @param {array} skill - Skill

	* @param {array} expand - Which fields, if any, to expand
	 *
     */
     self.getUsers = function(pageSize, pageNumber, id, sortBy, role, name, username, skill, expand){
		var path = '/api/v1/users';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
		}


		if(role !== undefined && role !== null){
			queryParameters.role = role;
		}


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(username !== undefined && username !== null){
			queryParameters.username = username;
		}


		if(skill !== undefined && skill !== null){
			queryParameters.skill = skill;
		}


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method createUser
	 * @memberof users

	* @param {} body - User
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "username": "",
   "email": "",
   "displayName": "",
   "phoneNumber": "",
   "userImages": [],
   "status": {
      "id": "",
      "name": "",
      "alertable": true,
      "dateModified": "",
      "type": "",
      "selfUri": ""
   },
   "chat": {
      "jabberId": ""
   },
   "roles": [],
   "voicemailEnabled": true,
   "department": "",
   "title": "",
   "routingStatus": {
      "userId": "",
      "status": "",
      "startTime": ""
   },
   "password": "",
   "primaryPresence": {
      "id": "",
      "name": "",
      "user": {},
      "source": "",
      "presenceDefinition": {},
      "message": "",
      "modifiedBy": {},
      "modifiedDate": "",
      "selfUri": ""
   },
   "conversations": {
      "userId": "",
      "call": {},
      "email": {},
      "chat": {}
   },
   "outOfOffice": {
      "id": "",
      "name": "",
      "user": {},
      "startDate": "",
      "endDate": "",
      "active": true,
      "selfUri": ""
   },
   "permissions": [],
   "selfUri": "",
   "requestedStatus": {
      "id": "",
      "name": "",
      "alertable": true,
      "dateModified": "",
      "type": "",
      "selfUri": ""
   },
   "defaultStationUri": "",
   "stationUri": "",
   "lastStationUri": ""
}
	 *
     */
     self.createUser = function(body){
		var path = '/api/v1/users';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.me = self.me || {};

	/**
     * 
     * @method getUser
	 * @memberof users/me

	* @param {array} expand - Which fields, if any, to expand
	 *
     */
     self.me.getUser = function(expand){
		var path = '/api/v1/users/me';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getUser
	 * @memberof users

	* @param {string} userId - User ID

	* @param {array} expand - Which fields, if any, to expand
	 *
     */
     self.getUser = function(userId, expand){
		var path = '/api/v1/users/{userId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }


		if(expand !== undefined && expand !== null){
			queryParameters.expand = expand;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method setUserstation
	 * @memberof users

	* @param {string} userId - User ID

	* @param {} body - stationUri
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "username": "",
   "email": "",
   "displayName": "",
   "phoneNumber": "",
   "userImages": [],
   "status": {
      "id": "",
      "name": "",
      "alertable": true,
      "dateModified": "",
      "type": "",
      "selfUri": ""
   },
   "chat": {
      "jabberId": ""
   },
   "roles": [],
   "voicemailEnabled": true,
   "department": "",
   "title": "",
   "routingStatus": {
      "userId": "",
      "status": "",
      "startTime": ""
   },
   "password": "",
   "primaryPresence": {
      "id": "",
      "name": "",
      "user": {},
      "source": "",
      "presenceDefinition": {},
      "message": "",
      "modifiedBy": {},
      "modifiedDate": "",
      "selfUri": ""
   },
   "conversations": {
      "userId": "",
      "call": {},
      "email": {},
      "chat": {}
   },
   "outOfOffice": {
      "id": "",
      "name": "",
      "user": {},
      "startDate": "",
      "endDate": "",
      "active": true,
      "selfUri": ""
   },
   "permissions": [],
   "selfUri": "",
   "requestedStatus": {
      "id": "",
      "name": "",
      "alertable": true,
      "dateModified": "",
      "type": "",
      "selfUri": ""
   },
   "defaultStationUri": "",
   "stationUri": "",
   "lastStationUri": ""
}
	 *
     */
     self.setUserstation = function(userId, body){
		var path = '/api/v1/users/{userId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callforwarding = self.callforwarding || {};

	/**
     * 
     * @method getCallforwarding
	 * @memberof users/callforwarding

	* @param {string} userId - User ID
	 *
     */
     self.callforwarding.getCallforwarding = function(userId){
		var path = '/api/v1/users/{userId}/callforwarding';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callforwarding = self.callforwarding || {};

	/**
     * 
     * @method updateCallforwarding
	 * @memberof users/callforwarding

	* @param {string} userId - User ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "enabled": true,
   "phoneNumber": "",
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.callforwarding.updateCallforwarding = function(userId, body){
		var path = '/api/v1/users/{userId}/callforwarding';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.callforwarding = self.callforwarding || {};

	/**
     * 
     * @method patchCallforwarding
	 * @memberof users/callforwarding

	* @param {string} userId - User ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "enabled": true,
   "phoneNumber": "",
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.callforwarding.patchCallforwarding = function(userId, body){
		var path = '/api/v1/users/{userId}/callforwarding';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.greetings = self.greetings || {};

	/**
     * 
     * @method getUserGreetings
	 * @memberof users/greetings

	* @param {string} userId - User ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.greetings.getUserGreetings = function(userId, pageSize, pageNumber){
		var path = '/api/v1/users/{userId}/greetings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.greetings = self.greetings || {};

	/**
     * 
     * @method createUserGreeting
	 * @memberof users/greetings

	* @param {string} userId - User ID

	* @param {} body - The Greeting to create
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "ownerType": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "audioFile": {
      "durationMilliseconds": 0,
      "sizeBytes": 0,
      "selfUri": ""
   },
   "audioTTS": "",
   "createdDate": "",
   "createdBy": "",
   "modifiedDate": "",
   "modifiedBy": "",
   "selfUri": ""
}
	 *
     */
     self.greetings.createUserGreeting = function(userId, body){
		var path = '/api/v1/users/{userId}/greetings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.greetings = self.greetings || {};
	self.greetings.defaults = self.greetings.defaults || {};

	/**
     * 
     * @method getUserDefaultgreetingslist
	 * @memberof users/greetings/defaults

	* @param {string} userId - User ID
	 *
     */
     self.greetings.defaults.getUserDefaultgreetingslist = function(userId){
		var path = '/api/v1/users/{userId}/greetings/defaults';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.greetings = self.greetings || {};
	self.greetings.defaults = self.greetings.defaults || {};

	/**
     * 
     * @method updateUserDefaultgreetingslist
	 * @memberof users/greetings/defaults

	* @param {string} userId - User ID

	* @param {} body - The updated defaultGreetingList
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "owner": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "ownerType": "",
   "greetings": {},
   "createdDate": "",
   "createdBy": "",
   "modifiedDate": "",
   "modifiedBy": "",
   "selfUri": ""
}
	 *
     */
     self.greetings.defaults.updateUserDefaultgreetingslist = function(userId, body){
		var path = '/api/v1/users/{userId}/greetings/defaults';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outofoffice = self.outofoffice || {};

	/**
     * 
     * @method getOutofoffice
	 * @memberof users/outofoffice

	* @param {string} userId - User ID
	 *
     */
     self.outofoffice.getOutofoffice = function(userId){
		var path = '/api/v1/users/{userId}/outofoffice';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.outofoffice = self.outofoffice || {};

	/**
     * 
     * @method updateOutofoffice
	 * @memberof users/outofoffice

	* @param {string} userId - User ID

	* @param {} body - The updated UserPresence
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "startDate": "",
   "endDate": "",
   "active": true,
   "selfUri": ""
}
	 *
     */
     self.outofoffice.updateOutofoffice = function(userId, body){
		var path = '/api/v1/users/{userId}/outofoffice';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.presences = self.presences || {};

	/**
     * 
     * @method getUserpresences
	 * @memberof users/presences

	* @param {string} userId - User ID

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.presences.getUserpresences = function(userId, pageNumber, pageSize){
		var path = '/api/v1/users/{userId}/presences';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.presences = self.presences || {};

	/**
     * 
     * @method getUserpresence
	 * @memberof users/presences

	* @param {string} userId - User ID

	* @param {string} source - Source
	 *
     */
     self.presences.getUserpresence = function(userId, source){
		var path = '/api/v1/users/{userId}/presences/{source}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        path = path.replace('{source}', source);

        if(source === undefined && source !== null){
			throw 'Missing required  parameter: source';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.presences = self.presences || {};

	/**
     * 
     * @method updateUserpresence
	 * @memberof users/presences

	* @param {string} userId - User ID

	* @param {string} source - Source

	* @param {} body - The updated UserPresence
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "source": "",
   "presenceDefinition": {
      "id": "",
      "name": "",
      "languageLabels": {},
      "systemPresence": "",
      "deactivated": true,
      "createdBy": {},
      "createdDate": "",
      "modifiedBy": {},
      "modifiedDate": "",
      "selfUri": ""
   },
   "message": "",
   "modifiedBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.presences.updateUserpresence = function(userId, source, body){
		var path = '/api/v1/users/{userId}/presences/{source}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        path = path.replace('{source}', source);

        if(source === undefined && source !== null){
			throw 'Missing required  parameter: source';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.presences = self.presences || {};

	/**
     * 
     * @method patchUserpresence
	 * @memberof users/presences

	* @param {string} userId - User ID

	* @param {string} source - Source

	* @param {} body - The patched UserPresence
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "user": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "source": "",
   "presenceDefinition": {
      "id": "",
      "name": "",
      "languageLabels": {},
      "systemPresence": "",
      "deactivated": true,
      "createdBy": {},
      "createdDate": "",
      "modifiedBy": {},
      "modifiedDate": "",
      "selfUri": ""
   },
   "message": "",
   "modifiedBy": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "modifiedDate": "",
   "selfUri": ""
}
	 *
     */
     self.presences.patchUserpresence = function(userId, source, body){
		var path = '/api/v1/users/{userId}/presences/{source}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        path = path.replace('{source}', source);

        if(source === undefined && source !== null){
			throw 'Missing required  parameter: source';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.primarypresence = self.primarypresence || {};

	/**
     * 
     * @method getPrimaryuserpresence
	 * @memberof users/primarypresence

	* @param {string} userId - User ID
	 *
     */
     self.primarypresence.getPrimaryuserpresence = function(userId){
		var path = '/api/v1/users/{userId}/primarypresence';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method getUserQueues
	 * @memberof users/queues

	* @param {string} userId - User ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.queues.getUserQueues = function(userId, pageSize, pageNumber){
		var path = '/api/v1/users/{userId}/queues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method joinunjoinUserQueues
	 * @memberof users/queues

	* @param {string} userId - User ID

	* @param {} body - User Queues
	 *
     */
     self.queues.joinunjoinUserQueues = function(userId, body){
		var path = '/api/v1/users/{userId}/queues';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.queues = self.queues || {};

	/**
     * 
     * @method joinunjoinUserqueue
	 * @memberof users/queues

	* @param {string} queueId - Queue ID

	* @param {string} userId - User ID

	* @param {} body - Queue Member
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "version": 0,
   "dateCreated": "",
   "dateModified": "",
   "modifiedBy": "",
   "createdBy": "",
   "state": "",
   "modifiedByApp": "",
   "createdByApp": "",
   "wrapupCodes": [],
   "mediaSettings": {},
   "bullseye": {
      "rings": []
   },
   "acwSettings": {
      "wrapupPrompt": "",
      "timeoutMs": 0
   },
   "phoneNumber": "",
   "skillEvaluationMethod": "",
   "queueFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "callingPartyName": "",
   "callingPartyNumber": "",
   "joined": true,
   "memberCount": 0,
   "selfUri": ""
}
	 *
     */
     self.queues.joinunjoinUserqueue = function(queueId, userId, body){
		var path = '/api/v1/users/{userId}/queues/{queueId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{queueId}', queueId);

        if(queueId === undefined && queueId !== null){
			throw 'Missing required  parameter: queueId';
        }

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PATCH', path + '?' +$.param(queryParameters), requestBody);
     };
	self.roles = self.roles || {};

	/**
     * 
     * @method listRolesForUser
	 * @memberof users/roles

	* @param {string} userId - User ID
	 *
     */
     self.roles.listRolesForUser = function(userId){
		var path = '/api/v1/users/{userId}/roles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.routingstatus = self.routingstatus || {};

	/**
     * 
     * @method getRoutingStatus
	 * @memberof users/routingstatus

	* @param {string} userId - User ID
	 *
     */
     self.routingstatus.getRoutingStatus = function(userId){
		var path = '/api/v1/users/{userId}/routingstatus';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.routingstatus = self.routingstatus || {};

	/**
     * 
     * @method updateRoutingStatus
	 * @memberof users/routingstatus

	* @param {string} userId - User ID

	* @param {} body - Routing Status
	 * @example
	 * Body Example:
	 * {
   "userId": "",
   "status": "",
   "startTime": ""
}
	 *
     */
     self.routingstatus.updateRoutingStatus = function(userId, body){
		var path = '/api/v1/users/{userId}/routingstatus';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.settablestatuses = self.settablestatuses || {};

	/**
     * 
     * @method getSettableStatuses
	 * @memberof users/settablestatuses

	* @param {string} userId - User ID
	 *
     */
     self.settablestatuses.getSettableStatuses = function(userId){
		var path = '/api/v1/users/{userId}/settablestatuses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.skills = self.skills || {};

	/**
     * 
     * @method getUserSkills
	 * @memberof users/skills

	* @param {string} userId - User ID
	 *
     */
     self.skills.getUserSkills = function(userId){
		var path = '/api/v1/users/{userId}/skills';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{userId}', userId);

        if(userId === undefined && userId !== null){
			throw 'Missing required  parameter: userId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.voicemail";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.voicemail = (function (PureCloud) {
	/**
	* @namespace voicemail/mailbox
	**/
	/**
	* @namespace voicemail/messages
	**/
	/**
	* @namespace voicemail/messages/media
	**/

	var self = {};
	self.mailbox = self.mailbox || {};

	/**
     * 
     * @method getMailboxInformation
	 * @memberof voicemail/mailbox
	 *
     */
     self.mailbox.getMailboxInformation = function(){
		var path = '/api/v1/voicemail/mailbox';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method getVoicemailMessages
	 * @memberof voicemail/messages
	 *
     */
     self.messages.getVoicemailMessages = function(){
		var path = '/api/v1/voicemail/messages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method deleteAllVoicemailMessages
	 * @memberof voicemail/messages
	 *
     */
     self.messages.deleteAllVoicemailMessages = function(){
		var path = '/api/v1/voicemail/messages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method getMessage
	 * @memberof voicemail/messages

	* @param {string} messageId - Message ID
	 *
     */
     self.messages.getMessage = function(messageId){
		var path = '/api/v1/voicemail/messages/{messageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{messageId}', messageId);

        if(messageId === undefined && messageId !== null){
			throw 'Missing required  parameter: messageId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method updateMessage
	 * @memberof voicemail/messages

	* @param {string} messageId - Message ID

	* @param {} body - VoicemailMessage
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "conversation": {
      "id": "",
      "name": "",
      "startTime": "",
      "endTime": "",
      "participants": [],
      "conversationIds": [],
      "maxParticipants": 0,
      "recordingState": "",
      "selfUri": ""
   },
   "read": true,
   "audioRecordingDurationSeconds": 0,
   "audioRecordingSizeBytes": 0,
   "createdDate": "",
   "modifiedDate": "",
   "callerAddress": "",
   "callerName": "",
   "callerUser": {
      "id": "",
      "name": "",
      "username": "",
      "email": "",
      "displayName": "",
      "phoneNumber": "",
      "userImages": [],
      "status": {},
      "chat": {},
      "roles": [],
      "voicemailEnabled": true,
      "department": "",
      "title": "",
      "routingStatus": {},
      "password": "",
      "primaryPresence": {},
      "conversations": {},
      "outOfOffice": {},
      "permissions": [],
      "selfUri": "",
      "requestedStatus": {},
      "defaultStationUri": "",
      "stationUri": "",
      "lastStationUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.messages.updateMessage = function(messageId, body){
		var path = '/api/v1/voicemail/messages/{messageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{messageId}', messageId);

        if(messageId === undefined && messageId !== null){
			throw 'Missing required  parameter: messageId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};

	/**
     * 
     * @method deleteMessage
	 * @memberof voicemail/messages

	* @param {string} messageId - Message ID
	 *
     */
     self.messages.deleteMessage = function(messageId){
		var path = '/api/v1/voicemail/messages/{messageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{messageId}', messageId);

        if(messageId === undefined && messageId !== null){
			throw 'Missing required  parameter: messageId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.messages = self.messages || {};
	self.messages.media = self.messages.media || {};

	/**
     * 
     * @method getMessageMedia
	 * @memberof voicemail/messages/media

	* @param {string} messageId - Message ID

	* @param {string} formatId - The desired format (WEBM, WAV, etc.)
	WEBM,
	WAV,
	 *
     */
     self.messages.media.getMessageMedia = function(messageId, formatId){
		var path = '/api/v1/voicemail/messages/{messageId}/media';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{messageId}', messageId);

        if(messageId === undefined && messageId !== null){
			throw 'Missing required  parameter: messageId';
        }


		if(formatId !== undefined && formatId !== null){
			queryParameters.formatId = formatId;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));
