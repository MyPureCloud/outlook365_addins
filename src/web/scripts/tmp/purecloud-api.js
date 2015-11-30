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
     */
    self.authorize = function(clientId, redirectUrl, state, environment){
        environment = environment || _environment;
        _host = 'api.'+ environment;

        _auth_url = 'https://login.'+environment;

        var url = _auth_url + '/authorize' +
			'?response_type=token' +
			'&client_id=' + encodeURI(clientId) +
			'&redirect_uri=' + encodeURI(redirectUrl);

        if(state !== undefined && state !== null){
            url = url + '&state=' + state;
        }

		console.debug(url);

		// Redirect to oauth url
		console.debug('Initiating oauth process');
		window.location.replace(url);
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
		window.location.replace(this._auth_url + "/logout");
    };

    /**
    * The environment that this is run in.  If set should be mypurecloud.com, mypurecloud.ie, mypurecloud.au, etc.
    * @memberof PureCloud
    **/
    self.setEnvironment = function(environment){
        _environment = environment;
        _host = 'api.'+ environment;

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
     * Executes an authenticated GET to PureCloud
     * @memberof PureCloud
     * @param  {string} url The full URL to get
     * @example PureCloud.get("http://api.mypurecloud.com/api/v1/users/me");
     */
    self.get = function(url){
        return sendRestRequest("GET", url);
    };

    /**
     * Executes an authenticated request to PureCloud
     * @memberof PureCloud
     * @param  {method} The HTTP method (GET, POST, PUT, DELETE)
     * @param  {path} The relative uri path
     * @param  {body} The body to send
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
	* @namespace analytics/query
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
   "order": 0,
   "category": "",
   "conditions": [],
   "actions": []
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
   "order": 0,
   "category": "",
   "conditions": [],
   "actions": []
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
	self.query = self.query || {};

	/**
     * 
     * @method sendQuery
	 * @memberof analytics/query

	* @param {} body - queryObject

	* @param {string} version - Version number
	 *
     */
     self.query.sendQuery = function(body, version){
		var path = '/api/v1/analytics/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }


		if(version !== undefined && version !== null){
			queryParameters.version = version;
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
      "start": "",
      "end": ""
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
      "start": "",
      "end": ""
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.architect";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.architect = (function (PureCloud) {
	/**
	* @namespace architect/dependencytracking
	**/
	/**
	* @namespace architect/dependencytracking/build
	**/
	/**
	* @namespace architect/dependencytracking/consumedresources
	**/
	/**
	* @namespace architect/dependencytracking/consumingresources
	**/
	/**
	* @namespace architect/dependencytracking/deletedresourceconsumers
	**/
	/**
	* @namespace architect/dependencytracking/object
	**/
	/**
	* @namespace architect/dependencytracking/types
	**/
	/**
	* @namespace architect/ivrs
	**/
	/**
	* @namespace architect/ivrs/actions/publish
	**/
	/**
	* @namespace architect/prompts
	**/
	/**
	* @namespace architect/prompts/resources
	**/
	/**
	* @namespace architect/schedulegroups
	**/
	/**
	* @namespace architect/schedules
	**/
	/**
	* @namespace architect/systemprompts
	**/
	/**
	* @namespace architect/systemprompts/resources
	**/
	/**
	* @namespace architect/voicexmloperations
	**/

	var self = {};
	self.dependencytracking = self.dependencytracking || {};

	/**
     * 
     * @method getDependencyTrackingObjectsThatHaveAGivenDisplayName
	 * @memberof architect/dependencytracking

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} name - Object name to search for

	* @param {array} objectType - Object type(s) to search for

	* @param {boolean} consumedResources - Include resources each result item consumes

	* @param {boolean} consumingResources - Include resources that consume each result item

	* @param {array} consumedResourceType - Types of consumed resources to return, if consumed resources are requested

	* @param {array} consumingResourceType - Types of consuming resources to return, if consuming resources are requested
	 *
     */
     self.dependencytracking.getDependencyTrackingObjectsThatHaveAGivenDisplayName = function(pageNumber, pageSize, name, objectType, consumedResources, consumingResources, consumedResourceType, consumingResourceType){
		var path = '/api/v1/architect/dependencytracking';
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


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(objectType !== undefined && objectType !== null){
			queryParameters.objectType = objectType;
		}


		if(consumedResources !== undefined && consumedResources !== null){
			queryParameters.consumedResources = consumedResources;
		}


		if(consumingResources !== undefined && consumingResources !== null){
			queryParameters.consumingResources = consumingResources;
		}


		if(consumedResourceType !== undefined && consumedResourceType !== null){
			queryParameters.consumedResourceType = consumedResourceType;
		}


		if(consumingResourceType !== undefined && consumingResourceType !== null){
			queryParameters.consumingResourceType = consumingResourceType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.build = self.dependencytracking.build || {};

	/**
     * 
     * @method getDependencyTrackingBuildStatusForAnOrganization
	 * @memberof architect/dependencytracking/build
	 *
     */
     self.dependencytracking.build.getDependencyTrackingBuildStatusForAnOrganization = function(){
		var path = '/api/v1/architect/dependencytracking/build';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.build = self.dependencytracking.build || {};

	/**
     * 
     * @method rebuildDependencyTrackingDataForAnOrganization
	 * @memberof architect/dependencytracking/build
	 *
     */
     self.dependencytracking.build.rebuildDependencyTrackingDataForAnOrganization = function(){
		var path = '/api/v1/architect/dependencytracking/build';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.consumedresources = self.dependencytracking.consumedresources || {};

	/**
     * 
     * @method getResourcesThatAreConsumedByAGivenDependencyTrackingObject
	 * @memberof architect/dependencytracking/consumedresources

	* @param {string} id - Consuming object ID

	* @param {string} version - Consuming object version

	* @param {string} objectType - Consuming object type
	ACDLANGUAGE,
	ACDSKILL,
	ACDWRAPUPCODE,
	BRIDGEACTION,
	COMPOSERSCRIPT,
	CONTACTLIST,
	INBOUNDCALLFLOW,
	INQUEUECALLFLOW,
	LANGUAGE,
	OUTBOUNDCALLFLOW,
	QUEUE,
	SYSTEMPROMPT,
	USER,
	USERPROMPT,
	VOICEXML,

	* @param {array} resourceType - Types of consumed resources to show
	 *
     */
     self.dependencytracking.consumedresources.getResourcesThatAreConsumedByAGivenDependencyTrackingObject = function(id, version, objectType, resourceType){
		var path = '/api/v1/architect/dependencytracking/consumedresources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }


		if(version !== undefined && version !== null){
			queryParameters.version = version;
		}

        if(version === undefined && version !== null){
			throw 'Missing required  parameter: version';
        }


		if(objectType !== undefined && objectType !== null){
			queryParameters.objectType = objectType;
		}

        if(objectType === undefined && objectType !== null){
			throw 'Missing required  parameter: objectType';
        }


		if(resourceType !== undefined && resourceType !== null){
			queryParameters.resourceType = resourceType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.consumingresources = self.dependencytracking.consumingresources || {};

	/**
     * 
     * @method getResourcesThatConsumeAGivenDependencyTrackingObject
	 * @memberof architect/dependencytracking/consumingresources

	* @param {string} id - Consumed object ID

	* @param {string} objectType - Consumed object type
	ACDLANGUAGE,
	ACDSKILL,
	ACDWRAPUPCODE,
	BRIDGEACTION,
	COMPOSERSCRIPT,
	CONTACTLIST,
	INBOUNDCALLFLOW,
	INQUEUECALLFLOW,
	LANGUAGE,
	OUTBOUNDCALLFLOW,
	QUEUE,
	SYSTEMPROMPT,
	USER,
	USERPROMPT,
	VOICEXML,

	* @param {array} resourceType - Types of consuming resources to show
	 *
     */
     self.dependencytracking.consumingresources.getResourcesThatConsumeAGivenDependencyTrackingObject = function(id, objectType, resourceType){
		var path = '/api/v1/architect/dependencytracking/consumingresources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }


		if(objectType !== undefined && objectType !== null){
			queryParameters.objectType = objectType;
		}

        if(objectType === undefined && objectType !== null){
			throw 'Missing required  parameter: objectType';
        }


		if(resourceType !== undefined && resourceType !== null){
			queryParameters.resourceType = resourceType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.deletedresourceconsumers = self.dependencytracking.deletedresourceconsumers || {};

	/**
     * 
     * @method getDependencyTrackingObjectsThatConsumeDeletedResources
	 * @memberof architect/dependencytracking/deletedresourceconsumers

	* @param {string} name - Name to search for

	* @param {array} objectType - Object type(s) to search for

	* @param {string} flowFilter - Show only checkedIn or published flows

	* @param {boolean} consumedResources - Return consumed resources?

	* @param {array} consumedResourceType - Resource type(s) to return

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.dependencytracking.deletedresourceconsumers.getDependencyTrackingObjectsThatConsumeDeletedResources = function(name, objectType, flowFilter, consumedResources, consumedResourceType, pageNumber, pageSize){
		var path = '/api/v1/architect/dependencytracking/deletedresourceconsumers';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(objectType !== undefined && objectType !== null){
			queryParameters.objectType = objectType;
		}


		if(flowFilter !== undefined && flowFilter !== null){
			queryParameters.flowFilter = flowFilter;
		}


		if(consumedResources !== undefined && consumedResources !== null){
			queryParameters.consumedResources = consumedResources;
		}


		if(consumedResourceType !== undefined && consumedResourceType !== null){
			queryParameters.consumedResourceType = consumedResourceType;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.object = self.dependencytracking.object || {};

	/**
     * 
     * @method getADependencyTrackingObject
	 * @memberof architect/dependencytracking/object

	* @param {string} id - Object ID

	* @param {string} version - Object version

	* @param {string} objectType - Object type
	ACDLANGUAGE,
	ACDSKILL,
	ACDWRAPUPCODE,
	BRIDGEACTION,
	COMPOSERSCRIPT,
	CONTACTLIST,
	INBOUNDCALLFLOW,
	INQUEUECALLFLOW,
	LANGUAGE,
	OUTBOUNDCALLFLOW,
	QUEUE,
	SYSTEMPROMPT,
	USER,
	USERPROMPT,
	VOICEXML,

	* @param {boolean} consumedResources - Include resources this item consumes

	* @param {boolean} consumingResources - Include resources that consume this item

	* @param {array} consumedResourceType - Types of consumed resources to return, if consumed resources are requested

	* @param {array} consumingResourceType - Types of consuming resources to return, if consuming resources are requested
	 *
     */
     self.dependencytracking.object.getADependencyTrackingObject = function(id, version, objectType, consumedResources, consumingResources, consumedResourceType, consumingResourceType){
		var path = '/api/v1/architect/dependencytracking/object';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }


		if(version !== undefined && version !== null){
			queryParameters.version = version;
		}


		if(objectType !== undefined && objectType !== null){
			queryParameters.objectType = objectType;
		}


		if(consumedResources !== undefined && consumedResources !== null){
			queryParameters.consumedResources = consumedResources;
		}


		if(consumingResources !== undefined && consumingResources !== null){
			queryParameters.consumingResources = consumingResources;
		}


		if(consumedResourceType !== undefined && consumedResourceType !== null){
			queryParameters.consumedResourceType = consumedResourceType;
		}


		if(consumingResourceType !== undefined && consumingResourceType !== null){
			queryParameters.consumingResourceType = consumingResourceType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.types = self.dependencytracking.types || {};

	/**
     * 
     * @method getDependencyTrackingTypes
	 * @memberof architect/dependencytracking/types

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.dependencytracking.types.getDependencyTrackingTypes = function(pageNumber, pageSize){
		var path = '/api/v1/architect/dependencytracking/types';
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
	self.dependencytracking = self.dependencytracking || {};
	self.dependencytracking.types = self.dependencytracking.types || {};

	/**
     * 
     * @method getADependencyTrackingType
	 * @memberof architect/dependencytracking/types

	* @param {string} typeId - Type ID
	 *
     */
     self.dependencytracking.types.getADependencyTrackingType = function(typeId){
		var path = '/api/v1/architect/dependencytracking/types/{typeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{typeId}', typeId);

        if(typeId === undefined && typeId !== null){
			throw 'Missing required  parameter: typeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.ivrs = self.ivrs || {};

	/**
     * 
     * @method getIvrConfigs
	 * @memberof architect/ivrs

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	 *
     */
     self.ivrs.getIvrConfigs = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/architect/ivrs';
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
	self.ivrs = self.ivrs || {};

	/**
     * 
     * @method createIvrConfig
	 * @memberof architect/ivrs

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
   "ivrUri": "",
   "dnis": [],
   "flowId": "",
   "scheduleId": "",
   "openHoursFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "closedHoursFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "scheduleGroup": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.ivrs.createIvrConfig = function(body){
		var path = '/api/v1/architect/ivrs';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.ivrs = self.ivrs || {};
	self.ivrs.actions = self.ivrs.actions || {};
	self.ivrs.actions.publish = self.ivrs.actions.publish || {};

	/**
     * 
     * @method publishIvrConfigAction
	 * @memberof architect/ivrs/actions/publish

	* @param {string} id - 
	 *
     */
     self.ivrs.actions.publish.publishIvrConfigAction = function(id){
		var path = '/api/v1/architect/ivrs/actions/publish';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(id !== undefined && id !== null){
			queryParameters.id = id;
		}

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.ivrs = self.ivrs || {};

	/**
     * 
     * @method getIvrConfig
	 * @memberof architect/ivrs

	* @param {string} ivrId - IVR id
	 *
     */
     self.ivrs.getIvrConfig = function(ivrId){
		var path = '/api/v1/architect/ivrs/{ivrId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ivrId}', ivrId);

        if(ivrId === undefined && ivrId !== null){
			throw 'Missing required  parameter: ivrId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.ivrs = self.ivrs || {};

	/**
     * 
     * @method updateIvrConfig
	 * @memberof architect/ivrs

	* @param {string} ivrId - IVR id

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
   "ivrUri": "",
   "dnis": [],
   "flowId": "",
   "scheduleId": "",
   "openHoursFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "closedHoursFlow": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "scheduleGroup": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.ivrs.updateIvrConfig = function(ivrId, body){
		var path = '/api/v1/architect/ivrs/{ivrId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ivrId}', ivrId);

        if(ivrId === undefined && ivrId !== null){
			throw 'Missing required  parameter: ivrId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.ivrs = self.ivrs || {};

	/**
     * 
     * @method deleteIvrConfig
	 * @memberof architect/ivrs

	* @param {string} ivrId - IVR id
	 *
     */
     self.ivrs.deleteIvrConfig = function(ivrId){
		var path = '/api/v1/architect/ivrs/{ivrId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{ivrId}', ivrId);

        if(ivrId === undefined && ivrId !== null){
			throw 'Missing required  parameter: ivrId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};

	/**
     * The returned list is pageable, and query parameters can be used for filtering.  Multiple names can be specified, in which case all matching prompts will be returned, and no other filters will be evaluated.
     * @method getUserPrompts
	 * @memberof architect/prompts

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} name - Name

	* @param {string} description - Description

	* @param {string} nameOrDescription - Name or description
	 *
     */
     self.prompts.getUserPrompts = function(pageNumber, pageSize, name, description, nameOrDescription){
		var path = '/api/v1/architect/prompts';
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


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(description !== undefined && description !== null){
			queryParameters.description = description;
		}


		if(nameOrDescription !== undefined && nameOrDescription !== null){
			queryParameters.nameOrDescription = nameOrDescription;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};

	/**
     * 
     * @method createUserPrompt
	 * @memberof architect/prompts

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "resources": [],
   "selfUri": ""
}
	 *
     */
     self.prompts.createUserPrompt = function(body){
		var path = '/api/v1/architect/prompts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};

	/**
     * 
     * @method getUserPrompt
	 * @memberof architect/prompts

	* @param {string} promptId - Prompt ID
	 *
     */
     self.prompts.getUserPrompt = function(promptId){
		var path = '/api/v1/architect/prompts/{promptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};

	/**
     * 
     * @method updateUserPrompt
	 * @memberof architect/prompts

	* @param {string} promptId - Prompt ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "resources": [],
   "selfUri": ""
}
	 *
     */
     self.prompts.updateUserPrompt = function(promptId, body){
		var path = '/api/v1/architect/prompts/{promptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};

	/**
     * 
     * @method deleteUserPrompt
	 * @memberof architect/prompts

	* @param {string} promptId - Prompt ID
	 *
     */
     self.prompts.deleteUserPrompt = function(promptId){
		var path = '/api/v1/architect/prompts/{promptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};
	self.prompts.resources = self.prompts.resources || {};

	/**
     * The returned list is pageable, and query paramaters can be used for filtering.
     * @method getUserPromptResources
	 * @memberof architect/prompts/resources

	* @param {string} promptId - Prompt ID

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.prompts.resources.getUserPromptResources = function(promptId, pageNumber, pageSize){
		var path = '/api/v1/architect/prompts/{promptId}/resources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};
	self.prompts.resources = self.prompts.resources || {};

	/**
     * 
     * @method createUserPromptResource
	 * @memberof architect/prompts/resources

	* @param {string} promptId - Prompt ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "promptId": "",
   "language": "",
   "mediaUri": "",
   "ttsString": "",
   "uploadStatus": "",
   "uploadUri": "",
   "durationSeconds": {},
   "selfUri": ""
}
	 *
     */
     self.prompts.resources.createUserPromptResource = function(promptId, body){
		var path = '/api/v1/architect/prompts/{promptId}/resources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};
	self.prompts.resources = self.prompts.resources || {};

	/**
     * 
     * @method getUserPromptResource
	 * @memberof architect/prompts/resources

	* @param {string} promptId - Prompt ID

	* @param {string} language - Language
	 *
     */
     self.prompts.resources.getUserPromptResource = function(promptId, language){
		var path = '/api/v1/architect/prompts/{promptId}/resources/{language}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        path = path.replace('{language}', language);

        if(language === undefined && language !== null){
			throw 'Missing required  parameter: language';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};
	self.prompts.resources = self.prompts.resources || {};

	/**
     * 
     * @method updateUserPromptResource
	 * @memberof architect/prompts/resources

	* @param {string} promptId - Prompt ID

	* @param {string} language - Language

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "promptId": "",
   "language": "",
   "mediaUri": "",
   "ttsString": "",
   "uploadStatus": "",
   "uploadUri": "",
   "durationSeconds": {},
   "selfUri": ""
}
	 *
     */
     self.prompts.resources.updateUserPromptResource = function(promptId, language, body){
		var path = '/api/v1/architect/prompts/{promptId}/resources/{language}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        path = path.replace('{language}', language);

        if(language === undefined && language !== null){
			throw 'Missing required  parameter: language';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.prompts = self.prompts || {};
	self.prompts.resources = self.prompts.resources || {};

	/**
     * 
     * @method deleteUserPromptResource
	 * @memberof architect/prompts/resources

	* @param {string} promptId - Prompt ID

	* @param {string} language - Language
	 *
     */
     self.prompts.resources.deleteUserPromptResource = function(promptId, language){
		var path = '/api/v1/architect/prompts/{promptId}/resources/{language}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        path = path.replace('{language}', language);

        if(language === undefined && language !== null){
			throw 'Missing required  parameter: language';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedulegroups = self.schedulegroups || {};

	/**
     * 
     * @method getAListOfScheduleGroups
	 * @memberof architect/schedulegroups

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	 *
     */
     self.schedulegroups.getAListOfScheduleGroups = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/architect/schedulegroups';
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
	self.schedulegroups = self.schedulegroups || {};

	/**
     * 
     * @method createANewScheduleGroup
	 * @memberof architect/schedulegroups

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
   "timeZone": "",
   "openSchedules": [],
   "closedSchedules": [],
   "selfUri": ""
}
	 *
     */
     self.schedulegroups.createANewScheduleGroup = function(body){
		var path = '/api/v1/architect/schedulegroups';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedulegroups = self.schedulegroups || {};

	/**
     * 
     * @method getScheduleGroup
	 * @memberof architect/schedulegroups

	* @param {string} scheduleGroupId - Schedule group ID
	 *
     */
     self.schedulegroups.getScheduleGroup = function(scheduleGroupId){
		var path = '/api/v1/architect/schedulegroups/{scheduleGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleGroupId}', scheduleGroupId);

        if(scheduleGroupId === undefined && scheduleGroupId !== null){
			throw 'Missing required  parameter: scheduleGroupId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedulegroups = self.schedulegroups || {};

	/**
     * 
     * @method updateScheduleGroup
	 * @memberof architect/schedulegroups

	* @param {string} scheduleGroupId - Schedule group ID

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
   "timeZone": "",
   "openSchedules": [],
   "closedSchedules": [],
   "selfUri": ""
}
	 *
     */
     self.schedulegroups.updateScheduleGroup = function(scheduleGroupId, body){
		var path = '/api/v1/architect/schedulegroups/{scheduleGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleGroupId}', scheduleGroupId);

        if(scheduleGroupId === undefined && scheduleGroupId !== null){
			throw 'Missing required  parameter: scheduleGroupId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedulegroups = self.schedulegroups || {};

	/**
     * 
     * @method deleteScheduleGroup
	 * @memberof architect/schedulegroups

	* @param {string} scheduleGroupId - Schedule group ID
	 *
     */
     self.schedulegroups.deleteScheduleGroup = function(scheduleGroupId){
		var path = '/api/v1/architect/schedulegroups/{scheduleGroupId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scheduleGroupId}', scheduleGroupId);

        if(scheduleGroupId === undefined && scheduleGroupId !== null){
			throw 'Missing required  parameter: scheduleGroupId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};

	/**
     * 
     * @method getSchedules
	 * @memberof architect/schedules

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	 *
     */
     self.schedules.getSchedules = function(pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/architect/schedules';
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
	self.schedules = self.schedules || {};

	/**
     * 
     * @method createANewSchedule
	 * @memberof architect/schedules

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
   "start": {
      "year": 0,
      "dayOfMonth": 0,
      "dayOfWeek": 0,
      "era": 0,
      "dayOfYear": 0,
      "weekOfWeekyear": 0,
      "weekyear": 0,
      "chronology": {},
      "monthOfYear": 0,
      "hourOfDay": 0,
      "minuteOfHour": 0,
      "secondOfMinute": 0,
      "millisOfSecond": 0,
      "yearOfEra": 0,
      "yearOfCentury": 0,
      "centuryOfEra": 0,
      "millisOfDay": 0,
      "fields": [],
      "values": [],
      "fieldTypes": []
   },
   "end": {
      "year": 0,
      "dayOfMonth": 0,
      "dayOfWeek": 0,
      "era": 0,
      "dayOfYear": 0,
      "weekOfWeekyear": 0,
      "weekyear": 0,
      "chronology": {},
      "monthOfYear": 0,
      "hourOfDay": 0,
      "minuteOfHour": 0,
      "secondOfMinute": 0,
      "millisOfSecond": 0,
      "yearOfEra": 0,
      "yearOfCentury": 0,
      "centuryOfEra": 0,
      "millisOfDay": 0,
      "fields": [],
      "values": [],
      "fieldTypes": []
   },
   "rrule": "",
   "keywords": [],
   "selfUri": ""
}
	 *
     */
     self.schedules.createANewSchedule = function(body){
		var path = '/api/v1/architect/schedules';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.schedules = self.schedules || {};

	/**
     * 
     * @method getASchedule
	 * @memberof architect/schedules

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.schedules.getASchedule = function(scheduleId){
		var path = '/api/v1/architect/schedules/{scheduleId}';
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
	self.schedules = self.schedules || {};

	/**
     * 
     * @method updateSchedule
	 * @memberof architect/schedules

	* @param {string} scheduleId - Schedule ID

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
   "start": {
      "year": 0,
      "dayOfMonth": 0,
      "dayOfWeek": 0,
      "era": 0,
      "dayOfYear": 0,
      "weekOfWeekyear": 0,
      "weekyear": 0,
      "chronology": {},
      "monthOfYear": 0,
      "hourOfDay": 0,
      "minuteOfHour": 0,
      "secondOfMinute": 0,
      "millisOfSecond": 0,
      "yearOfEra": 0,
      "yearOfCentury": 0,
      "centuryOfEra": 0,
      "millisOfDay": 0,
      "fields": [],
      "values": [],
      "fieldTypes": []
   },
   "end": {
      "year": 0,
      "dayOfMonth": 0,
      "dayOfWeek": 0,
      "era": 0,
      "dayOfYear": 0,
      "weekOfWeekyear": 0,
      "weekyear": 0,
      "chronology": {},
      "monthOfYear": 0,
      "hourOfDay": 0,
      "minuteOfHour": 0,
      "secondOfMinute": 0,
      "millisOfSecond": 0,
      "yearOfEra": 0,
      "yearOfCentury": 0,
      "centuryOfEra": 0,
      "millisOfDay": 0,
      "fields": [],
      "values": [],
      "fieldTypes": []
   },
   "rrule": "",
   "keywords": [],
   "selfUri": ""
}
	 *
     */
     self.schedules.updateSchedule = function(scheduleId, body){
		var path = '/api/v1/architect/schedules/{scheduleId}';
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
	self.schedules = self.schedules || {};

	/**
     * 
     * @method deleteSchedule
	 * @memberof architect/schedules

	* @param {string} scheduleId - Schedule ID
	 *
     */
     self.schedules.deleteSchedule = function(scheduleId){
		var path = '/api/v1/architect/schedules/{scheduleId}';
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
	self.systemprompts = self.systemprompts || {};

	/**
     * 
     * @method getSystemPrompts
	 * @memberof architect/systemprompts

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order

	* @param {string} name - Name

	* @param {string} description - Description

	* @param {string} nameOrDescription - Name or description
	 *
     */
     self.systemprompts.getSystemPrompts = function(pageNumber, pageSize, sortBy, sortOrder, name, description, nameOrDescription){
		var path = '/api/v1/architect/systemprompts';
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


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(description !== undefined && description !== null){
			queryParameters.description = description;
		}


		if(nameOrDescription !== undefined && nameOrDescription !== null){
			queryParameters.nameOrDescription = nameOrDescription;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.systemprompts = self.systemprompts || {};

	/**
     * 
     * @method getSystemPrompt
	 * @memberof architect/systemprompts

	* @param {string} promptId - 
	 *
     */
     self.systemprompts.getSystemPrompt = function(promptId){
		var path = '/api/v1/architect/systemprompts/{promptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.systemprompts = self.systemprompts || {};
	self.systemprompts.resources = self.systemprompts.resources || {};

	/**
     * 
     * @method getSystemPromptResources
	 * @memberof architect/systemprompts/resources

	* @param {string} promptId - Prompt ID

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} sortBy - Sort by

	* @param {string} sortOrder - Sort order
	 *
     */
     self.systemprompts.resources.getSystemPromptResources = function(promptId, pageNumber, pageSize, sortBy, sortOrder){
		var path = '/api/v1/architect/systemprompts/{promptId}/resources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
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



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.systemprompts = self.systemprompts || {};
	self.systemprompts.resources = self.systemprompts.resources || {};

	/**
     * 
     * @method createSystemPromptResourceOverride
	 * @memberof architect/systemprompts/resources

	* @param {string} promptId - Prompt ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "promptId": "",
   "language": "",
   "durationSeconds": {},
   "mediaUri": "",
   "ttsString": "",
   "uploadUri": "",
   "uploadStatus": "",
   "hasDefault": true,
   "selfUri": ""
}
	 *
     */
     self.systemprompts.resources.createSystemPromptResourceOverride = function(promptId, body){
		var path = '/api/v1/architect/systemprompts/{promptId}/resources';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.systemprompts = self.systemprompts || {};
	self.systemprompts.resources = self.systemprompts.resources || {};

	/**
     * 
     * @method getSystemPromptResource
	 * @memberof architect/systemprompts/resources

	* @param {string} promptId - Prompt ID

	* @param {string} language - Language
	 *
     */
     self.systemprompts.resources.getSystemPromptResource = function(promptId, language){
		var path = '/api/v1/architect/systemprompts/{promptId}/resources/{language}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        path = path.replace('{language}', language);

        if(language === undefined && language !== null){
			throw 'Missing required  parameter: language';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.systemprompts = self.systemprompts || {};
	self.systemprompts.resources = self.systemprompts.resources || {};

	/**
     * 
     * @method deleteSystemPromptResourceOverride
	 * @memberof architect/systemprompts/resources

	* @param {string} promptId - Prompt ID

	* @param {string} language - Language
	 *
     */
     self.systemprompts.resources.deleteSystemPromptResourceOverride = function(promptId, language){
		var path = '/api/v1/architect/systemprompts/{promptId}/resources/{language}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{promptId}', promptId);

        if(promptId === undefined && promptId !== null){
			throw 'Missing required  parameter: promptId';
        }

        path = path.replace('{language}', language);

        if(language === undefined && language !== null){
			throw 'Missing required  parameter: language';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicexmloperations = self.voicexmloperations || {};

	/**
     * 
     * @method getVoicexmlOperations
	 * @memberof architect/voicexmloperations

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} name - Name

	* @param {string} description - Description

	* @param {string} nameOrDescription - Name or description

	* @param {string} method - Method

	* @param {string} type - Type
	 *
     */
     self.voicexmloperations.getVoicexmlOperations = function(pageNumber, pageSize, name, description, nameOrDescription, method, type){
		var path = '/api/v1/architect/voicexmloperations';
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


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(description !== undefined && description !== null){
			queryParameters.description = description;
		}


		if(nameOrDescription !== undefined && nameOrDescription !== null){
			queryParameters.nameOrDescription = nameOrDescription;
		}


		if(method !== undefined && method !== null){
			queryParameters.method = method;
		}


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicexmloperations = self.voicexmloperations || {};

	/**
     * 
     * @method createVoicexmlOperation
	 * @memberof architect/voicexmloperations

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "method": "",
   "encoding": "",
   "description": "",
   "uri": "",
   "inputs": "",
   "outputs": "",
   "fetchAudio": "",
   "timeoutMS": 0,
   "selfUri": ""
}
	 *
     */
     self.voicexmloperations.createVoicexmlOperation = function(body){
		var path = '/api/v1/architect/voicexmloperations';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicexmloperations = self.voicexmloperations || {};

	/**
     * 
     * @method getVoicexmlOperation
	 * @memberof architect/voicexmloperations

	* @param {string} voiceXmlOperationId - Voice XML operation ID
	 *
     */
     self.voicexmloperations.getVoicexmlOperation = function(voiceXmlOperationId){
		var path = '/api/v1/architect/voicexmloperations/{voiceXmlOperationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{voiceXmlOperationId}', voiceXmlOperationId);

        if(voiceXmlOperationId === undefined && voiceXmlOperationId !== null){
			throw 'Missing required  parameter: voiceXmlOperationId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicexmloperations = self.voicexmloperations || {};

	/**
     * 
     * @method updateVoicexmlOperation
	 * @memberof architect/voicexmloperations

	* @param {string} voiceXmlOperationId - Voice XML operation ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "method": "",
   "encoding": "",
   "description": "",
   "uri": "",
   "inputs": "",
   "outputs": "",
   "fetchAudio": "",
   "timeoutMS": 0,
   "selfUri": ""
}
	 *
     */
     self.voicexmloperations.updateVoicexmlOperation = function(voiceXmlOperationId, body){
		var path = '/api/v1/architect/voicexmloperations/{voiceXmlOperationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{voiceXmlOperationId}', voiceXmlOperationId);

        if(voiceXmlOperationId === undefined && voiceXmlOperationId !== null){
			throw 'Missing required  parameter: voiceXmlOperationId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicexmloperations = self.voicexmloperations || {};

	/**
     * 
     * @method deleteVoicexmlOperation
	 * @memberof architect/voicexmloperations

	* @param {string} voiceXmlOperationId - Voice XML operation ID
	 *
     */
     self.voicexmloperations.deleteVoicexmlOperation = function(voiceXmlOperationId){
		var path = '/api/v1/architect/voicexmloperations/{voiceXmlOperationId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{voiceXmlOperationId}', voiceXmlOperationId);

        if(voiceXmlOperationId === undefined && voiceXmlOperationId !== null){
			throw 'Missing required  parameter: voiceXmlOperationId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
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

	* @param {boolean} force - 
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.billing";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.billing = (function (PureCloud) {
	/**
	* @namespace billing/account
	**/
	/**
	* @namespace billing/accounts
	**/
	/**
	* @namespace billing/accounts/overview
	**/
	/**
	* @namespace billing/accounts/status
	**/
	/**
	* @namespace billing/additionalservices
	**/
	/**
	* @namespace billing/addresses
	**/
	/**
	* @namespace billing/basicproducts
	**/
	/**
	* @namespace billing/carrierservices/usage/calls
	**/
	/**
	* @namespace billing/carrierservices/usage/calls/csv
	**/
	/**
	* @namespace billing/contactsales
	**/
	/**
	* @namespace billing/contracts
	**/
	/**
	* @namespace billing/currencies
	**/
	/**
	* @namespace billing/hardwarerates
	**/
	/**
	* @namespace billing/historicalvoicerates/inbound
	**/
	/**
	* @namespace billing/historicalvoicerates/outbound/domestic
	**/
	/**
	* @namespace billing/historicalvoicerates/outbound/international
	**/
	/**
	* @namespace billing/invoices
	**/
	/**
	* @namespace billing/invoices/pdf
	**/
	/**
	* @namespace billing/orders
	**/
	/**
	* @namespace billing/periods
	**/
	/**
	* @namespace billing/products
	**/
	/**
	* @namespace billing/quotes
	**/
	/**
	* @namespace billing/rates
	**/
	/**
	* @namespace billing/reports/billableusagedata/csv
	**/
	/**
	* @namespace billing/snapshots
	**/
	/**
	* @namespace billing/thirdpartyaccounts
	**/
	/**
	* @namespace billing/thirdpartyaccounts/subscriptions
	**/
	/**
	* @namespace billing/voicerate
	**/
	/**
	* @namespace billing/voicerates/inbound
	**/
	/**
	* @namespace billing/voicerates/outbound/domestic
	**/
	/**
	* @namespace billing/voicerates/outbound/international
	**/
	/**
	* @namespace billing/voiceratescsv
	**/

	var self = {};
	self.account = self.account || {};

	/**
     * 
     * @method getCustomerAccount
	 * @memberof billing/account
	 *
     */
     self.account.getCustomerAccount = function(){
		var path = '/api/v1/billing/account';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.account = self.account || {};

	/**
     * 
     * @method updateCustomerAccount
	 * @memberof billing/account

	* @param {} body - The account to be updated
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "orgLegalName": "",
   "orgPhone": "",
   "isTaxExempt": true,
   "billingAddress": {
      "streetAddress1": "",
      "streetAddress2": "",
      "city": "",
      "state": "",
      "zipcode": ""
   },
   "selfUri": ""
}
	 *
     */
     self.account.updateCustomerAccount = function(body){
		var path = '/api/v1/billing/account';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};

	/**
     * 
     * @method createBillingAccount
	 * @memberof billing/accounts

	* @param {} body - The account to be created
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "orgLegalName": "",
   "billingAddressLine1": "",
   "billingAddressLine2": "",
   "billingAddressCity": "",
   "billingAddressState": "",
   "billingAddressZipCode": "",
   "billingAddressCountry": "",
   "legalAddressLine1": "",
   "legalAddressLine2": "",
   "legalAddressCity": "",
   "legalAddressState": "",
   "legalAddressZipCode": "",
   "legalAddressCountry": "",
   "billingContactFirstName": "",
   "billingContactLastName": "",
   "billingContactEmail": "",
   "billingContactPhone": "",
   "purchaseOrderNumber": "",
   "isTaxExempt": true,
   "currency": "",
   "paymentTerm": "",
   "contractTerm": 0,
   "autoRenew": true,
   "enabled": true,
   "minCommitQuantities": {},
   "estimatedQuantities": {},
   "oneTimeCharges": [],
   "selfUri": ""
}
	 *
     */
     self.accounts.createBillingAccount = function(body){
		var path = '/api/v1/billing/accounts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};

	/**
     * 
     * @method getBillingAccount
	 * @memberof billing/accounts

	* @param {string} accountId - Identifies the account to be retrieved

	* @param {string} fields - Fields needed
	 *
     */
     self.accounts.getBillingAccount = function(accountId, fields){
		var path = '/api/v1/billing/accounts/{accountId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }


		if(fields !== undefined && fields !== null){
			queryParameters.fields = fields;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};

	/**
     * 
     * @method updatesTheBillingAccount
	 * @memberof billing/accounts

	* @param {string} accountId - Identifies the account to be updated

	* @param {} body - The account to be updated
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "orgLegalName": "",
   "billingAddressLine1": "",
   "billingAddressLine2": "",
   "billingAddressCity": "",
   "billingAddressState": "",
   "billingAddressZipCode": "",
   "billingAddressCountry": "",
   "legalAddressLine1": "",
   "legalAddressLine2": "",
   "legalAddressCity": "",
   "legalAddressState": "",
   "legalAddressZipCode": "",
   "legalAddressCountry": "",
   "billingContactFirstName": "",
   "billingContactLastName": "",
   "billingContactEmail": "",
   "billingContactPhone": "",
   "purchaseOrderNumber": "",
   "isTaxExempt": true,
   "currency": "",
   "paymentTerm": "",
   "contractTerm": 0,
   "autoRenew": true,
   "enabled": true,
   "minCommitQuantities": {},
   "estimatedQuantities": {},
   "oneTimeCharges": [],
   "selfUri": ""
}
	 *
     */
     self.accounts.updatesTheBillingAccount = function(accountId, body){
		var path = '/api/v1/billing/accounts/{accountId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};

	/**
     * 
     * @method terminatesTheBillingAccountOfTheOrg
	 * @memberof billing/accounts

	* @param {string} accountId - Identifies the account to be terminated
	 *
     */
     self.accounts.terminatesTheBillingAccountOfTheOrg = function(accountId){
		var path = '/api/v1/billing/accounts/{accountId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};
	self.accounts.overview = self.accounts.overview || {};

	/**
     * 
     * @method getAccountOverview
	 * @memberof billing/accounts/overview

	* @param {string} accountId - Identifies the account whose status should be retrieved
	 *
     */
     self.accounts.overview.getAccountOverview = function(accountId){
		var path = '/api/v1/billing/accounts/{accountId}/overview';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};
	self.accounts.status = self.accounts.status || {};

	/**
     * 
     * @method getAccountStatus
	 * @memberof billing/accounts/status

	* @param {string} accountId - Identifies the account whose status should be retrieved
	 *
     */
     self.accounts.status.getAccountStatus = function(accountId){
		var path = '/api/v1/billing/accounts/{accountId}/status';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.accounts = self.accounts || {};
	self.accounts.status = self.accounts.status || {};

	/**
     * 
     * @method updateAccountStatus
	 * @memberof billing/accounts/status

	* @param {string} accountId - Identifies the account whose status should be updated

	* @param {} body - The account status to be updated
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "orgName": "",
   "configured": true,
   "adminUIURL": "",
   "thirdPartyAccountId": "",
   "thirdPartySubscriptionId": "",
   "thirdPartySubscriptionNonAcbId": "",
   "selfUri": ""
}
	 *
     */
     self.accounts.status.updateAccountStatus = function(accountId, body){
		var path = '/api/v1/billing/accounts/{accountId}/status';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.additionalservices = self.additionalservices || {};

	/**
     * 
     * @method getAvailableAdditionalServices
	 * @memberof billing/additionalservices
	 *
     */
     self.additionalservices.getAvailableAdditionalServices = function(){
		var path = '/api/v1/billing/additionalservices';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.addresses = self.addresses || {};

	/**
     * 
     * @method getBillingAddresses
	 * @memberof billing/addresses
	 *
     */
     self.addresses.getBillingAddresses = function(){
		var path = '/api/v1/billing/addresses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.addresses = self.addresses || {};

	/**
     * 
     * @method createBillingAddress
	 * @memberof billing/addresses

	* @param {} body - The address to be created
	 * @example
	 * Body Example:
	 * {
   "streetAddress1": "",
   "streetAddress2": "",
   "city": "",
   "state": "",
   "zipcode": ""
}
	 *
     */
     self.addresses.createBillingAddress = function(body){
		var path = '/api/v1/billing/addresses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.addresses = self.addresses || {};

	/**
     * 
     * @method getABillingAddress
	 * @memberof billing/addresses

	* @param {string} addressId - The ID of the address
	 *
     */
     self.addresses.getABillingAddress = function(addressId){
		var path = '/api/v1/billing/addresses/{addressId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{addressId}', addressId);

        if(addressId === undefined && addressId !== null){
			throw 'Missing required  parameter: addressId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.addresses = self.addresses || {};

	/**
     * 
     * @method updateBillingAddress
	 * @memberof billing/addresses

	* @param {string} addressId - The ID of the address

	* @param {} body - The address to be updated
	 * @example
	 * Body Example:
	 * {
   "streetAddress1": "",
   "streetAddress2": "",
   "city": "",
   "state": "",
   "zipcode": ""
}
	 *
     */
     self.addresses.updateBillingAddress = function(addressId, body){
		var path = '/api/v1/billing/addresses/{addressId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{addressId}', addressId);

        if(addressId === undefined && addressId !== null){
			throw 'Missing required  parameter: addressId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.basicproducts = self.basicproducts || {};

	/**
     * 
     * @method getBasicProducts
	 * @memberof billing/basicproducts
	 *
     */
     self.basicproducts.getBasicProducts = function(){
		var path = '/api/v1/billing/basicproducts';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carrierservices = self.carrierservices || {};
	self.carrierservices.usage = self.carrierservices.usage || {};
	self.carrierservices.usage.calls = self.carrierservices.usage.calls || {};

	/**
     * 
     * @method getCarrierServicesUsageData
	 * @memberof billing/carrierservices/usage/calls

	* @param {string} from - startDateTime

	* @param {string} to - endDateTime

	* @param {integer} limit - Limit the number of results
	 *
     */
     self.carrierservices.usage.calls.getCarrierServicesUsageData = function(from, to, limit){
		var path = '/api/v1/billing/carrierservices/usage/calls';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(from !== undefined && from !== null){
			queryParameters.from = from;
		}


		if(to !== undefined && to !== null){
			queryParameters.to = to;
		}


		if(limit !== undefined && limit !== null){
			queryParameters.limit = limit;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carrierservices = self.carrierservices || {};
	self.carrierservices.usage = self.carrierservices.usage || {};
	self.carrierservices.usage.calls = self.carrierservices.usage.calls || {};
	self.carrierservices.usage.calls.csv = self.carrierservices.usage.calls.csv || {};

	/**
     * 
     * @method getCarrierServicesUsageDataCsv
	 * @memberof billing/carrierservices/usage/calls/csv

	* @param {string} from - startDateTime

	* @param {string} to - endDateTime

	* @param {integer} limit - Limit the number of results
	 *
     */
     self.carrierservices.usage.calls.csv.getCarrierServicesUsageDataCsv = function(from, to, limit){
		var path = '/api/v1/billing/carrierservices/usage/calls/csv';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(from !== undefined && from !== null){
			queryParameters.from = from;
		}


		if(to !== undefined && to !== null){
			queryParameters.to = to;
		}


		if(limit !== undefined && limit !== null){
			queryParameters.limit = limit;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contactsales = self.contactsales || {};

	/**
     * 
     * @method contactSales
	 * @memberof billing/contactsales

	* @param {} body - The contact sales details
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "email": "",
   "firstName": "",
   "lastName": "",
   "contactPhone": "",
   "country": "",
   "title": "",
   "message": "",
   "language": "",
   "productName": "",
   "industry": "",
   "estimatedUsers": "",
   "selfUri": ""
}
	 *
     */
     self.contactsales.contactSales = function(body){
		var path = '/api/v1/billing/contactsales';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.contracts = self.contracts || {};

	/**
     * 
     * @method createContractAndSignerViewUrl
	 * @memberof billing/contracts

	* @param {string} quoteId - The quote ID
	 *
     */
     self.contracts.createContractAndSignerViewUrl = function(quoteId){
		var path = '/api/v1/billing/contracts/{quoteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{quoteId}', quoteId);

        if(quoteId === undefined && quoteId !== null){
			throw 'Missing required  parameter: quoteId';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.currencies = self.currencies || {};

	/**
     * 
     * @method getAvailableCurrencies
	 * @memberof billing/currencies
	 *
     */
     self.currencies.getAvailableCurrencies = function(){
		var path = '/api/v1/billing/currencies';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.hardwarerates = self.hardwarerates || {};

	/**
     * 
     * @method getHardwareRates
	 * @memberof billing/hardwarerates

	* @param {string} productSubCategory - Filter rates by product subcategory. Examples are 'Phones' or 'PowerCords'.
	 *
     */
     self.hardwarerates.getHardwareRates = function(productSubCategory){
		var path = '/api/v1/billing/hardwarerates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(productSubCategory !== undefined && productSubCategory !== null){
			queryParameters.productSubCategory = productSubCategory;
		}

        if(productSubCategory === undefined && productSubCategory !== null){
			throw 'Missing required  parameter: productSubCategory';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.historicalvoicerates = self.historicalvoicerates || {};
	self.historicalvoicerates.inbound = self.historicalvoicerates.inbound || {};

	/**
     * Retrieve a list of historical inbound billing voice rates stored in the system.
     * @method getHistoricalInboundBillingVoiceRates
	 * @memberof billing/historicalvoicerates/inbound

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} effectiveDateStart - Filter voice rates by effective start date.

	* @param {string} effectiveDateEnd - Filter voice rates by effective end date.

	* @param {string} type - Filter voice rates by 'inboundTolled', 'inboundTollFree', 'outboundInterState', 'outboundIntraState', or 'outboundLocal'.

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.historicalvoicerates.inbound.getHistoricalInboundBillingVoiceRates = function(currency, effectiveDateStart, effectiveDateEnd, type, pageSize, pageNumber){
		var path = '/api/v1/billing/historicalvoicerates/inbound';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(effectiveDateStart !== undefined && effectiveDateStart !== null){
			queryParameters.effectiveDateStart = effectiveDateStart;
		}


		if(effectiveDateEnd !== undefined && effectiveDateEnd !== null){
			queryParameters.effectiveDateEnd = effectiveDateEnd;
		}


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
	self.historicalvoicerates = self.historicalvoicerates || {};
	self.historicalvoicerates.outbound = self.historicalvoicerates.outbound || {};
	self.historicalvoicerates.outbound.domestic = self.historicalvoicerates.outbound.domestic || {};

	/**
     * Retrieve a list of historical outbound domestic billing voice rates stored in the system.
     * @method getHistoricalOutboundDomesticBillingVoiceRates
	 * @memberof billing/historicalvoicerates/outbound/domestic

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} effectiveDateStart - Filter voice rates by effective start date.

	* @param {string} effectiveDateEnd - Filter voice rates by effective end date.

	* @param {string} type - Filter voice rates by 'inboundTolled', 'inboundTollFree', 'outboundInterState', 'outboundIntraState', or 'outboundLocal'.

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.historicalvoicerates.outbound.domestic.getHistoricalOutboundDomesticBillingVoiceRates = function(currency, effectiveDateStart, effectiveDateEnd, type, pageSize, pageNumber){
		var path = '/api/v1/billing/historicalvoicerates/outbound/domestic';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(effectiveDateStart !== undefined && effectiveDateStart !== null){
			queryParameters.effectiveDateStart = effectiveDateStart;
		}


		if(effectiveDateEnd !== undefined && effectiveDateEnd !== null){
			queryParameters.effectiveDateEnd = effectiveDateEnd;
		}


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
	self.historicalvoicerates = self.historicalvoicerates || {};
	self.historicalvoicerates.outbound = self.historicalvoicerates.outbound || {};
	self.historicalvoicerates.outbound.international = self.historicalvoicerates.outbound.international || {};

	/**
     * Retrieve a list of historical outbound international billing voice rates stored in the system.
     * @method getHistoricalOutboundInternationalBillingVoiceRates
	 * @memberof billing/historicalvoicerates/outbound/international

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} effectiveDateStart - Filter voice rates by effective start date.

	* @param {string} effectiveDateEnd - Filter voice rates by effective end date.

	* @param {string} origin - Filter voice rates by origin.

	* @param {string} destination - Filter voice rates by destination.

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.historicalvoicerates.outbound.international.getHistoricalOutboundInternationalBillingVoiceRates = function(currency, effectiveDateStart, effectiveDateEnd, origin, destination, pageSize, pageNumber){
		var path = '/api/v1/billing/historicalvoicerates/outbound/international';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(effectiveDateStart !== undefined && effectiveDateStart !== null){
			queryParameters.effectiveDateStart = effectiveDateStart;
		}


		if(effectiveDateEnd !== undefined && effectiveDateEnd !== null){
			queryParameters.effectiveDateEnd = effectiveDateEnd;
		}


		if(origin !== undefined && origin !== null){
			queryParameters.origin = origin;
		}


		if(destination !== undefined && destination !== null){
			queryParameters.destination = destination;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.invoices = self.invoices || {};

	/**
     * Retrieve a list of invoices stored in the system.
     * @method getInvoices
	 * @memberof billing/invoices

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.invoices.getInvoices = function(pageSize, pageNumber){
		var path = '/api/v1/billing/invoices';
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
	self.invoices = self.invoices || {};

	/**
     * 
     * @method getInvoice
	 * @memberof billing/invoices

	* @param {string} invoiceId - Identifies the invoice to be retrieved
	 *
     */
     self.invoices.getInvoice = function(invoiceId){
		var path = '/api/v1/billing/invoices/{invoiceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{invoiceId}', invoiceId);

        if(invoiceId === undefined && invoiceId !== null){
			throw 'Missing required  parameter: invoiceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.invoices = self.invoices || {};
	self.invoices.pdf = self.invoices.pdf || {};

	/**
     * 
     * @method getInvoicePdf
	 * @memberof billing/invoices/pdf

	* @param {string} invoiceId - Identifies the invoice PDF to be retrieved
	 *
     */
     self.invoices.pdf.getInvoicePdf = function(invoiceId){
		var path = '/api/v1/billing/invoices/{invoiceId}/pdf';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{invoiceId}', invoiceId);

        if(invoiceId === undefined && invoiceId !== null){
			throw 'Missing required  parameter: invoiceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.orders = self.orders || {};

	/**
     * 
     * @method createBillingOrder
	 * @memberof billing/orders

	* @param {} body - The order to be created
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "quote": {
      "id": "",
      "name": "",
      "purchaseOrder": "",
      "isSubmitted": true,
      "isPending": true,
      "currency": "",
      "billingContactEmail": "",
      "billingContactFirstName": "",
      "billingContactLastName": "",
      "billingContactPhone": "",
      "includePureVoiceCharges": true,
      "charges": [],
      "edgeControlModel": "",
      "referralCodes": [],
      "discountCodes": [],
      "salesPartnerCode": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.orders.createBillingOrder = function(body){
		var path = '/api/v1/billing/orders';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.periods = self.periods || {};

	/**
     * Retrieve a list of billing periods stored in the system.
     * @method getBillingPeriods
	 * @memberof billing/periods

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.periods.getBillingPeriods = function(pageSize, pageNumber){
		var path = '/api/v1/billing/periods';
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
	self.products = self.products || {};

	/**
     * 
     * @method getProducts
	 * @memberof billing/products
	 *
     */
     self.products.getProducts = function(){
		var path = '/api/v1/billing/products';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.products = self.products || {};

	/**
     * 
     * @method updateProducts
	 * @memberof billing/products

	* @param {} body - The products to activate
	 *
     */
     self.products.updateProducts = function(body){
		var path = '/api/v1/billing/products';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.quotes = self.quotes || {};

	/**
     * 
     * @method getBillingQuotes
	 * @memberof billing/quotes
	 *
     */
     self.quotes.getBillingQuotes = function(){
		var path = '/api/v1/billing/quotes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.quotes = self.quotes || {};

	/**
     * 
     * @method createBillingQuote
	 * @memberof billing/quotes

	* @param {} body - The quote to be created
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "purchaseOrder": "",
   "isSubmitted": true,
   "isPending": true,
   "currency": "",
   "billingContactEmail": "",
   "billingContactFirstName": "",
   "billingContactLastName": "",
   "billingContactPhone": "",
   "includePureVoiceCharges": true,
   "charges": [],
   "edgeControlModel": "",
   "referralCodes": [],
   "discountCodes": [],
   "salesPartnerCode": "",
   "selfUri": ""
}
	 *
     */
     self.quotes.createBillingQuote = function(body){
		var path = '/api/v1/billing/quotes';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.quotes = self.quotes || {};

	/**
     * 
     * @method getABillingQuote
	 * @memberof billing/quotes

	* @param {string} quoteId - The ID of the quote
	 *
     */
     self.quotes.getABillingQuote = function(quoteId){
		var path = '/api/v1/billing/quotes/{quoteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{quoteId}', quoteId);

        if(quoteId === undefined && quoteId !== null){
			throw 'Missing required  parameter: quoteId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.quotes = self.quotes || {};

	/**
     * 
     * @method updateBillingQuote
	 * @memberof billing/quotes

	* @param {string} quoteId - The ID of the quote

	* @param {} body - The quote to be updated
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "purchaseOrder": "",
   "isSubmitted": true,
   "isPending": true,
   "currency": "",
   "billingContactEmail": "",
   "billingContactFirstName": "",
   "billingContactLastName": "",
   "billingContactPhone": "",
   "includePureVoiceCharges": true,
   "charges": [],
   "edgeControlModel": "",
   "referralCodes": [],
   "discountCodes": [],
   "salesPartnerCode": "",
   "selfUri": ""
}
	 *
     */
     self.quotes.updateBillingQuote = function(quoteId, body){
		var path = '/api/v1/billing/quotes/{quoteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{quoteId}', quoteId);

        if(quoteId === undefined && quoteId !== null){
			throw 'Missing required  parameter: quoteId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.quotes = self.quotes || {};

	/**
     * 
     * @method deleteBillingQuote
	 * @memberof billing/quotes

	* @param {string} quoteId - The ID of the quote
	 *
     */
     self.quotes.deleteBillingQuote = function(quoteId){
		var path = '/api/v1/billing/quotes/{quoteId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{quoteId}', quoteId);

        if(quoteId === undefined && quoteId !== null){
			throw 'Missing required  parameter: quoteId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rates = self.rates || {};

	/**
     * Retrieve a list of billing rates stored in the system.
     * @method getBillingRates
	 * @memberof billing/rates

	* @param {string} chargeType - Filter rates by charge type. Examples are Usage, Recurring, or OneTime.
	 *
     */
     self.rates.getBillingRates = function(chargeType){
		var path = '/api/v1/billing/rates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(chargeType !== undefined && chargeType !== null){
			queryParameters.chargeType = chargeType;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.rates = self.rates || {};

	/**
     * 
     * @method getRate
	 * @memberof billing/rates

	* @param {string} rateId - Identifies the rate to be retrieved
	 *
     */
     self.rates.getRate = function(rateId){
		var path = '/api/v1/billing/rates/{rateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{rateId}', rateId);

        if(rateId === undefined && rateId !== null){
			throw 'Missing required  parameter: rateId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.reports = self.reports || {};
	self.reports.billableusagedata = self.reports.billableusagedata || {};
	self.reports.billableusagedata.csv = self.reports.billableusagedata.csv || {};

	/**
     * 
     * @method getBillableUsageDataReportCsv
	 * @memberof billing/reports/billableusagedata/csv

	* @param {string} reportId - Identifies the report CSV to be retrieved
	 *
     */
     self.reports.billableusagedata.csv.getBillableUsageDataReportCsv = function(reportId){
		var path = '/api/v1/billing/reports/billableusagedata/{reportId}/csv';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{reportId}', reportId);

        if(reportId === undefined && reportId !== null){
			throw 'Missing required  parameter: reportId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.snapshots = self.snapshots || {};

	/**
     * Creates a billing snapshot which is used to determine usage counts for a billing period.
     * @method createsABillingSnapshot
	 * @memberof billing/snapshots
	 *
     */
     self.snapshots.createsABillingSnapshot = function(){
		var path = '/api/v1/billing/snapshots';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.thirdpartyaccounts = self.thirdpartyaccounts || {};

	/**
     * Retrieve a list of third party accounts stored in the back-end system.
     * @method getThirdPartyAccounts
	 * @memberof billing/thirdpartyaccounts

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} search - Search for accounts with this text
	 *
     */
     self.thirdpartyaccounts.getThirdPartyAccounts = function(pageSize, pageNumber, search){
		var path = '/api/v1/billing/thirdpartyaccounts';
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


		if(search !== undefined && search !== null){
			queryParameters.search = search;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.thirdpartyaccounts = self.thirdpartyaccounts || {};

	/**
     * 
     * @method getThirdPartyBillingAccount
	 * @memberof billing/thirdpartyaccounts

	* @param {string} accountId - Identifies the third party account to be retrieved
	 *
     */
     self.thirdpartyaccounts.getThirdPartyBillingAccount = function(accountId){
		var path = '/api/v1/billing/thirdpartyaccounts/{accountId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.thirdpartyaccounts = self.thirdpartyaccounts || {};
	self.thirdpartyaccounts.subscriptions = self.thirdpartyaccounts.subscriptions || {};

	/**
     * Retrieve a list of third party subscriptions stored in the back-end system.
     * @method getThirdPartySubscriptions
	 * @memberof billing/thirdpartyaccounts/subscriptions

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} accountId - Identifies the third party account to be retrieved
	 *
     */
     self.thirdpartyaccounts.subscriptions.getThirdPartySubscriptions = function(pageSize, pageNumber, accountId){
		var path = '/api/v1/billing/thirdpartyaccounts/{accountId}/subscriptions';
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

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.thirdpartyaccounts = self.thirdpartyaccounts || {};
	self.thirdpartyaccounts.subscriptions = self.thirdpartyaccounts.subscriptions || {};

	/**
     * 
     * @method getThirdPartyBillingSubscription
	 * @memberof billing/thirdpartyaccounts/subscriptions

	* @param {string} accountId - Identifies the third party account to be retrieved

	* @param {string} subscriptionId - Identifies the third party subscription to be retrieved
	 *
     */
     self.thirdpartyaccounts.subscriptions.getThirdPartyBillingSubscription = function(accountId, subscriptionId){
		var path = '/api/v1/billing/thirdpartyaccounts/{accountId}/subscriptions/{subscriptionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{accountId}', accountId);

        if(accountId === undefined && accountId !== null){
			throw 'Missing required  parameter: accountId';
        }

        path = path.replace('{subscriptionId}', subscriptionId);

        if(subscriptionId === undefined && subscriptionId !== null){
			throw 'Missing required  parameter: subscriptionId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicerate = self.voicerate || {};

	/**
     * Update a billing voice rate currently stored in the system.
     * @method updateBillingVoiceRate
	 * @memberof billing/voicerate

	* @param {} body - The voice rate to be created
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "currency": "",
   "inboundTollFree": "",
   "inboundTolled": "",
   "outboundLocal": "",
   "outboundIntraState": "",
   "outboundInterState": "",
   "outboundInternational": [],
   "amendmentDate": "",
   "effectiveDate": "",
   "selfUri": ""
}
	 *
     */
     self.voicerate.updateBillingVoiceRate = function(body){
		var path = '/api/v1/billing/voicerate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicerate = self.voicerate || {};

	/**
     * Delete a pending billing voice rate currently stored in the system.
     * @method deleteBillingVoiceRate
	 * @memberof billing/voicerate

	* @param {string} currency - The currency of the voice rate

	* @param {string} amendmentId - The amendment Id of the voice rate
	 *
     */
     self.voicerate.deleteBillingVoiceRate = function(currency, amendmentId){
		var path = '/api/v1/billing/voicerate/{currency}/{amendmentId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{currency}', currency);

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }

        path = path.replace('{amendmentId}', amendmentId);

        if(amendmentId === undefined && amendmentId !== null){
			throw 'Missing required  parameter: amendmentId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicerates = self.voicerates || {};
	self.voicerates.inbound = self.voicerates.inbound || {};

	/**
     * Retrieve a list of current inbound billing voice rates stored in the system.
     * @method getCurrentInboundBillingVoiceRates
	 * @memberof billing/voicerates/inbound

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} type - Filter voice rates by 'inboundTolled', 'inboundTollFree', 'outboundInterState', 'outboundIntraState', or 'outboundLocal'.
	 *
     */
     self.voicerates.inbound.getCurrentInboundBillingVoiceRates = function(currency, type){
		var path = '/api/v1/billing/voicerates/inbound';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicerates = self.voicerates || {};
	self.voicerates.outbound = self.voicerates.outbound || {};
	self.voicerates.outbound.domestic = self.voicerates.outbound.domestic || {};

	/**
     * Retrieve a list of current outbound domestic billing voice rates stored in the system.
     * @method getCurrentOutboundDomesticBillingVoiceRates
	 * @memberof billing/voicerates/outbound/domestic

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} type - Filter voice rates by 'inboundTolled', 'inboundTollFree', 'outboundInterState', 'outboundIntraState', or 'outboundLocal'.
	 *
     */
     self.voicerates.outbound.domestic.getCurrentOutboundDomesticBillingVoiceRates = function(currency, type){
		var path = '/api/v1/billing/voicerates/outbound/domestic';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(type !== undefined && type !== null){
			queryParameters.type = type;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voicerates = self.voicerates || {};
	self.voicerates.outbound = self.voicerates.outbound || {};
	self.voicerates.outbound.international = self.voicerates.outbound.international || {};

	/**
     * Retrieve a list of current outbound international billing voice rates stored in the system.
     * @method getCurrentOutboundInternationalBillingVoiceRates
	 * @memberof billing/voicerates/outbound/international

	* @param {string} currency - Filter voice rates by currency.

	* @param {string} origin - Filter voice rates by origin.

	* @param {string} destination - Filter voice rates by destination.

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.voicerates.outbound.international.getCurrentOutboundInternationalBillingVoiceRates = function(currency, origin, destination, pageSize, pageNumber){
		var path = '/api/v1/billing/voicerates/outbound/international';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(currency !== undefined && currency !== null){
			queryParameters.currency = currency;
		}

        if(currency === undefined && currency !== null){
			throw 'Missing required  parameter: currency';
        }


		if(origin !== undefined && origin !== null){
			queryParameters.origin = origin;
		}


		if(destination !== undefined && destination !== null){
			queryParameters.destination = destination;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.voiceratescsv = self.voiceratescsv || {};

	/**
     * Retrieve a csv of current billing voice rates stored in the system.
     * @method getCurrentBillingVoiceRatesCsv
	 * @memberof billing/voiceratescsv
	 *
     */
     self.voiceratescsv.getCurrentBillingVoiceRatesCsv = function(){
		var path = '/api/v1/billing/voiceratescsv';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.carrierservices";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.carrierservices = (function (PureCloud) {
	/**
	* @namespace carrierservices/carriers
	**/
	/**
	* @namespace carrierservices/carriers/services
	**/
	/**
	* @namespace carrierservices/csvschemas
	**/
	/**
	* @namespace carrierservices/csvschemas/name
	**/
	/**
	* @namespace carrierservices/progress
	**/
	/**
	* @namespace carrierservices/report
	**/
	/**
	* @namespace carrierservices/transformendpoints
	**/
	/**
	* @namespace carrierservices/transformprogress/search
	**/
	/**
	* @namespace carrierservices/transformprogress
	**/
	/**
	* @namespace carrierservices/uploadtransform/spreadsheets
	**/
	/**
	* @namespace carrierservices/uploadtransform/texttables
	**/
	/**
	* @namespace carrierservices/xlsxschemas
	**/
	/**
	* @namespace carrierservices/xlsxschemas/name
	**/

	var self = {};
	self.carriers = self.carriers || {};

	/**
     * 
     * @method getCarriers
	 * @memberof carrierservices/carriers
	 *
     */
     self.carriers.getCarriers = function(){
		var path = '/api/v1/carrierservices/carriers';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};

	/**
     * 
     * @method createCarrier
	 * @memberof carrierservices/carriers

	* @param {} body - Carrier data
	 *
     */
     self.carriers.createCarrier = function(body){
		var path = '/api/v1/carrierservices/carriers';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};

	/**
     * 
     * @method getCarrier
	 * @memberof carrierservices/carriers

	* @param {string} carrierId - Carrier ID
	 *
     */
     self.carriers.getCarrier = function(carrierId){
		var path = '/api/v1/carrierservices/carriers/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};

	/**
     * 
     * @method updateCarrierById
	 * @memberof carrierservices/carriers

	* @param {string} carrierId - Carrier ID

	* @param {} body - Carrier data
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "address": {
      "streetAddress1": "",
      "streetAddress2": "",
      "city": "",
      "state": "",
      "zipcode": ""
   },
   "accountManager": {
      "firstName": "",
      "lastName": "",
      "phone": "",
      "email": ""
   },
   "supportPhone": "",
   "services": [],
   "selfUri": ""
}
	 *
     */
     self.carriers.updateCarrierById = function(carrierId, body){
		var path = '/api/v1/carrierservices/carriers/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};
	self.carriers.services = self.carriers.services || {};

	/**
     * 
     * @method getsAllCarrierServices
	 * @memberof carrierservices/carriers/services

	* @param {string} carrierId - Carrier ID

	* @param {array} fields - Fields

	* @param {string} filter - Filter
	 *
     */
     self.carriers.services.getsAllCarrierServices = function(carrierId, fields, filter){
		var path = '/api/v1/carrierservices/carriers/{carrierId}/services';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }


		if(fields !== undefined && fields !== null){
			queryParameters.fields = fields;
		}


		if(filter !== undefined && filter !== null){
			queryParameters.filter = filter;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};
	self.carriers.services = self.carriers.services || {};

	/**
     * 
     * @method createCarrierService
	 * @memberof carrierservices/carriers/services

	* @param {string} carrierId - Carrier ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "status": "",
   "serviceTypes": [],
   "gateways": [],
   "dns": {
      "ip": "",
      "port": 0
   },
   "vpn": {
      "type": "",
      "ip": "",
      "psk": ""
   },
   "carrier": {
      "id": "",
      "name": "",
      "address": {},
      "accountManager": {},
      "supportPhone": "",
      "services": [],
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.carriers.services.createCarrierService = function(carrierId, body){
		var path = '/api/v1/carrierservices/carriers/{carrierId}/services';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};
	self.carriers.services = self.carriers.services || {};

	/**
     * 
     * @method getsService
	 * @memberof carrierservices/carriers/services

	* @param {string} carrierId - Carrier ID

	* @param {string} serviceId - Service ID

	* @param {array} fields - Fields
	 *
     */
     self.carriers.services.getsService = function(carrierId, serviceId, fields){
		var path = '/api/v1/carrierservices/carriers/{carrierId}/services/{serviceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{serviceId}', serviceId);

        if(serviceId === undefined && serviceId !== null){
			throw 'Missing required  parameter: serviceId';
        }


		if(fields !== undefined && fields !== null){
			queryParameters.fields = fields;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};
	self.carriers.services = self.carriers.services || {};

	/**
     * 
     * @method getsAllCarrierServices
	 * @memberof carrierservices/carriers/services

	* @param {string} carrierId - Carrier ID

	* @param {string} serviceId - Service ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "status": "",
   "serviceTypes": [],
   "gateways": [],
   "dns": {
      "ip": "",
      "port": 0
   },
   "vpn": {
      "type": "",
      "ip": "",
      "psk": ""
   },
   "carrier": {
      "id": "",
      "name": "",
      "address": {},
      "accountManager": {},
      "supportPhone": "",
      "services": [],
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.carriers.services.getsAllCarrierServices = function(carrierId, serviceId, body){
		var path = '/api/v1/carrierservices/carriers/{carrierId}/services/{serviceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{serviceId}', serviceId);

        if(serviceId === undefined && serviceId !== null){
			throw 'Missing required  parameter: serviceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.carriers = self.carriers || {};
	self.carriers.services = self.carriers.services || {};

	/**
     * 
     * @method getsAllCarrierServices
	 * @memberof carrierservices/carriers/services

	* @param {string} carrierId - Carrier ID

	* @param {string} serviceId - Service ID
	 *
     */
     self.carriers.services.getsAllCarrierServices = function(carrierId, serviceId){
		var path = '/api/v1/carrierservices/carriers/{carrierId}/services/{serviceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{serviceId}', serviceId);

        if(serviceId === undefined && serviceId !== null){
			throw 'Missing required  parameter: serviceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.csvschemas = self.csvschemas || {};

	/**
     * 
     * @method getAllCsvSchemas
	 * @memberof carrierservices/csvschemas
	 *
     */
     self.csvschemas.getAllCsvSchemas = function(){
		var path = '/api/v1/carrierservices/csvschemas';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.csvschemas = self.csvschemas || {};

	/**
     * 
     * @method getCsvSchemasForACarrier
	 * @memberof carrierservices/csvschemas

	* @param {string} carrierId - Carrier ID
	 *
     */
     self.csvschemas.getCsvSchemasForACarrier = function(carrierId){
		var path = '/api/v1/carrierservices/csvschemas/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.csvschemas = self.csvschemas || {};

	/**
     * 
     * @method updateCsvSchema
	 * @memberof carrierservices/csvschemas

	* @param {} body - Schema data

	* @param {string} carrierId - Carrier ID
	 * @example
	 * Body Example:
	 * {
   "CarrierId": "",
   "HeaderRow": 0,
   "DataRow": 0,
   "HeaderMappings": {},
   "RateType": "",
   "Name": "",
   "DateFormat": ""
}
	 *
     */
     self.csvschemas.updateCsvSchema = function(body, carrierId){
		var path = '/api/v1/carrierservices/csvschemas/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.csvschemas = self.csvschemas || {};
	self.csvschemas.name = self.csvschemas.name || {};

	/**
     * 
     * @method getCsvSchemas
	 * @memberof carrierservices/csvschemas/name

	* @param {string} carrierId - Carrier ID

	* @param {string} name - Schema name
	 *
     */
     self.csvschemas.name.getCsvSchemas = function(carrierId, name){
		var path = '/api/v1/carrierservices/csvschemas/{carrierId}/name/{name}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{name}', name);

        if(name === undefined && name !== null){
			throw 'Missing required  parameter: name';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.csvschemas = self.csvschemas || {};
	self.csvschemas.name = self.csvschemas.name || {};

	/**
     * 
     * @method deleteCsvSchema
	 * @memberof carrierservices/csvschemas/name

	* @param {string} carrierId - Carrier ID

	* @param {string} name - Schema name
	 *
     */
     self.csvschemas.name.deleteCsvSchema = function(carrierId, name){
		var path = '/api/v1/carrierservices/csvschemas/{carrierId}/name/{name}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{name}', name);

        if(name === undefined && name !== null){
			throw 'Missing required  parameter: name';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.progress = self.progress || {};

	/**
     * 
     * @method getRatesheetUploadProgress
	 * @memberof carrierservices/progress
	 *
     */
     self.progress.getRatesheetUploadProgress = function(){
		var path = '/api/v1/carrierservices/progress';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.report = self.report || {};

	/**
     * This method queries Druid for a Call Stats database report.  Some Druid terminology is required to use it.  Each query parameter besides dimensions, _pgn, and _pgs, is a Druid dimension.  From the Druid documentation: Dimensions: Aspects or categories of data, such as languages or locations. For example, with language and country as the type of dimension, values could be "English" or "Mandarin" for language, or "USA" or "China" for country. In Druid, dimensions can serve as filters for narrowing down hits (for example, language = "English" or country = "China").  When using a dimension query parameter with a value the report will return events with granularity of that dimension where the dimension value is equal to the value you specified.  If you want to receive events with dimension based granularity with no filter, opt to use the dimensions query parameters, which is a comma  separated list of values that use the other query parameters as dimension names.  Each  parameter needs to be in the screaming snake case format, or words capitalized with underscores between words (i.e. CUSTOMER_ID).
     * @method getLcrReport
	 * @memberof carrierservices/report

	* @param {integer} pageSize - The total page size requested

	* @param {integer} pageNumber - The page number requested

	* @param {string} sortBy - variable name requested to sort by

	* @param {array} expand - variable name requested by expand list

	* @param {string} granularity - The granularity field determines how data gets bucketed across the time dimension, or how it gets aggregated by hour, day, minute, etc. all buckets everything into a single bucket. none does not bucket data (it actually uses the granularity of the index - minimum here is none which means millisecond granularity).

	* @param {string} dimensions - Dimensions are really any other parameter specified, excluding granularity.  To specify multiple dimensions use comma separated values.

	* @param {string} startDate - Start dateTime for ISO-8601 Intervals. This defines the time ranges to run the query over.  If not set will always default to now minus 15 days.

	* @param {string} endDate - End dateTime for ISO-8601 Intervals. This defines the time ranges to run the query over. If not set will always default to startDate plus 30 days.

	* @param {boolean} regexFilterEnabled - Specifies if all dimension filters should be implemented as regexps.

	* @param {string} sipCallId - SIP call id

	* @param {string} sipReason - SIP human readable status reason

	* @param {string} lrn - 

	* @param {string} sipStatus - SIP status code

	* @param {string} dialogId - 

	* @param {string} orgId - Organization id for the placed call

	* @param {string} cnam - 

	* @param {string} from - From prefix of the number

	* @param {string} to - To prefix of the number

	* @param {string} gatewayId - 

	* @param {string} direction - Direction of the call (e.g. incoming/outgoing)

	* @param {string} serviceId - Purevoice service id

	* @param {string} sendTime - 

	* @param {string} answerTime - Time in which the call was connected end to end

	* @param {string} receiveTime - Time in which the call was retrieved by Purevoice

	* @param {string} failTime - 

	* @param {string} disconnectTime - 

	* @param {string} endTime - Time of success call ending

	* @param {string} cnamTime - 

	* @param {string} lnpTime - 

	* @param {string} rejectTime - 
	 *
     */
     self.report.getLcrReport = function(pageSize, pageNumber, sortBy, expand, granularity, dimensions, startDate, endDate, regexFilterEnabled, sipCallId, sipReason, lrn, sipStatus, dialogId, orgId, cnam, from, to, gatewayId, direction, serviceId, sendTime, answerTime, receiveTime, failTime, disconnectTime, endTime, cnamTime, lnpTime, rejectTime){
		var path = '/api/v1/carrierservices/report';
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


		if(granularity !== undefined && granularity !== null){
			queryParameters.granularity = granularity;
		}


		if(dimensions !== undefined && dimensions !== null){
			queryParameters.dimensions = dimensions;
		}


		if(startDate !== undefined && startDate !== null){
			queryParameters.startDate = startDate;
		}


		if(endDate !== undefined && endDate !== null){
			queryParameters.endDate = endDate;
		}


		if(regexFilterEnabled !== undefined && regexFilterEnabled !== null){
			queryParameters.regexFilterEnabled = regexFilterEnabled;
		}


		if(sipCallId !== undefined && sipCallId !== null){
			queryParameters.sipCallId = sipCallId;
		}


		if(sipReason !== undefined && sipReason !== null){
			queryParameters.sipReason = sipReason;
		}


		if(lrn !== undefined && lrn !== null){
			queryParameters.lrn = lrn;
		}


		if(sipStatus !== undefined && sipStatus !== null){
			queryParameters.sipStatus = sipStatus;
		}


		if(dialogId !== undefined && dialogId !== null){
			queryParameters.dialogId = dialogId;
		}


		if(orgId !== undefined && orgId !== null){
			queryParameters.orgId = orgId;
		}


		if(cnam !== undefined && cnam !== null){
			queryParameters.cnam = cnam;
		}


		if(from !== undefined && from !== null){
			queryParameters.from = from;
		}


		if(to !== undefined && to !== null){
			queryParameters.to = to;
		}


		if(gatewayId !== undefined && gatewayId !== null){
			queryParameters.gatewayId = gatewayId;
		}


		if(direction !== undefined && direction !== null){
			queryParameters.direction = direction;
		}


		if(serviceId !== undefined && serviceId !== null){
			queryParameters.serviceId = serviceId;
		}


		if(sendTime !== undefined && sendTime !== null){
			queryParameters.sendTime = sendTime;
		}


		if(answerTime !== undefined && answerTime !== null){
			queryParameters.answerTime = answerTime;
		}


		if(receiveTime !== undefined && receiveTime !== null){
			queryParameters.receiveTime = receiveTime;
		}


		if(failTime !== undefined && failTime !== null){
			queryParameters.failTime = failTime;
		}


		if(disconnectTime !== undefined && disconnectTime !== null){
			queryParameters.disconnectTime = disconnectTime;
		}


		if(endTime !== undefined && endTime !== null){
			queryParameters.endTime = endTime;
		}


		if(cnamTime !== undefined && cnamTime !== null){
			queryParameters.cnamTime = cnamTime;
		}


		if(lnpTime !== undefined && lnpTime !== null){
			queryParameters.lnpTime = lnpTime;
		}


		if(rejectTime !== undefined && rejectTime !== null){
			queryParameters.rejectTime = rejectTime;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformendpoints = self.transformendpoints || {};

	/**
     * 
     * @method getMultipleTransformEndpoints
	 * @memberof carrierservices/transformendpoints

	* @param {string} filter - Filter

	* @param {string} pageSize - Page size

	* @param {string} lastEntry - Last entry
	 *
     */
     self.transformendpoints.getMultipleTransformEndpoints = function(filter, pageSize, lastEntry){
		var path = '/api/v1/carrierservices/transformendpoints';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(filter !== undefined && filter !== null){
			queryParameters.filter = filter;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(lastEntry !== undefined && lastEntry !== null){
			queryParameters.lastEntry = lastEntry;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformendpoints = self.transformendpoints || {};

	/**
     * 
     * @method addTransformEndpoint
	 * @memberof carrierservices/transformendpoints

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "swaggerUrl": "",
   "route": "",
   "entity": "",
   "apiFunction": "",
   "ready": true,
   "active": true,
   "batchSize": 0,
   "parallelism": 0,
   "updateProgressEvery": 0,
   "selfUri": ""
}
	 *
     */
     self.transformendpoints.addTransformEndpoint = function(body){
		var path = '/api/v1/carrierservices/transformendpoints';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformendpoints = self.transformendpoints || {};

	/**
     * 
     * @method getTransformEndpointById
	 * @memberof carrierservices/transformendpoints

	* @param {string} id - Endpoint ID
	 *
     */
     self.transformendpoints.getTransformEndpointById = function(id){
		var path = '/api/v1/carrierservices/transformendpoints/{id}';
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
	self.transformendpoints = self.transformendpoints || {};

	/**
     * 
     * @method updateTransformEndpoint
	 * @memberof carrierservices/transformendpoints

	* @param {string} id - Endpoint ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "swaggerUrl": "",
   "route": "",
   "entity": "",
   "apiFunction": "",
   "ready": true,
   "active": true,
   "batchSize": 0,
   "parallelism": 0,
   "updateProgressEvery": 0,
   "selfUri": ""
}
	 *
     */
     self.transformendpoints.updateTransformEndpoint = function(id, body){
		var path = '/api/v1/carrierservices/transformendpoints/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformendpoints = self.transformendpoints || {};

	/**
     * 
     * @method deleteTransformEndpoint
	 * @memberof carrierservices/transformendpoints

	* @param {string} id - Endpoint ID
	 *
     */
     self.transformendpoints.deleteTransformEndpoint = function(id){
		var path = '/api/v1/carrierservices/transformendpoints/{id}';
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
	self.transformprogress = self.transformprogress || {};
	self.transformprogress.search = self.transformprogress.search || {};

	/**
     * 
     * @method getMultipleProgressReports
	 * @memberof carrierservices/transformprogress/search

	* @param {string} service - Service Name
	 *
     */
     self.transformprogress.search.getMultipleProgressReports = function(service){
		var path = '/api/v1/carrierservices/transformprogress/search/{service}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{service}', service);

        if(service === undefined && service !== null){
			throw 'Missing required  parameter: service';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformprogress = self.transformprogress || {};
	self.transformprogress.search = self.transformprogress.search || {};

	/**
     * 
     * @method getMultipleProgressReports
	 * @memberof carrierservices/transformprogress/search

	* @param {string} service - Service Name

	* @param {string} modeltype - Model Type
	 *
     */
     self.transformprogress.search.getMultipleProgressReports = function(service, modeltype){
		var path = '/api/v1/carrierservices/transformprogress/search/{service}/{modeltype}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{service}', service);

        if(service === undefined && service !== null){
			throw 'Missing required  parameter: service';
        }

        path = path.replace('{modeltype}', modeltype);

        if(modeltype === undefined && modeltype !== null){
			throw 'Missing required  parameter: modeltype';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformprogress = self.transformprogress || {};
	self.transformprogress.search = self.transformprogress.search || {};

	/**
     * 
     * @method getMultipleProgressReports
	 * @memberof carrierservices/transformprogress/search

	* @param {string} service - Service Name

	* @param {string} modeltype - Model Type

	* @param {string} modelid - Model ID
	 *
     */
     self.transformprogress.search.getMultipleProgressReports = function(service, modeltype, modelid){
		var path = '/api/v1/carrierservices/transformprogress/search/{service}/{modeltype}/{modelid}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{service}', service);

        if(service === undefined && service !== null){
			throw 'Missing required  parameter: service';
        }

        path = path.replace('{modeltype}', modeltype);

        if(modeltype === undefined && modeltype !== null){
			throw 'Missing required  parameter: modeltype';
        }

        path = path.replace('{modelid}', modelid);

        if(modelid === undefined && modelid !== null){
			throw 'Missing required  parameter: modelid';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.transformprogress = self.transformprogress || {};

	/**
     * 
     * @method getProgressReportById
	 * @memberof carrierservices/transformprogress

	* @param {string} id - Upload Progress ID
	 *
     */
     self.transformprogress.getProgressReportById = function(id){
		var path = '/api/v1/carrierservices/transformprogress/{id}';
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
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.spreadsheets = self.uploadtransform.spreadsheets || {};

	/**
     * 
     * @method getMultipleSpreadsheetTransforms
	 * @memberof carrierservices/uploadtransform/spreadsheets

	* @param {string} filter - Filter

	* @param {string} pageSize - Page size

	* @param {string} lastEntry - Last entry
	 *
     */
     self.uploadtransform.spreadsheets.getMultipleSpreadsheetTransforms = function(filter, pageSize, lastEntry){
		var path = '/api/v1/carrierservices/uploadtransform/spreadsheets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(filter !== undefined && filter !== null){
			queryParameters.filter = filter;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(lastEntry !== undefined && lastEntry !== null){
			queryParameters.lastEntry = lastEntry;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.spreadsheets = self.uploadtransform.spreadsheets || {};

	/**
     * 
     * @method addANewSpreadsheetTransforms
	 * @memberof carrierservices/uploadtransform/spreadsheets

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "restEndpoint": {
      "id": "",
      "name": "",
      "swaggerUrl": "",
      "route": "",
      "entity": "",
      "apiFunction": "",
      "ready": true,
      "active": true,
      "batchSize": 0,
      "parallelism": 0,
      "updateProgressEvery": 0,
      "selfUri": ""
   },
   "filenameTransforms": [],
   "tags": [],
   "sheetNameTransforms": [],
   "sheets": [],
   "clientTransformModel": {
      "id": "",
      "endpointId": "",
      "filenameReplaces": [],
      "tags": [],
      "name": "",
      "sheetNameReplaces": [],
      "sheets": []
   },
   "selfUri": ""
}
	 *
     */
     self.uploadtransform.spreadsheets.addANewSpreadsheetTransforms = function(body){
		var path = '/api/v1/carrierservices/uploadtransform/spreadsheets';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.spreadsheets = self.uploadtransform.spreadsheets || {};

	/**
     * 
     * @method getSpreadsheetTransformById
	 * @memberof carrierservices/uploadtransform/spreadsheets

	* @param {string} id - Transform ID
	 *
     */
     self.uploadtransform.spreadsheets.getSpreadsheetTransformById = function(id){
		var path = '/api/v1/carrierservices/uploadtransform/spreadsheets/{id}';
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
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.spreadsheets = self.uploadtransform.spreadsheets || {};

	/**
     * 
     * @method updateAnExistingSpreadsheetTransform
	 * @memberof carrierservices/uploadtransform/spreadsheets

	* @param {string} id - Transform ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "restEndpoint": {
      "id": "",
      "name": "",
      "swaggerUrl": "",
      "route": "",
      "entity": "",
      "apiFunction": "",
      "ready": true,
      "active": true,
      "batchSize": 0,
      "parallelism": 0,
      "updateProgressEvery": 0,
      "selfUri": ""
   },
   "filenameTransforms": [],
   "tags": [],
   "sheetNameTransforms": [],
   "sheets": [],
   "clientTransformModel": {
      "id": "",
      "endpointId": "",
      "filenameReplaces": [],
      "tags": [],
      "name": "",
      "sheetNameReplaces": [],
      "sheets": []
   },
   "selfUri": ""
}
	 *
     */
     self.uploadtransform.spreadsheets.updateAnExistingSpreadsheetTransform = function(id, body){
		var path = '/api/v1/carrierservices/uploadtransform/spreadsheets/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.spreadsheets = self.uploadtransform.spreadsheets || {};

	/**
     * 
     * @method deleteAnExistingSpreadsheetTransform
	 * @memberof carrierservices/uploadtransform/spreadsheets

	* @param {string} id - Transform ID
	 *
     */
     self.uploadtransform.spreadsheets.deleteAnExistingSpreadsheetTransform = function(id){
		var path = '/api/v1/carrierservices/uploadtransform/spreadsheets/{id}';
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
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.texttables = self.uploadtransform.texttables || {};

	/**
     * 
     * @method getMultipleTextTableTransforms
	 * @memberof carrierservices/uploadtransform/texttables

	* @param {string} filter - Filter
	 *
     */
     self.uploadtransform.texttables.getMultipleTextTableTransforms = function(filter){
		var path = '/api/v1/carrierservices/uploadtransform/texttables';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(filter !== undefined && filter !== null){
			queryParameters.filter = filter;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.texttables = self.uploadtransform.texttables || {};

	/**
     * 
     * @method addTextTableTransform
	 * @memberof carrierservices/uploadtransform/texttables

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "restEndpoint": {
      "id": "",
      "name": "",
      "swaggerUrl": "",
      "route": "",
      "entity": "",
      "apiFunction": "",
      "ready": true,
      "active": true,
      "batchSize": 0,
      "parallelism": 0,
      "updateProgressEvery": 0,
      "selfUri": ""
   },
   "filenameTransforms": [],
   "tags": [],
   "commentSymbol": "",
   "delimiter": "",
   "table": {
      "headerRow": 0,
      "firstData": 0,
      "headerReplaces": [],
      "columns": [],
      "unpivots": [],
      "collapses": []
   },
   "selfUri": ""
}
	 *
     */
     self.uploadtransform.texttables.addTextTableTransform = function(body){
		var path = '/api/v1/carrierservices/uploadtransform/texttables';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.texttables = self.uploadtransform.texttables || {};

	/**
     * 
     * @method getTextTableTransformById
	 * @memberof carrierservices/uploadtransform/texttables

	* @param {string} id - Transform ID
	 *
     */
     self.uploadtransform.texttables.getTextTableTransformById = function(id){
		var path = '/api/v1/carrierservices/uploadtransform/texttables/{id}';
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
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.texttables = self.uploadtransform.texttables || {};

	/**
     * 
     * @method updateAnExistingTextTableTransform
	 * @memberof carrierservices/uploadtransform/texttables

	* @param {string} id - Transform ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "restEndpoint": {
      "id": "",
      "name": "",
      "swaggerUrl": "",
      "route": "",
      "entity": "",
      "apiFunction": "",
      "ready": true,
      "active": true,
      "batchSize": 0,
      "parallelism": 0,
      "updateProgressEvery": 0,
      "selfUri": ""
   },
   "filenameTransforms": [],
   "tags": [],
   "commentSymbol": "",
   "delimiter": "",
   "table": {
      "headerRow": 0,
      "firstData": 0,
      "headerReplaces": [],
      "columns": [],
      "unpivots": [],
      "collapses": []
   },
   "selfUri": ""
}
	 *
     */
     self.uploadtransform.texttables.updateAnExistingTextTableTransform = function(id, body){
		var path = '/api/v1/carrierservices/uploadtransform/texttables/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.uploadtransform = self.uploadtransform || {};
	self.uploadtransform.texttables = self.uploadtransform.texttables || {};

	/**
     * 
     * @method deleteAnExistingTextTableTransform
	 * @memberof carrierservices/uploadtransform/texttables

	* @param {string} id - Transform ID
	 *
     */
     self.uploadtransform.texttables.deleteAnExistingTextTableTransform = function(id){
		var path = '/api/v1/carrierservices/uploadtransform/texttables/{id}';
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
	self.xlsxschemas = self.xlsxschemas || {};

	/**
     * 
     * @method getAllXlsxSchemas
	 * @memberof carrierservices/xlsxschemas
	 *
     */
     self.xlsxschemas.getAllXlsxSchemas = function(){
		var path = '/api/v1/carrierservices/xlsxschemas';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.xlsxschemas = self.xlsxschemas || {};

	/**
     * 
     * @method getXlsxSchemasForACarrier
	 * @memberof carrierservices/xlsxschemas

	* @param {string} carrierId - Carrier ID
	 *
     */
     self.xlsxschemas.getXlsxSchemasForACarrier = function(carrierId){
		var path = '/api/v1/carrierservices/xlsxschemas/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.xlsxschemas = self.xlsxschemas || {};

	/**
     * 
     * @method updateXlsxSchema
	 * @memberof carrierservices/xlsxschemas

	* @param {} body - Schema data

	* @param {string} carrierId - Carrier ID
	 * @example
	 * Body Example:
	 * {
   "SheetSchemas": [],
   "Name": "",
   "CarrierId": ""
}
	 *
     */
     self.xlsxschemas.updateXlsxSchema = function(body, carrierId){
		var path = '/api/v1/carrierservices/xlsxschemas/{carrierId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.xlsxschemas = self.xlsxschemas || {};
	self.xlsxschemas.name = self.xlsxschemas.name || {};

	/**
     * 
     * @method getXlsxSchemas
	 * @memberof carrierservices/xlsxschemas/name

	* @param {string} carrierId - Carrier ID

	* @param {string} name - Schema name
	 *
     */
     self.xlsxschemas.name.getXlsxSchemas = function(carrierId, name){
		var path = '/api/v1/carrierservices/xlsxschemas/{carrierId}/name/{name}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{name}', name);

        if(name === undefined && name !== null){
			throw 'Missing required  parameter: name';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.xlsxschemas = self.xlsxschemas || {};
	self.xlsxschemas.name = self.xlsxschemas.name || {};

	/**
     * 
     * @method deleteXlsxSchema
	 * @memberof carrierservices/xlsxschemas/name

	* @param {string} carrierId - Carrier ID

	* @param {string} name - Schema name
	 *
     */
     self.xlsxschemas.name.deleteXlsxSchema = function(carrierId, name){
		var path = '/api/v1/carrierservices/xlsxschemas/{carrierId}/name/{name}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{carrierId}', carrierId);

        if(carrierId === undefined && carrierId !== null){
			throw 'Missing required  parameter: carrierId';
        }

        path = path.replace('{name}', name);

        if(name === undefined && name !== null){
			throw 'Missing required  parameter: name';
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
      "wrapupCodes": []
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
      "wrapupCodes": []
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
      "wrapupCodes": []
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

	* @param {string} name - Name

	* @param {string} sortBy - Sort by
	 *
     */
     self.sites.getSites = function(pageSize, pageNumber, name, sortBy){
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


		if(name !== undefined && name !== null){
			queryParameters.name = name;
		}


		if(sortBy !== undefined && sortBy !== null){
			queryParameters.sortBy = sortBy;
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
	* @namespace contentmanagement/workspaces/attributes
	**/
	/**
	* @namespace contentmanagement/workspaces/attributes/instances
	**/
	/**
	* @namespace contentmanagement/workspaces/attributes/instances/query
	**/
	/**
	* @namespace contentmanagement/workspaces/delta
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

	* @param {string} moveChildrenToWorkspaceId - 
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
	self.workspaces.attributes = self.workspaces.attributes || {};

	/**
     * 
     * @method getWorkspaceAttributes
	 * @memberof contentmanagement/workspaces/attributes

	* @param {string} workspaceId - Workspace ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.workspaces.attributes.getWorkspaceAttributes = function(workspaceId, pageSize, pageNumber){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes';
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



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};

	/**
     * 
     * @method createWorkspaceAttribute
	 * @memberof contentmanagement/workspaces/attributes

	* @param {string} workspaceId - Workspace ID

	* @param {} body - workspaceAttribute
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "restrictions": {
      "date": {},
      "number": {},
      "string": {},
      "list": {}
   },
   "format": "",
   "multipleValues": true,
   "inUse": true,
   "memberAttributes": [],
   "selfUri": ""
}
	 *
     */
     self.workspaces.attributes.createWorkspaceAttribute = function(workspaceId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes';
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
	self.workspaces.attributes = self.workspaces.attributes || {};

	/**
     * 
     * @method getWorkspaceAttribute
	 * @memberof contentmanagement/workspaces/attributes

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID
	 *
     */
     self.workspaces.attributes.getWorkspaceAttribute = function(workspaceId, attributeId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};

	/**
     * Attribute value will be updated in all documents.
     * @method updateWorkspaceAttribute
	 * @memberof contentmanagement/workspaces/attributes

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "type": "",
   "restrictions": {
      "date": {},
      "number": {},
      "string": {},
      "list": {}
   },
   "format": "",
   "multipleValues": true,
   "inUse": true,
   "memberAttributes": [],
   "selfUri": ""
}
	 *
     */
     self.workspaces.attributes.updateWorkspaceAttribute = function(workspaceId, attributeId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};

	/**
     * Attribute will be removed from all documents.
     * @method deleteWorkspaceAttribute
	 * @memberof contentmanagement/workspaces/attributes

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID
	 *
     */
     self.workspaces.attributes.deleteWorkspaceAttribute = function(workspaceId, attributeId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};
	self.workspaces.attributes.instances = self.workspaces.attributes.instances || {};

	/**
     * Create a workspace attribute group instance. A group instance represents an ordered collection of attribute values that can be associated with documents. An instance is uniquely defined by an attribute group and the attribute values that make it up. Once created, the new instance will be assigned an instance ID that can be used in further API operations. A group instance value can be assigned to one or more workspace documents.
     * @method createAttributeGroupInstance
	 * @memberof contentmanagement/workspaces/attributes/instances

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {} body - instance
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "members": [],
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "attribute": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.workspaces.attributes.instances.createAttributeGroupInstance = function(workspaceId, attributeId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}/instances';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};
	self.workspaces.attributes.instances = self.workspaces.attributes.instances || {};
	self.workspaces.attributes.instances.query = self.workspaces.attributes.instances.query || {};

	/**
     * 
     * @method queryAttributeGroupInstance
	 * @memberof contentmanagement/workspaces/attributes/instances/query

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {} body - Provides a way to query or locate specific attribute group instances. The query request provides the ability to broadly match all instances or filter the results based on matching specific fields defined by the attribute group.
	 * @example
	 * Body Example:
	 * {
   "pageNumber": 0,
   "pageSize": 0,
   "sort": [],
   "members": []
}
	 *
     */
     self.workspaces.attributes.instances.query.queryAttributeGroupInstance = function(workspaceId, attributeId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}/instances/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }

        if(body === undefined && body !== null){
			throw 'Missing required  parameter: body';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};
	self.workspaces.attributes.instances = self.workspaces.attributes.instances || {};

	/**
     * 
     * @method getAttributeGroupInstance
	 * @memberof contentmanagement/workspaces/attributes/instances

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {string} instanceId - Instance ID
	 *
     */
     self.workspaces.attributes.instances.getAttributeGroupInstance = function(workspaceId, attributeId, instanceId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}/instances/{instanceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        path = path.replace('{instanceId}', instanceId);

        if(instanceId === undefined && instanceId !== null){
			throw 'Missing required  parameter: instanceId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};
	self.workspaces.attributes.instances = self.workspaces.attributes.instances || {};

	/**
     * 
     * @method updateAttributeGroupInstance
	 * @memberof contentmanagement/workspaces/attributes/instances

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {string} instanceId - Instance ID

	* @param {} body - Workspace
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "members": [],
   "workspace": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "attribute": {
      "id": "",
      "name": "",
      "selfUri": ""
   },
   "selfUri": ""
}
	 *
     */
     self.workspaces.attributes.instances.updateAttributeGroupInstance = function(workspaceId, attributeId, instanceId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}/instances/{instanceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        path = path.replace('{instanceId}', instanceId);

        if(instanceId === undefined && instanceId !== null){
			throw 'Missing required  parameter: instanceId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.attributes = self.workspaces.attributes || {};
	self.workspaces.attributes.instances = self.workspaces.attributes.instances || {};

	/**
     * 
     * @method deleteAttributeGroupInstance
	 * @memberof contentmanagement/workspaces/attributes/instances

	* @param {string} workspaceId - Workspace ID

	* @param {string} attributeId - Attribute ID

	* @param {string} instanceId - Instance ID
	 *
     */
     self.workspaces.attributes.instances.deleteAttributeGroupInstance = function(workspaceId, attributeId, instanceId){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/attributes/{attributeId}/instances/{instanceId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{workspaceId}', workspaceId);

        if(workspaceId === undefined && workspaceId !== null){
			throw 'Missing required  parameter: workspaceId';
        }

        path = path.replace('{attributeId}', attributeId);

        if(attributeId === undefined && attributeId !== null){
			throw 'Missing required  parameter: attributeId';
        }

        path = path.replace('{instanceId}', instanceId);

        if(instanceId === undefined && instanceId !== null){
			throw 'Missing required  parameter: instanceId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workspaces = self.workspaces || {};
	self.workspaces.delta = self.workspaces.delta || {};

	/**
     * Only usable on personal workspaces.
     * @method retrieveDelta
	 * @memberof contentmanagement/workspaces/delta

	* @param {string} workspaceId - Workspace ID

	* @param {} body - DeltaRequest
	 * @example
	 * Body Example:
	 * {
   "contextToken": ""
}
	 *
     */
     self.workspaces.delta.retrieveDelta = function(workspaceId, body){
		var path = '/api/v1/contentmanagement/workspaces/{workspaceId}/delta';
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.diagnostics";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.diagnostics = (function (PureCloud) {
	/**
	* @namespace diagnostics
	**/
	/**
	* @namespace diagnostics/support
	**/
	/**
	* @namespace diagnostics/trace
	**/

	var self = {};

	/**
     * 
     * @method sendDiagnosticEmail
	 * @memberof diagnostics

	* @param {} body - Diagnostic
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "topic": "",
   "description": "",
   "priority": "",
   "type": "",
   "data": {}
}
	 *
     */
     self.sendDiagnosticEmail = function(body){
		var path = '/api/v1/diagnostics';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.support = self.support || {};

	/**
     * 
     * @method contactSupport
	 * @memberof diagnostics/support

	* @param {} body - Diagnostic
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "topic": "",
   "description": "",
   "priority": "",
   "type": "",
   "data": {}
}
	 *
     */
     self.support.contactSupport = function(body){
		var path = '/api/v1/diagnostics/support';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.trace = self.trace || {};

	/**
     * 
     * @method traceMessages
	 * @memberof diagnostics/trace

	* @param {} body - Trace List
	 * @example
	 * Body Example:
	 * {
   "app": {
      "appId": "",
      "appVersion": ""
   },
   "traces": []
}
	 *
     */
     self.trace.traceMessages = function(body){
		var path = '/api/v1/diagnostics/trace';
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.evaluations";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.evaluations = (function (PureCloud) {
	/**
	* @namespace evaluations/favoritetemplates
	**/
	/**
	* @namespace evaluations/templates
	**/

	var self = {};
	self.favoritetemplates = self.favoritetemplates || {};

	/**
     * 
     * @method getFavoriteTemplates
	 * @memberof evaluations/favoritetemplates
	 *
     */
     self.favoritetemplates.getFavoriteTemplates = function(){
		var path = '/api/v1/evaluations/favoritetemplates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.favoritetemplates = self.favoritetemplates || {};

	/**
     * 
     * @method setFavoriteTemplate
	 * @memberof evaluations/favoritetemplates

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "templateId": ""
}
	 *
     */
     self.favoritetemplates.setFavoriteTemplate = function(body){
		var path = '/api/v1/evaluations/favoritetemplates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.favoritetemplates = self.favoritetemplates || {};

	/**
     * 
     * @method unsetFavoriteTemplate
	 * @memberof evaluations/favoritetemplates

	* @param {string} templateId - 
	 *
     */
     self.favoritetemplates.unsetFavoriteTemplate = function(templateId){
		var path = '/api/v1/evaluations/favoritetemplates/{templateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{templateId}', templateId);

        if(templateId === undefined && templateId !== null){
			throw 'Missing required  parameter: templateId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method getTemplates
	 * @memberof evaluations/templates

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand

	* @param {string} tags - Tags
	 *
     */
     self.templates.getTemplates = function(pageSize, pageNumber, expand, tags){
		var path = '/api/v1/evaluations/templates';
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


		if(tags !== undefined && tags !== null){
			queryParameters.tags = tags;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method createTemplate
	 * @memberof evaluations/templates

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "createdDate": "",
   "modifiedDate": "",
   "version": 0,
   "level": "",
   "tags": [],
   "data": {},
   "selfUri": ""
}
	 *
     */
     self.templates.createTemplate = function(body){
		var path = '/api/v1/evaluations/templates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method getComposerTemplate
	 * @memberof evaluations/templates

	* @param {string} templateId - Template ID
	 *
     */
     self.templates.getComposerTemplate = function(templateId){
		var path = '/api/v1/evaluations/templates/{templateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{templateId}', templateId);

        if(templateId === undefined && templateId !== null){
			throw 'Missing required  parameter: templateId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method updateComposerTemplate
	 * @memberof evaluations/templates

	* @param {string} templateId - Template ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "description": "",
   "createdDate": "",
   "modifiedDate": "",
   "version": 0,
   "level": "",
   "tags": [],
   "data": {},
   "selfUri": ""
}
	 *
     */
     self.templates.updateComposerTemplate = function(templateId, body){
		var path = '/api/v1/evaluations/templates/{templateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{templateId}', templateId);

        if(templateId === undefined && templateId !== null){
			throw 'Missing required  parameter: templateId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method deleteComposerTemplate
	 * @memberof evaluations/templates

	* @param {string} templateId - Template ID
	 *
     */
     self.templates.deleteComposerTemplate = function(templateId){
		var path = '/api/v1/evaluations/templates/{templateId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{templateId}', templateId);

        if(templateId === undefined && templateId !== null){
			throw 'Missing required  parameter: templateId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.featuretoggles";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.featuretoggles = (function (PureCloud) {
	/**
	* @namespace featuretoggles
	**/

	var self = {};

	/**
     * 
     * @method getEnabledFeatures
	 * @memberof featuretoggles

	* @param {array} feature - The features to query.
	 *
     */
     self.getEnabledFeatures = function(feature){
		var path = '/api/v1/featuretoggles';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(feature !== undefined && feature !== null){
			queryParameters.feature = feature;
		}



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
	/**
	* @namespace flows/actions/checkin
	**/
	/**
	* @namespace flows/actions/checkout
	**/
	/**
	* @namespace flows/actions/deactivate
	**/
	/**
	* @namespace flows/actions/debug
	**/
	/**
	* @namespace flows/actions/publish
	**/
	/**
	* @namespace flows/actions/revert
	**/
	/**
	* @namespace flows/latestconfiguration
	**/
	/**
	* @namespace flows/publishedresults
	**/
	/**
	* @namespace flows/versions
	**/
	/**
	* @namespace flows/versions/configuration
	**/

	var self = {};

	/**
     * Multiple IDs can be specified, in which case all matching flows will be returned, and no other parameters will be evaluated.
     * @method getFlows
	 * @memberof flows

	* @param {string} type - 

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
	self.actions = self.actions || {};
	self.actions.checkin = self.actions.checkin || {};

	/**
     * 
     * @method checkinFlow
	 * @memberof flows/actions/checkin

	* @param {string} flow - 
	 *
     */
     self.actions.checkin.checkinFlow = function(flow){
		var path = '/api/v1/flows/actions/checkin';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.actions = self.actions || {};
	self.actions.checkout = self.actions.checkout || {};

	/**
     * 
     * @method checkoutFlow
	 * @memberof flows/actions/checkout

	* @param {string} flow - 
	 *
     */
     self.actions.checkout.checkoutFlow = function(flow){
		var path = '/api/v1/flows/actions/checkout';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.actions = self.actions || {};
	self.actions.deactivate = self.actions.deactivate || {};

	/**
     * 
     * @method deactivateFlow
	 * @memberof flows/actions/deactivate

	* @param {string} flow - 
	 *
     */
     self.actions.deactivate.deactivateFlow = function(flow){
		var path = '/api/v1/flows/actions/deactivate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.actions = self.actions || {};
	self.actions.debug = self.actions.debug || {};

	/**
     * 
     * @method debugFlow
	 * @memberof flows/actions/debug

	* @param {string} flow - 

	* @param {string} version - 
	 *
     */
     self.actions.debug.debugFlow = function(flow, version){
		var path = '/api/v1/flows/actions/debug';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}


		if(version !== undefined && version !== null){
			queryParameters.version = version;
		}

        if(version === undefined && version !== null){
			throw 'Missing required  parameter: version';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.actions = self.actions || {};
	self.actions.publish = self.actions.publish || {};

	/**
     * 
     * @method publishFlow
	 * @memberof flows/actions/publish

	* @param {string} flow - 

	* @param {string} version - 
	 *
     */
     self.actions.publish.publishFlow = function(flow, version){
		var path = '/api/v1/flows/actions/publish';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}


		if(version !== undefined && version !== null){
			queryParameters.version = version;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.actions = self.actions || {};
	self.actions.revert = self.actions.revert || {};

	/**
     * 
     * @method revertFlow
	 * @memberof flows/actions/revert

	* @param {string} flow - 
	 *
     */
     self.actions.revert.revertFlow = function(flow){
		var path = '/api/v1/flows/actions/revert';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(flow !== undefined && flow !== null){
			queryParameters.flow = flow;
		}



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getFlow
	 * @memberof flows

	* @param {string} flowId - Flow ID

	* @param {string} doDeleted - Deleted
	 *
     */
     self.getFlow = function(flowId, doDeleted){
		var path = '/api/v1/flows/{flowId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }


		if(doDeleted !== undefined && doDeleted !== null){
			queryParameters.deleted = doDeleted;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateFlow
	 * @memberof flows

	* @param {string} flowId - Flow ID

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
     self.updateFlow = function(flowId, body){
		var path = '/api/v1/flows/{flowId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteFlow
	 * @memberof flows

	* @param {string} flowId - Flow ID
	 *
     */
     self.deleteFlow = function(flowId){
		var path = '/api/v1/flows/{flowId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.latestconfiguration = self.latestconfiguration || {};

	/**
     * 
     * @method getLatestConfigurationFlow
	 * @memberof flows/latestconfiguration

	* @param {string} flowId - Flow ID

	* @param {string} doDeleted - Deleted
	 *
     */
     self.latestconfiguration.getLatestConfigurationFlow = function(flowId, doDeleted){
		var path = '/api/v1/flows/{flowId}/latestconfiguration';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }


		if(doDeleted !== undefined && doDeleted !== null){
			queryParameters.deleted = doDeleted;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.publishedresults = self.publishedresults || {};

	/**
     * 
     * @method getGenerationResult
	 * @memberof flows/publishedresults

	* @param {string} flowId - Flow ID

	* @param {string} id - Publish Result ID
	 *
     */
     self.publishedresults.getGenerationResult = function(flowId, id){
		var path = '/api/v1/flows/{flowId}/publishedresults/{id}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.versions = self.versions || {};

	/**
     * 
     * @method getFlowVersions
	 * @memberof flows/versions

	* @param {string} flowId - Flow ID

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size

	* @param {string} doDeleted - Deleted
	 *
     */
     self.versions.getFlowVersions = function(flowId, pageNumber, pageSize, doDeleted){
		var path = '/api/v1/flows/{flowId}/versions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(doDeleted !== undefined && doDeleted !== null){
			queryParameters.deleted = doDeleted;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.versions = self.versions || {};

	/**
     * 
     * @method createFlowVersion
	 * @memberof flows/versions

	* @param {string} flowId - Flow ID

	* @param {} body - 
	 *
     */
     self.versions.createFlowVersion = function(flowId, body){
		var path = '/api/v1/flows/{flowId}/versions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.versions = self.versions || {};

	/**
     * 
     * @method getFlowVersion
	 * @memberof flows/versions

	* @param {string} flowId - Flow ID

	* @param {string} versionId - Version ID

	* @param {string} doDeleted - Deleted
	 *
     */
     self.versions.getFlowVersion = function(flowId, versionId, doDeleted){
		var path = '/api/v1/flows/{flowId}/versions/{versionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }

        path = path.replace('{versionId}', versionId);

        if(versionId === undefined && versionId !== null){
			throw 'Missing required  parameter: versionId';
        }


		if(doDeleted !== undefined && doDeleted !== null){
			queryParameters.deleted = doDeleted;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.versions = self.versions || {};
	self.versions.configuration = self.versions.configuration || {};

	/**
     * 
     * @method createFlowVersionConfiguration
	 * @memberof flows/versions/configuration

	* @param {string} flowId - Flow ID

	* @param {string} versionId - Version ID

	* @param {string} doDeleted - Deleted
	 *
     */
     self.versions.configuration.createFlowVersionConfiguration = function(flowId, versionId, doDeleted){
		var path = '/api/v1/flows/{flowId}/versions/{versionId}/configuration';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{flowId}', flowId);

        if(flowId === undefined && flowId !== null){
			throw 'Missing required  parameter: flowId';
        }

        path = path.replace('{versionId}', versionId);

        if(versionId === undefined && versionId !== null){
			throw 'Missing required  parameter: versionId';
        }


		if(doDeleted !== undefined && doDeleted !== null){
			queryParameters.deleted = doDeleted;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.health";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.health = (function (PureCloud) {
	/**
	* @namespace health/check
	**/

	var self = {};
	self.check = self.check || {};

	/**
     * 
     * @method getHealth
	 * @memberof health/check
	 *
     */
     self.check.getHealth = function(){
		var path = '/health/check';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



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
      "array": true,
      "null": true,
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "nodeType": "",
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
      "binary": true
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.processautomation";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.processautomation = (function (PureCloud) {
	/**
	* @namespace processautomation/associations/documents/history
	**/
	/**
	* @namespace processautomation/flows/definitions
	**/
	/**
	* @namespace processautomation/flows/definitions/commands/activate
	**/
	/**
	* @namespace processautomation/flows/definitions/commands/associatewithworkspaces
	**/
	/**
	* @namespace processautomation/flows/definitions/commands/delete
	**/
	/**
	* @namespace processautomation/flows/definitions/commands/lock
	**/
	/**
	* @namespace processautomation/flows/definitions/flowcache
	**/
	/**
	* @namespace processautomation/flows/definitions/versions
	**/
	/**
	* @namespace processautomation/flows/definitions/versions/commands/publish
	**/
	/**
	* @namespace processautomation/flows/instances
	**/
	/**
	* @namespace processautomation/flows/instances/commands/search
	**/
	/**
	* @namespace processautomation/flows/instances/commands/terminate
	**/
	/**
	* @namespace processautomation/flows/instances/history
	**/
	/**
	* @namespace processautomation/reports/flow/search
	**/
	/**
	* @namespace processautomation/workitems/instances/commands/search
	**/
	/**
	* @namespace processautomation/workitems/instances
	**/
	/**
	* @namespace processautomation/workitems/instances/commands/submit
	**/
	/**
	* @namespace processautomation/workitems/instances/commands/takeownership
	**/
	/**
	* @namespace processautomation/workitems/instances/commands/transfer
	**/
	/**
	* @namespace processautomation/workitems/instances/workitemcache
	**/

	var self = {};
	self.associations = self.associations || {};
	self.associations.documents = self.associations.documents || {};
	self.associations.documents.history = self.associations.documents.history || {};

	/**
     * Gets the flow history elements for flows that related to the given document.Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method getHistoryByDocument
	 * @memberof processautomation/associations/documents/history

	* @param {string} id - ID
	 *
     */
     self.associations.documents.history.getHistoryByDocument = function(id){
		var path = '/api/v1/processautomation/associations/documents/{id}/history';
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
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};

	/**
     * This method will get all the flows defined in your organization.<br> The method will get the flows without regard to individual versions.  So a particular flow might have many versions but only a single entry representing them all as a unit will be returned.<br><br>The method supports two kinds of filters on what data gets returned:<br><p>+  The 'typeFilter' param can be a comma-separated list of flow types that you want, or empty/omitted to get them all. Currently only the Workflow type is supported, but in the future other might be supported as well.</p><br><p>+  The 'stateFilter' param can be a comma-separated list of state types, or empty/omitted to get them all.
 So values like "Active,Inactive,Deleted" or any combination thereof are appropriate here.</p><br><p>+  The 'permissionFilter' param can be a comma-separated list of permissions you want to limit the list to, or empty/omitted to get them all.
 So a value like "Launch" is useful here to just get the flows you're permitted to launch.</p>Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method getFlows
	 * @memberof processautomation/flows/definitions

	* @param {integer} pageSize - The number of entries to return per page, or omitted for the default.

	* @param {integer} pageNumber - The page number to return, or omitted for the first page.

	* @param {string} typeFilter - A comma-separated list of flow types that you want, or empty/omitted to get them all.

	* @param {string} stateFilter - A comma-separated list of state types, or empty/omitted to get them all.

	* @param {string} permissionFilter - A comma-separated list of permissions to restrict by, or empty/omitted to get them all.
	 *
     */
     self.flows.definitions.getFlows = function(pageSize, pageNumber, typeFilter, stateFilter, permissionFilter){
		var path = '/api/v1/processautomation/flows/definitions';
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


		if(typeFilter !== undefined && typeFilter !== null){
			queryParameters.typeFilter = typeFilter;
		}


		if(stateFilter !== undefined && stateFilter !== null){
			queryParameters.stateFilter = stateFilter;
		}


		if(permissionFilter !== undefined && permissionFilter !== null){
			queryParameters.permissionFilter = permissionFilter;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};

	/**
     * The base flows are the flow that don't consider the specific versions of that flow - the base flow refers to all of its versions as one unit.  So base flows have a one-to-many relationship with versioned flows.<br><br>This method will create a new base flow object, and assign it a new id.<br><br>The usual process is that you'll want to create a base flow first, giving the flow a name and description which apply to all the versions as a whole, then create one or more versioned flows that reference that base.
     * @method postBaseFlow
	 * @memberof processautomation/flows/definitions

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "configState": "",
   "flowType": "",
   "lockedByUser": {
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
   "newestPublishedVersion": "",
   "newestVersion": "",
   "associatedWorkspaces": [],
   "description": "",
   "selfUri": ""
}
	 *
     */
     self.flows.definitions.postBaseFlow = function(body){
		var path = '/api/v1/processautomation/flows/definitions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};

	/**
     * This returns the stuff about a given flow that is not specific to individual versions of that flow, like its name, description, activation state, and current locking owner, etc.<br>NOTE: be careful to check the Deleted state of the object you get back, and don't let the UI change it if it's marked as deleted!<br>The requesting user must have permission to view the flow information.
     * @method getFlow
	 * @memberof processautomation/flows/definitions

	* @param {string} id - ID
	 *
     */
     self.flows.definitions.getFlow = function(id){
		var path = '/api/v1/processautomation/flows/definitions/{id}';
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
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.commands = self.flows.definitions.commands || {};
	self.flows.definitions.commands.activate = self.flows.definitions.commands.activate || {};

	/**
     * Updates the Activation state of a flow, which in part controls whether or not it is publicly launchable
     * @method activateBaseFlow
	 * @memberof processautomation/flows/definitions/commands/activate

	* @param {string} id - ID

	* @param {} body - activate options
	 * @example
	 * Body Example:
	 * {
   "activated": true
}
	 *
     */
     self.flows.definitions.commands.activate.activateBaseFlow = function(id, body){
		var path = '/api/v1/processautomation/flows/definitions/{id}/commands/activate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.commands = self.flows.definitions.commands || {};
	self.flows.definitions.commands.associatewithworkspaces = self.flows.definitions.commands.associatewithworkspaces || {};

	/**
     * Adjusts the association between a flow and zero or more Workspaces.
     * @method associateFlowWithWorkspaces
	 * @memberof processautomation/flows/definitions/commands/associatewithworkspaces

	* @param {string} id - ID

	* @param {} body - activate options
	 * @example
	 * Body Example:
	 * {
   "workspaces": []
}
	 *
     */
     self.flows.definitions.commands.associatewithworkspaces.associateFlowWithWorkspaces = function(id, body){
		var path = '/api/v1/processautomation/flows/definitions/{id}/commands/associatewithworkspaces';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.commands = self.flows.definitions.commands || {};
	self.flows.definitions.commands.delete = self.flows.definitions.commands.delete || {};

	/**
     * Permanently marks the base flow as deleted.  It is still available for historical use; the flow will no longer be launchable.
     * @method deleteBaseFlow
	 * @memberof processautomation/flows/definitions/commands/delete

	* @param {string} id - ID
	 *
     */
     self.flows.definitions.commands.delete.deleteBaseFlow = function(id){
		var path = '/api/v1/processautomation/flows/definitions/{id}/commands/delete';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.commands = self.flows.definitions.commands || {};
	self.flows.definitions.commands.lock = self.flows.definitions.commands.lock || {};

	/**
     * Updates the locked state of a flow, which affects a caller's ability to make changes to a flow
     * @method lockBaseFlow
	 * @memberof processautomation/flows/definitions/commands/lock

	* @param {string} id - ID

	* @param {} body - lock options
	 * @example
	 * Body Example:
	 * {
   "locked": true
}
	 *
     */
     self.flows.definitions.commands.lock.lockBaseFlow = function(id, body){
		var path = '/api/v1/processautomation/flows/definitions/{id}/commands/lock';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.flowcache = self.flows.definitions.flowcache || {};

	/**
     * Gets a user saved version of a flow definition.
     * @method getFlowDefinitionCache
	 * @memberof processautomation/flows/definitions/flowcache

	* @param {string} id - ID
	 *
     */
     self.flows.definitions.flowcache.getFlowDefinitionCache = function(id){
		var path = '/api/v1/processautomation/flows/definitions/{id}/flowcache';
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
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.flowcache = self.flows.definitions.flowcache || {};

	/**
     * This cache is used to save a flow's definition that is still in progress and is not ready to be made official.
     * @method updateFlowDefinitionCache
	 * @memberof processautomation/flows/definitions/flowcache

	* @param {string} id - ID

	* @param {} body - flow definition data
	 *
     */
     self.flows.definitions.flowcache.updateFlowDefinitionCache = function(id, body){
		var path = '/api/v1/processautomation/flows/definitions/{id}/flowcache';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.versions = self.flows.definitions.versions || {};

	/**
     * This is for getting a list of all versioned flows.  So there could potentially be a lot of data here. Like if some designer guy decides to publish one hundred versions of his workflow they might all get returned here.<br>NOTE: be careful because this API does not check to see if the base flow is marked as Deleted or not.<br>You probably won't want to call this API very often, usually for situations like where the UI has a "restore a previous version of the flow" listbox.Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method getVersionedFlows
	 * @memberof processautomation/flows/definitions/versions

	* @param {string} id - Flow ID

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.flows.definitions.versions.getVersionedFlows = function(id, pageSize, pageNumber){
		var path = '/api/v1/processautomation/flows/definitions/{id}/versions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.versions = self.flows.definitions.versions || {};

	/**
     * This method requires the base flow to be already created... and then (with permission) you can create a versioned flow that references it.  This method will set the meta-data of that versioned flow you're creating, and return to you a Uri of the user-upload-service where you can supply the bits of the flow definition.<br><br>There is a Process Definition File for each version of a process.  The Process Definition File contains all of the definitions for everything used by the process.  Eventually, we may support Shared Data Types, Shared Sequences, etc. that are defined in separate files, are organization-global and useable across multiple process definitions for the same organization, but such shared objects are beyond the scope of the initial release.<br><br>The Process Definition File contains Data Type Definitions, Variable Definitions, Sequence Definitions, and Actions, Outputs and Connections.<br><br>Variable Definitions can be created in process-scope or sequence-scope.  A Variable Definition always references a Data Type Definition, regardless of whether the Variable Definition is defining a basic, simple or complex variable.  ( In IPA, basic variables did not have a separate data type definition, but simple and complex variables did.)  The Data Type Definition does not indicate whether a variable is or is not a collection; that configuration is on the Variable Definition.  Variable Definitions scoped to the Process Definition or a Task Definition may be marked as Input Parameters and/or Output Parameters, but Variable Definitions scoped to a State Sequence Definition can marked as neither Input nor Output Parameters.<br><br>An Action is the smallest unit of executable.  Actions are added to Sequence Definitions, and no Action can exist outside of a Sequence Definition.  There are currently two types of Sequence Definitions: State Sequence Definitions and Task Sequence Definitions.  They are very similar, and may generally contain the same kinds of actions, with few restrictions.  A State Sequence Definition is called via a ChangeState action, cannot have input or output parameters, does not induce any Outputs onto the ChangeState action that calls the sequence, and cannot use the ExitTask action.  A Task Sequence Definition is called via the CallTaskSync action, can have input and/or output parameters, may induce Outputs onto the CallTaskSync action that calls the sequence, and can use the ExitTask action.<br><br>An Action may have zero or more Outputs, where each Output is essentially just a pointer to another Action within the same Sequence Definition via an associated Connection object.  An Action with no Outputs is a Terminating Action because it causes the current sequence to end.  Examples of terminating actions are ChangeState, ExitTask and EndProcess.  All non-terminating actions will have at least one Output.  Some actions have a fixed set of outputs (i.e. Conditional if with true/false).  Many actions will have a Default Output that is always present.  Sometimes the Default Output may be the only Output (i.e. UpdateVariables).  Sometimes Outputs get induced into an action by something the action references (i.e. RunProcessSync has a Default Output, but may also gets induced outputs due to Process End Reasons from the referenced Process Definition).<br><br>A Connection connects a specific Output of a specific Action to another Action, or even back to the same Action.  Think of Connections as the "arrows" that the server follows while the server is executing a flow: the server runs an Action; if it is a non-terminating Action, then after the action has completed the server selects an Output on that Action; once the Output is selected, the server looks for a Connection from that Output to another Action, but if there is no Connection for that output then the server exits the sequence (i.e. ExitTask(Default) if it is a Task Sequence Definition, or EndProcess(Default) if it is a State Sequence Definition).<br><br>Note:  There is no need for a Loop action.  This is because a Connection can point from an Output of an Action back to the same action, which is itself inherently a loop.<br><br><br>Page Definition JSON Guidelines<br>The following subsections list the general guides lines to follow when creating JSON objects to be include on the Process Definition File.<br><br>Keep the JSON Shallow Instead of Deep<br>There will always be some level of nesting within JSON: JSON itself always has one root object that contains everything else.  But, as a general rule, we want to keep the JSON shallow instead of deep.  This necessarily implies that fields that reference really complex objects are preferred over fields that contain really complex objects.  For example, rather than nest actions inside of actions that are also nested inside of other actions, all actions within the same sequence are defined within a single list because they are in the scope.  Then, there is another list at sequence scope that contains all of the connections between all of the actions.  Keep things shallow generally makes it easy to find the object you are looking for given it's ID, and nesting deep does not easily allow for structures like actions that connect back to another action earlier in the flow.<br><br>Mind the Well-Known Field Names<br>This file format uses several well-known field names, such as the ones below:<br>    "_meta"<br>    "id"<br>    "refId"<br>    "designer"<br>    "config"<br><br>That list of well-known field names above is not necessarily complete at this time, and will be extended as necessary.  All of the field names within that list should be discussed in this page.
<br>The well-known field names shall only be used for their intended purposes.  Other fields may contain the well known names within a substring of their entire field names. (i.e. "designer" must conform to the rules for "designer", but "myDesigner" could be used for something else.
<br>The "_meta" Field
<br>For deserialization or interpretation purposes, some objects may need a meta section to capture information such as the version of a serialization format.  When present, the field name shall be "_meta", and it shall always be the first field within the object.
<br>There is not currently a specific set of what may or may not appear in a meta object.  Each meta object will likely have the "objectType" field, which holds a string that indicates what type of data is contained by the object with the "_meta" field.  Other possible fields that may be used are "formatType" and/or "formatVersion".  The idea is that the meta object should contain any information that may be necessary for an application to know or understand the other fields that are siblings of the "_meta" field within the same object. 
<br>Generally speaking, the fields within a JSON object are allowed to be in any order, and some serializers may choose to always write the fields in alphabetic order by default.  But, it is somewhat pointless to even have the "_meta" field if it is not first since it's information could not then be used to know what to expect while deserializing the remainder of the object.  Therefore, the meta field intentionally starts with an underscore character to force it to the top if the fields get sorted during serialization.
<br>Also, it is intended that the meta can really appear within almost any object.  Basically, if a bit of extra information is is needed to understand or parse something, a "_meta" field can be added to help interpret the other fields that are siblings of the _meta field.  All "definition" objects should have a meta object that, at a minimum, indicates "objectType".
<br><br><pre>{    // This field, if present, must always be first!<br>    "_meta":<br>    {<br>        // These are some suggest field names, but may not apply in all cases<br>        "objectType": <string><br>        "formatType": <string>,<br>        "formatRevision": <version>,<br> <br>        // Could really have just about anything else here, too<br>        ....<br>    },<br> <br>    // More fields for this specific object must come after the "_meta"<br>    ...<br>}<br> <br>// Null "_meta" is allowed<br>{<br>    "_meta": null,<br>    ...<br>}<br> <br>// Empty object "_meta" is allowed<br>{<br>    "_meta: {},<br>    ...<br>}<br>// Omitted "_meta" is allowed<br>{<br>    ...<br>}</pre><br><br><br>IDs and "id" & "refId" Fields<br><br>The process definition uses IDs!!!  Think of an ID as something that uniquely identifies an object definition.  Conceptually, they are like GUIDs.  However, in reality, something a bit less verbose than GUIDs may be used.<br><br>In an attempt to more easily figure out which object owns/defines/declares the ID vs. which objects just reference the ID, the field name of all owned IDs will be "id" and the field name for all referenced IDs will be "refId".  Additionally, the "refId" shall always be inside a container object, which is intended to<br><br>    Allow for additional information that describe the scope/context in which the ID indicated by "refId" can be found, if necessary<br>    Accommodate the need to reference multiple objects from within the same parent object<br>    Eventually support the ability to reference objects defined outside of the Process Definition, such as shared Data Type Definitins or PureCloud Composer Scripts.<br><br>The field name of the "refId" container object should generally end with "Ref".<br><pre>// Object definition that is assigning an ID to itself; The "id" field does not have to be first<br>{<br>    ...,<br>    "id": <id>,<br>    ...<br>}</pre><br> <br>// Object definition that is referencing the object above via the "refId" field<br><pre>{<br>    // Container object for the "fieldOne" reference<br>    "fieldOneRef":<br>    {<br>        ...,<br> <br>        // This field indicates the ID of that other object that is being referenced<br>        "refId": <id>,<br> <br>        // If necessary, we can add additional fields that describe the scope/context in which<br>        // the object being referenced is expected to be found.<br>        ...<br>    },<br> <br>    // Since "refId" is a well-known field name but the containing object's field names are not<br>    // (i.e. "fieldOneRef" and "fieldTwoRef" are not well-known field names) the same parent object<br>    // can easily reference multiple other objects, while keeping the "refId" field name consistent.<br>    "fieldTwoRef":<br>    {<br>        ...,<br>        "refId": <id>,<br>        ...<br>    }<br>}</pre><br><br>The "identity" Field
<br>Everything about declaring the identity of the object is stored in the "identity" field.  This includes things like the "id" field, if necessary, as well as optional "name" and "description" fields in which store information entered by the user via the designer; it is unclear at this point whether the designer will or will not actually allow the user to view and/or enter a label and/or description for every major object, but the format will at least support it wherever the designer chooses to allow it!  Other information specific to certain object types, such as the revision of the Process Definition, could potentially also be stored in this object.<br><pre>{<br>    "identity":<br>    {<br>        "id":<id>,<br>        "name":string,<br>        "description":<string><br>    }<br>}</pre><br><br>Note:  The "name" and "description" fields should generally be treated as user-mutable, display only – so don't write any code to make any decisions based on a string value in "name or description"!  For example, don't look for an output named "true" on a ConditionalIf action, because it could be localized to another language, or the user may have changed it to "yes", "on", etc.<br>The "designer" Field<br><br>Any designer-specific information shall be isolated into an object under a "designer" field.  This is a well-known field name, and is intended to better faciliate the creation of a streamlined, compiled version of the process definition, etc. should the server decide that it wants to do so.  It is assumed that anything within an object used as the value for a "designer" field is not needed at runtime by the server or by clients.<br><pre>{<br>    "designer":<br>    {<br>        ...,<br>        "notes": <string>,<br>        ...<br>    }<br>}</pre><br><br>A "designer" field can occur at many levels within the JSON, and can always be ignored by the server.  As an example of something that may be added to a designer field, consider the Connections between an Action's Output an the next Action.  The server needs to know what the connection is (i.e. Action's Output points to another Action), but does not need how the connection looks when "drawn" by the user (i.e. goes up, right, down, right, etc.)<br><br>The sample JSON above shows a "notes" field in object used as the value for the "designer" field.  The "identity" section mentioned previously had "name" and "description" fields.  The idea of adding "notes" into the designer field is to allow people designing the process to add very verbose notes about design decisions, etc.  That differs from the identity.descripion, which is intended to be more of a an end-user viewable description, such as a description that assists the user to select the correct Process Definition to launch.<br>The "config" Field<br><br>Many of the objects may have a "config" field.  The contents of this field will generally be specific to the object.  This is were details about Action configuration, Variables configuration, etc. will be located.<br>The "definitions" field and Definition Lists<br><br>Many of the JSON definition objects will themselves also contain definition lists.  For example the Process Definition objects will have a Data Type Definitions list, Variable Definitions list, Sequence Definitions list, End Process Reasons List,. etc.  The Sequence Definition will have an Action Definitions List, Connection Definitions List, Exit Reasons Definitions List, etc. <br><br>When an object definition itself needs to include one or more definition lists, the object shall have a "definitions" field, and the value of that field is an object where the field names are the names of the definition lists.  Additionally, each of those field names that contains a single definition list will generally end with "Def", and every object definition within a definition list will have an "identity" field.  If the objects with a specific definition list have identity.name fields, then each of those identity.name fields shall be unique among all of the objects within that same definition list!<br>// This is a definition object.  Generally speaking, definition lists will exist within some other definition object.<br><pre>{<br>    ...,<br> <br>    // This field contains all of the definition lists,if any<br>    "definitions":<br>    {<br>        // This is the definition list for abcDef objects<br>        "abcDefs":<br>        [<br>            // Each abcDef object has an identity.id<br>            {<br>                "identity":<br>                {<br>                    "id":<id>,<br>                    "name":<string>,<br>                }<br>            },<br> <br>            // There can be any number of definition objects within this definition list,<br>            // but each of them must have a different value for identity.name.<br>            ...<br>        ],<br> <br>        // This is the definition list of xyzDef objects<br>        "xyzDefs":<br>        [<br>            // Each xyzDef object has an identity.id<br>            {<br>                "identity":<br>                {<br>                    "id":<id>,<br> <br>                    // The value of this identity.name field could be the same as a definition<br>                    // object within the "abcDefs" definition list above because the definition<br>                    // objects exist within different definition lists.<br>                    "name":<string><br>                }<br>            },<br>            ...<br>        ]<br>    },<br> <br>    ...,<br>}</pre><br>No Back-Pointers<br><br>Generally speaking, the JSON should stay away from back-pointers.  A back-pointer is a reference back to the parent object definition that has the definitions list that contains the object doing the back-pointing.  For example, a StateSequenceDefinition exists within the ProcessDefinition.definitions.stateSequenceDefs list:<br><br>    Process Definition<br>        definitions<br>            stateSequenceDefs<br>                StateSequenceDefinition<br><br> <br><br>In the example above, the JSON for the StateSeqenceDefinition should not point back to the stateSequenceDefs definitions list, or to the definitions field that contains that definitions list, or the Process Definition that contains that definitions field.  There is no need for such back-pointers because the relationship is already implied by the structure of the JSON.  With that said, however, it is likely that applications may find it useful to create such back-pointers in memory for the purpose of navigating through and manipulating the object graph; they just don't need to serialize it into the JSON.<br>Object Definition Template<br><br>Given the guidelines above, the following is kind of a template for all JSON object definitions.  For any specific definition, however, some of the sections or fields within those sections may not apply.<br><pre>{<br>    "_meta":<br>    {<br>    },<br> <br>    "identity":<br>    {<br>    },<br> <br>    // Keep in mind that the "designer" fields can really exist anywhere,<br>    // not just at the top of a definition.<br>    "designer":<br>    {<br>    },<br> <br>    "config":<br>    {<br>    },<br> <br>    "definitions":<br>    {<br>    }<br>}</pre><br>
     * @method postVersionedFlow
	 * @memberof processautomation/flows/definitions/versions

	* @param {string} id - Flow ID

	* @param {boolean} keepFlowCache - Keep flow definition cache

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "versionSpecificComment": "",
   "flowDefinitionUri": "",
   "flowDefinitionUploaded": true,
   "createdByUser": {
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
   "selfUri": "",
   "version": ""
}
	 *
     */
     self.flows.definitions.versions.postVersionedFlow = function(id, keepFlowCache, body){
		var path = '/api/v1/processautomation/flows/definitions/{id}/versions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }


		if(keepFlowCache !== undefined && keepFlowCache !== null){
			queryParameters.keepFlowCache = keepFlowCache;
		}

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.versions = self.flows.definitions.versions || {};

	/**
     * This will get the meta-data about a particular version of a flow.<br>Also, if you specify a query parameter of  'wantDownloadUri=true', the service will return to you an Uri of a location where you can download the flow  definition content.
     * @method getVersionedFlow
	 * @memberof processautomation/flows/definitions/versions

	* @param {string} id - Flow ID

	* @param {string} version - Flow Version

	* @param {boolean} wantDownloadUri - True if you want an Uri to download the flow definition content.
	 *
     */
     self.flows.definitions.versions.getVersionedFlow = function(id, version, wantDownloadUri){
		var path = '/api/v1/processautomation/flows/definitions/{id}/versions/{version}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        path = path.replace('{version}', version);

        if(version === undefined && version !== null){
			throw 'Missing required  parameter: version';
        }


		if(wantDownloadUri !== undefined && wantDownloadUri !== null){
			queryParameters.wantDownloadUri = wantDownloadUri;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.definitions = self.flows.definitions || {};
	self.flows.definitions.versions = self.flows.definitions.versions || {};
	self.flows.definitions.versions.commands = self.flows.definitions.versions.commands || {};
	self.flows.definitions.versions.commands.publish = self.flows.definitions.versions.commands.publish || {};

	/**
     * Minor versions are not "seen" by regular agents, they're only seen by the Designer for intermediate work. <br>When a flow is considered suitable for general use, it gets promoted to a major version with this API, which then makes it visible to regular agents for use. <br>Note that there is no "unpublish" action, if you find there's a problem with your flow then you can either mark is as inactive (so nobody can launch that flow) or re-publish a prior version that you have from some export over the top of the one you don't like.
     * @method publishFlow
	 * @memberof processautomation/flows/definitions/versions/commands/publish

	* @param {string} id - Flow ID

	* @param {string} version - Flow Version
	 *
     */
     self.flows.definitions.versions.commands.publish.publishFlow = function(id, version){
		var path = '/api/v1/processautomation/flows/definitions/{id}/versions/{version}/commands/publish';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        path = path.replace('{version}', version);

        if(version === undefined && version !== null){
			throw 'Missing required  parameter: version';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.instances = self.flows.instances || {};

	/**
     * Launches the most recently published version of the flow.  Accepts a FlowLaunch data object as a payload.Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method launchFlow
	 * @memberof processautomation/flows/instances

	* @param {} flowLaunch - 
	 * @example
	 * Body Example:
	 * {
   "flowConfigId": {
      "id": "",
      "name": "",
      "selfUri": "",
      "version": ""
   },
   "flowInstanceName": "",
   "inputData": {
      "linkedDocumentIds": []
   },
   "launchType": ""
}
	 *
     */
     self.flows.instances.launchFlow = function(flowLaunch){
		var path = '/api/v1/processautomation/flows/instances';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(flowLaunch !== undefined && flowLaunch !== null){
            requestBody = flowLaunch;
        }

        if(flowLaunch === undefined && flowLaunch !== null){
			throw 'Missing required  parameter: flowLaunch';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.instances = self.flows.instances || {};
	self.flows.instances.commands = self.flows.instances.commands || {};
	self.flows.instances.commands.search = self.flows.instances.commands.search || {};

	/**
     * Searches the pool of running flow instances given a SearchRequest object and returns the matching results. Some Search Examples:Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") <br>Note the various filters, sort and searchPhrase options can be combined/omitted as needed.<br>Search for a specific definition id:<br>{<br>&nbsp;&nbsp;&nbsp;"filters": [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "flowConfigId.id",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "STRING",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"operator": "EQUALS",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"e88db9fb-aaa0-46f8-81d5-4a30e323bdfa"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;]<br>}<br><br>Search for a specific execution instance and sort on the config name:<br>{<br>&nbsp;&nbsp;&nbsp;"filters": [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "flowExecId",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "STRING",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"operator": "EQUALS",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"99"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;],<br>&nbsp;&nbsp;&nbsp;"sort" : [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name":"flowConfigName",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sortType":"ASCENDING"<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;]<br>}<br>Search for a specific phrase:<br>{<br>&nbsp;&nbsp;&nbsp;"searchPhrase" : "hi mom!" <br>}<br>
     * @method searchFlowInstances
	 * @memberof processautomation/flows/instances/commands/search

	* @param {} body - SearchRequest data containing search parameters and paging response.
	 * @example
	 * Body Example:
	 * {
   "pageNumber": 0,
   "pageSize": 0,
   "facetRequests": [],
   "sort": [],
   "filters": [],
   "groupBy": []
}
	 *
     */
     self.flows.instances.commands.search.searchFlowInstances = function(body){
		var path = '/api/v1/processautomation/flows/instances/commands/search';
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
	self.flows = self.flows || {};
	self.flows.instances = self.flows.instances || {};

	/**
     * This will get the information about the current running state of the flow.Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method getFlowDetails
	 * @memberof processautomation/flows/instances

	* @param {string} id - Flow Exec ID
	 *
     */
     self.flows.instances.getFlowDetails = function(id){
		var path = '/api/v1/processautomation/flows/instances/{id}';
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
	self.flows = self.flows || {};
	self.flows.instances = self.flows.instances || {};
	self.flows.instances.commands = self.flows.instances.commands || {};
	self.flows.instances.commands.terminate = self.flows.instances.commands.terminate || {};

	/**
     * Terminates a flow instance
     * @method terminateFlowInstance
	 * @memberof processautomation/flows/instances/commands/terminate

	* @param {string} id - Flow Exec ID

	* @param {} body - terminate options
	 * @example
	 * Body Example:
	 * {
   "force": true,
   "reason": ""
}
	 *
     */
     self.flows.instances.commands.terminate.terminateFlowInstance = function(id, body){
		var path = '/api/v1/processautomation/flows/instances/{id}/commands/terminate';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.flows = self.flows || {};
	self.flows.instances = self.flows.instances || {};
	self.flows.instances.history = self.flows.instances.history || {};

	/**
     * Get the history of a flow instance
     * @method getFlowHistory
	 * @memberof processautomation/flows/instances/history

	* @param {string} id - Flow Exec ID
	 *
     */
     self.flows.instances.history.getFlowHistory = function(id){
		var path = '/api/v1/processautomation/flows/instances/{id}/history';
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
	self.reports = self.reports || {};
	self.reports.flow = self.reports.flow || {};
	self.reports.flow.search = self.reports.flow.search || {};

	/**
     * Searches the pool of running and completed flow instances given a ReportRequest object and returns the matching results.
     * @method generateFlowReport
	 * @memberof processautomation/reports/flow/search

	* @param {} body - ReportRequest data containing search parameters and paging response.
	 * @example
	 * Body Example:
	 * {
   "pageNumber": 0,
   "pageSize": 0,
   "facetRequests": [],
   "sort": [],
   "filters": [],
   "groupBy": []
}
	 *
     */
     self.reports.flow.search.generateFlowReport = function(body){
		var path = '/api/v1/processautomation/reports/flow/search';
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
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.commands = self.workitems.instances.commands || {};
	self.workitems.instances.commands.search = self.workitems.instances.commands.search || {};

	/**
     * Searches the pool of running workitems given a SearchRequest object and returns the results.  Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") Some search examples:<br>Note the various filters, sort and searchPhrase options can be combined/omitted as needed.<br>Search for a specific definition id:<br>{<br>&nbsp;&nbsp;&nbsp;"filters": [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "flowConfigId.id",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "STRING",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"operator": "EQUALS",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"e88db9fb-aaa0-46f8-81d5-4a30e323bdfa"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;]<br>}<br><br>Search for a specific execution instance and sort on the config name:<br>{<br>&nbsp;&nbsp;&nbsp;"filters": [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "flowExecId",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"type": "STRING",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"operator": "EQUALS",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"values": [<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"99"<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;],<br>&nbsp;&nbsp;&nbsp;"sort" : [<br>&nbsp;&nbsp;&nbsp;{<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name":"flowConfigName",<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sortType":"ASCENDING"<br>&nbsp;&nbsp;&nbsp;}<br>&nbsp;&nbsp;&nbsp;]<br>}<br>Search for a specific phrase:<br>{<br>&nbsp;&nbsp;&nbsp;"searchPhrase" : "hi mom!" <br>}<br>
     * @method searchWorkItemInstances
	 * @memberof processautomation/workitems/instances/commands/search

	* @param {} body - SearchRequest data containing search parameters and paging response.
	 * @example
	 * Body Example:
	 * {
   "pageNumber": 0,
   "pageSize": 0,
   "facetRequests": [],
   "sort": [],
   "filters": [],
   "groupBy": []
}
	 *
     */
     self.workitems.instances.commands.search.searchWorkItemInstances = function(body){
		var path = '/api/v1/processautomation/workitems/instances/commands/search';
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
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};

	/**
     * Gets the details of a work item including the information needed to display its simple form, if it has one.
     * @method getWorkItemDetails
	 * @memberof processautomation/workitems/instances

	* @param {string} id - Work Item Exec ID
	 *
     */
     self.workitems.instances.getWorkItemDetails = function(id){
		var path = '/api/v1/processautomation/workitems/instances/{id}';
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
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.commands = self.workitems.instances.commands || {};
	self.workitems.instances.commands.submit = self.workitems.instances.commands.submit || {};

	/**
     * <p>Signals the flow to continue executing using the specified command of the given work item.</p><p>Common error conditions to be aware of are:<dl><dd>error.workflow.flows.workItem.ownership - the given user was denied the ability to own the work item</dd><dd>error.workflow.flows.workItem.owned - the work item is already owned by somebody else</dd><dd>error.workflow.flows.workItem.notExist - the work item does not exist, possibly because it was already submitted by someone else</dd><dd>error.workflow.flows.workItem.submit - some other error submitting the work item</dd></dl></p>
     * @method submitWorkItem
	 * @memberof processautomation/workitems/instances/commands/submit

	* @param {string} id - Work Item Exec ID

	* @param {} body - submit request data
	 * @example
	 * Body Example:
	 * {
   "commandId": "",
   "dataItems": []
}
	 *
     */
     self.workitems.instances.commands.submit.submitWorkItem = function(id, body){
		var path = '/api/v1/processautomation/workitems/instances/{id}/commands/submit';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.commands = self.workitems.instances.commands || {};
	self.workitems.instances.commands.takeownership = self.workitems.instances.commands.takeownership || {};

	/**
     * Basically, this is called by a client to assign ownership to the currently connected user.  Only the user that has ownership can submit against a work item.  This will be rejected is someone else owns it, like if it’s in a group queue and somebody grabs it at the same time.  The first guy wins the ownership. 
     * @method takeOwnershipOfWorkItem
	 * @memberof processautomation/workitems/instances/commands/takeownership

	* @param {string} id - Work Item Exec ID
	 *
     */
     self.workitems.instances.commands.takeownership.takeOwnershipOfWorkItem = function(id){
		var path = '/api/v1/processautomation/workitems/instances/{id}/commands/takeownership';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.commands = self.workitems.instances.commands || {};
	self.workitems.instances.commands.transfer = self.workitems.instances.commands.transfer || {};

	/**
     * Unassigns a work item, if currently assigned, and offers a work item to another user or group; the work item is initially unassigned (meaning un-owned).   You have to own the item to transfer it, unless you’re an admin and using a “force” flag.
     * @method transferWorkItem
	 * @memberof processautomation/workitems/instances/commands/transfer

	* @param {string} id - Work Item Exec ID

	* @param {} body - transfer request data
	 * @example
	 * Body Example:
	 * {
   "transferTargetType": "",
   "transferTarget": ""
}
	 *
     */
     self.workitems.instances.commands.transfer.transferWorkItem = function(id, body){
		var path = '/api/v1/processautomation/workitems/instances/{id}/commands/transfer';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.workitemcache = self.workitems.instances.workitemcache || {};

	/**
     * Gets a user saved cache of workItem data. Note this uri accepts the queryParameter expand to filter users and groups (EG "expand=users", "expand=users, groups", "expand=all") 
     * @method getWorkItemCache
	 * @memberof processautomation/workitems/instances/workitemcache

	* @param {string} id - Work Item Exec ID
	 *
     */
     self.workitems.instances.workitemcache.getWorkItemCache = function(id){
		var path = '/api/v1/processautomation/workitems/instances/{id}/workitemcache';
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
	self.workitems = self.workitems || {};
	self.workitems.instances = self.workitems.instances || {};
	self.workitems.instances.workitemcache = self.workitems.instances.workitemcache || {};

	/**
     * The cache is automatically deleted when a workItem is submitted.
     * @method updateWorkItemCache
	 * @memberof processautomation/workitems/instances/workitemcache

	* @param {string} id - Work Item Exec ID

	* @param {} body - workItem cache data
	 * @example
	 * Body Example:
	 * {
   "workItemExecId": "",
   "saveTime": "",
   "saveUser": {
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
   "saveComment": "",
   "dataItems": []
}
	 *
     */
     self.workitems.instances.workitemcache.updateWorkItemCache = function(id, body){
		var path = '/api/v1/processautomation/workitems/instances/{id}/workitemcache';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{id}', id);

        if(id === undefined && id !== null){
			throw 'Missing required  parameter: id';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.responsemanagement";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.responsemanagement = (function (PureCloud) {
	/**
	* @namespace responsemanagement/libraries
	**/
	/**
	* @namespace responsemanagement/responses
	**/
	/**
	* @namespace responsemanagement/responses/query
	**/

	var self = {};
	self.libraries = self.libraries || {};

	/**
     * 
     * @method getLibraries
	 * @memberof responsemanagement/libraries

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.libraries.getLibraries = function(pageNumber, pageSize){
		var path = '/api/v1/responsemanagement/libraries';
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
	self.libraries = self.libraries || {};

	/**
     * 
     * @method createLibrary
	 * @memberof responsemanagement/libraries

	* @param {} body - Library
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "version": 0,
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
   "dateCreated": "",
   "selfUri": ""
}
	 *
     */
     self.libraries.createLibrary = function(body){
		var path = '/api/v1/responsemanagement/libraries';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.libraries = self.libraries || {};

	/**
     * 
     * @method getLibrary
	 * @memberof responsemanagement/libraries

	* @param {string} libraryId - Library ID
	 *
     */
     self.libraries.getLibrary = function(libraryId){
		var path = '/api/v1/responsemanagement/libraries/{libraryId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{libraryId}', libraryId);

        if(libraryId === undefined && libraryId !== null){
			throw 'Missing required  parameter: libraryId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.libraries = self.libraries || {};

	/**
     * Fields that can be updated: name. The most recent version is required for updates.
     * @method updateLibrary
	 * @memberof responsemanagement/libraries

	* @param {string} libraryId - Library ID

	* @param {} body - Library
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "version": 0,
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
   "dateCreated": "",
   "selfUri": ""
}
	 *
     */
     self.libraries.updateLibrary = function(libraryId, body){
		var path = '/api/v1/responsemanagement/libraries/{libraryId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{libraryId}', libraryId);

        if(libraryId === undefined && libraryId !== null){
			throw 'Missing required  parameter: libraryId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.libraries = self.libraries || {};

	/**
     * This will remove any responses associated with the library.
     * @method deleteLibrary
	 * @memberof responsemanagement/libraries

	* @param {string} libraryId - Library ID
	 *
     */
     self.libraries.deleteLibrary = function(libraryId){
		var path = '/api/v1/responsemanagement/libraries/{libraryId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{libraryId}', libraryId);

        if(libraryId === undefined && libraryId !== null){
			throw 'Missing required  parameter: libraryId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};

	/**
     * 
     * @method getResponses
	 * @memberof responsemanagement/responses

	* @param {string} libraryId - Library ID

	* @param {integer} pageNumber - Page number

	* @param {integer} pageSize - Page size
	 *
     */
     self.responses.getResponses = function(libraryId, pageNumber, pageSize){
		var path = '/api/v1/responsemanagement/responses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};


		if(libraryId !== undefined && libraryId !== null){
			queryParameters.libraryId = libraryId;
		}

        if(libraryId === undefined && libraryId !== null){
			throw 'Missing required  parameter: libraryId';
        }


		if(pageNumber !== undefined && pageNumber !== null){
			queryParameters.pageNumber = pageNumber;
		}


		if(pageSize !== undefined && pageSize !== null){
			queryParameters.pageSize = pageSize;
		}



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};

	/**
     * 
     * @method createResponse
	 * @memberof responsemanagement/responses

	* @param {} body - Response
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "version": 0,
   "libraries": [],
   "texts": [],
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
   "dateCreated": "",
   "selfUri": ""
}
	 *
     */
     self.responses.createResponse = function(body){
		var path = '/api/v1/responsemanagement/responses';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};
	self.responses.query = self.responses.query || {};

	/**
     * 
     * @method queryResponses
	 * @memberof responsemanagement/responses/query

	* @param {} body - Response
	 * @example
	 * Body Example:
	 * {
   "queryPhrase": "",
   "pageSize": 0,
   "filters": []
}
	 *
     */
     self.responses.query.queryResponses = function(body){
		var path = '/api/v1/responsemanagement/responses/query';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};

	/**
     * 
     * @method getResponse
	 * @memberof responsemanagement/responses

	* @param {string} responseId - Response ID
	 *
     */
     self.responses.getResponse = function(responseId){
		var path = '/api/v1/responsemanagement/responses/{responseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{responseId}', responseId);

        if(responseId === undefined && responseId !== null){
			throw 'Missing required  parameter: responseId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};

	/**
     * Fields that can be updated: name, libraries, and texts. The most recent version is required for updates.
     * @method updateResponse
	 * @memberof responsemanagement/responses

	* @param {string} responseId - Response ID

	* @param {} body - Response
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "version": 0,
   "libraries": [],
   "texts": [],
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
   "dateCreated": "",
   "selfUri": ""
}
	 *
     */
     self.responses.updateResponse = function(responseId, body){
		var path = '/api/v1/responsemanagement/responses/{responseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{responseId}', responseId);

        if(responseId === undefined && responseId !== null){
			throw 'Missing required  parameter: responseId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.responses = self.responses || {};

	/**
     * This will remove the response from any libraries associated with it.
     * @method deleteResponse
	 * @memberof responsemanagement/responses

	* @param {string} responseId - Response ID
	 *
     */
     self.responses.deleteResponse = function(responseId){
		var path = '/api/v1/responsemanagement/responses/{responseId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{responseId}', responseId);

        if(responseId === undefined && responseId !== null){
			throw 'Missing required  parameter: responseId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
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
	/**
	* @namespace scripts/published
	**/
	/**
	* @namespace scripts/published/pages
	**/
	/**
	* @namespace scripts/published/variables
	**/
	/**
	* @namespace scripts/templates
	**/
	/**
	* @namespace scripts/pages
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
	self.published = self.published || {};

	/**
     * 
     * @method getPublishedScripts
	 * @memberof scripts/published

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number

	* @param {string} expand - Expand

	* @param {string} name - Name

	* @param {string} feature - Feature
	 *
     */
     self.published.getPublishedScripts = function(pageSize, pageNumber, expand, name, feature){
		var path = '/api/v1/scripts/published';
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
	self.published = self.published || {};

	/**
     * 
     * @method publishScript
	 * @memberof scripts/published

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "scriptId": "",
   "versionId": ""
}
	 *
     */
     self.published.publishScript = function(body){
		var path = '/api/v1/scripts/published';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.published = self.published || {};

	/**
     * 
     * @method getPublishedScript
	 * @memberof scripts/published

	* @param {string} scriptId - Script ID
	 *
     */
     self.published.getPublishedScript = function(scriptId){
		var path = '/api/v1/scripts/published/{scriptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.published = self.published || {};
	self.published.pages = self.published.pages || {};

	/**
     * 
     * @method getPublishedPages
	 * @memberof scripts/published/pages

	* @param {string} scriptId - Script ID
	 *
     */
     self.published.pages.getPublishedPages = function(scriptId){
		var path = '/api/v1/scripts/published/{scriptId}/pages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.published = self.published || {};
	self.published.pages = self.published.pages || {};

	/**
     * 
     * @method getPublishedPage
	 * @memberof scripts/published/pages

	* @param {string} scriptId - Script ID

	* @param {string} pageId - Page ID
	 *
     */
     self.published.pages.getPublishedPage = function(scriptId, pageId){
		var path = '/api/v1/scripts/published/{scriptId}/pages/{pageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        path = path.replace('{pageId}', pageId);

        if(pageId === undefined && pageId !== null){
			throw 'Missing required  parameter: pageId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.published = self.published || {};
	self.published.variables = self.published.variables || {};

	/**
     * 
     * @method getPublishedVariables
	 * @memberof scripts/published/variables

	* @param {string} scriptId - Script ID
	 *
     */
     self.published.variables.getPublishedVariables = function(scriptId){
		var path = '/api/v1/scripts/published/{scriptId}/variables';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.templates = self.templates || {};

	/**
     * 
     * @method createScriptTemplate
	 * @memberof scripts/templates

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "name": "",
   "description": "",
   "tags": [],
   "scriptId": "",
   "userId": ""
}
	 *
     */
     self.templates.createScriptTemplate = function(body){
		var path = '/api/v1/scripts/templates';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method getScript
	 * @memberof scripts

	* @param {string} scriptId - Script ID
	 *
     */
     self.getScript = function(scriptId){
		var path = '/api/v1/scripts/{scriptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateScript
	 * @memberof scripts

	* @param {string} scriptId - Script ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "versionId": "",
   "createdDate": "",
   "modifiedDate": "",
   "publishedDate": "",
   "versionDate": "",
   "startPageId": "",
   "startPageName": "",
   "features": {},
   "variables": {},
   "customActions": {},
   "selfUri": ""
}
	 *
     */
     self.updateScript = function(scriptId, body){
		var path = '/api/v1/scripts/{scriptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method deleteScript
	 * @memberof scripts

	* @param {string} scriptId - Script ID
	 *
     */
     self.deleteScript = function(scriptId){
		var path = '/api/v1/scripts/{scriptId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };
	self.pages = self.pages || {};

	/**
     * 
     * @method getPages
	 * @memberof scripts/pages

	* @param {string} scriptId - Script ID
	 *
     */
     self.pages.getPages = function(scriptId){
		var path = '/api/v1/scripts/{scriptId}/pages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.pages = self.pages || {};

	/**
     * 
     * @method createPage
	 * @memberof scripts/pages

	* @param {string} scriptId - Script ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "versionId": "",
   "createdDate": "",
   "modifiedDate": "",
   "rootContainer": {},
   "properties": {},
   "selfUri": ""
}
	 *
     */
     self.pages.createPage = function(scriptId, body){
		var path = '/api/v1/scripts/{scriptId}/pages';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };
	self.pages = self.pages || {};

	/**
     * 
     * @method getPage
	 * @memberof scripts/pages

	* @param {string} scriptId - Script ID

	* @param {string} pageId - Page ID
	 *
     */
     self.pages.getPage = function(scriptId, pageId){
		var path = '/api/v1/scripts/{scriptId}/pages/{pageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        path = path.replace('{pageId}', pageId);

        if(pageId === undefined && pageId !== null){
			throw 'Missing required  parameter: pageId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };
	self.pages = self.pages || {};

	/**
     * 
     * @method updatePage
	 * @memberof scripts/pages

	* @param {string} scriptId - Script ID

	* @param {string} pageId - Page ID

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "id": "",
   "name": "",
   "versionId": "",
   "createdDate": "",
   "modifiedDate": "",
   "rootContainer": {},
   "properties": {},
   "selfUri": ""
}
	 *
     */
     self.pages.updatePage = function(scriptId, pageId, body){
		var path = '/api/v1/scripts/{scriptId}/pages/{pageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        path = path.replace('{pageId}', pageId);

        if(pageId === undefined && pageId !== null){
			throw 'Missing required  parameter: pageId';
        }

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('PUT', path + '?' +$.param(queryParameters), requestBody);
     };
	self.pages = self.pages || {};

	/**
     * 
     * @method deletePage
	 * @memberof scripts/pages

	* @param {string} scriptId - Script ID

	* @param {string} pageId - Page ID
	 *
     */
     self.pages.deletePage = function(scriptId, pageId){
		var path = '/api/v1/scripts/{scriptId}/pages/{pageId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{scriptId}', scriptId);

        if(scriptId === undefined && scriptId !== null){
			throw 'Missing required  parameter: scriptId';
        }

        path = path.replace('{pageId}', pageId);

        if(pageId === undefined && pageId !== null){
			throw 'Missing required  parameter: pageId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.sessions";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.sessions = (function (PureCloud) {
	/**
	* @namespace sessions
	**/

	var self = {};

	/**
     * 
     * @method getSessions
	 * @memberof sessions

	* @param {integer} pageSize - Page size

	* @param {integer} pageNumber - Page number
	 *
     */
     self.getSessions = function(pageSize, pageNumber){
		var path = '/api/v1/sessions';
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
     * @method createSession
	 * @memberof sessions

	* @param {} body - 
	 * @example
	 * Body Example:
	 * {
   "minutesToLive": 0
}
	 *
     */
     self.createSession = function(body){
		var path = '/api/v1/sessions';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        if(body !== undefined && body !== null){
            requestBody = body;
        }



		return PureCloud.makeRequest('POST', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method retrieveClientSession
	 * @memberof sessions

	* @param {string} sessionId - Session ID
	 *
     */
     self.retrieveClientSession = function(sessionId){
		var path = '/api/v1/sessions/{sessionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sessionId}', sessionId);

        if(sessionId === undefined && sessionId !== null){
			throw 'Missing required  parameter: sessionId';
        }



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method removeClientSession
	 * @memberof sessions

	* @param {string} sessionId - Session ID
	 *
     */
     self.removeClientSession = function(sessionId){
		var path = '/api/v1/sessions/{sessionId}';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};

        path = path.replace('{sessionId}', sessionId);

        if(sessionId === undefined && sessionId !== null){
			throw 'Missing required  parameter: sessionId';
        }



		return PureCloud.makeRequest('DELETE', path + '?' +$.param(queryParameters), requestBody);
     };

	return self;
}(PureCloud));

if(!window.PureCloud){
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.settings";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.settings = (function (PureCloud) {
	/**
	* @namespace settings
	**/

	var self = {};

	/**
     * 
     * @method getSettings
	 * @memberof settings
	 *
     */
     self.getSettings = function(){
		var path = '/api/v1/settings';
	    var requestBody;
	    var queryParameters = {};
	    var headers = {};
	    var form = {};



		return PureCloud.makeRequest('GET', path + '?' +$.param(queryParameters), requestBody);
     };

	/**
     * 
     * @method updateSettings
	 * @memberof settings

	* @param {} body - 
	 *
     */
     self.updateSettings = function(body){
		var path = '/api/v1/settings';
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
	* @namespace telephony/providers/edge/timezones
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
      "array": true,
      "null": true,
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "nodeType": "",
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
      "binary": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "hardwareIdType": ""
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
      "array": true,
      "null": true,
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "nodeType": "",
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
      "binary": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "hardwareIdType": ""
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
      "array": true,
      "null": true,
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "nodeType": "",
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
      "binary": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "hardwareIdType": ""
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
      "array": true,
      "null": true,
      "valueNode": true,
      "containerNode": true,
      "missingNode": true,
      "object": true,
      "nodeType": "",
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
      "binary": true
   },
   "capabilities": {
      "provisions": true,
      "registers": true,
      "hardwareIdType": ""
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
	var errorMsg = "PureCloud core is not defined, make sure you reference PureCloud.core before you include PureCloud.tokens";
	if(console && console.error){
		console.error(errorMsg);
	}else {
		console.log(errorMsg);
	}
}

PureCloud.tokens = (function (PureCloud) {

	var self = {};

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

	* @param {string} userId - 
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

	* @param {string} userId - 

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

	* @param {string} userId - 

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
