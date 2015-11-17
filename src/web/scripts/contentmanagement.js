/*global PureCloud:false */
/*exported contentmanagement */
/* jshint -W097 */
'use strict';

var contentmanagement = (function(){
    var currentPage = 0;

    return{
        getWorkspaces:function(callback) {
            if(callback !== null){
                PureCloud.contentmanagement.getWorkspaces(100,1,"content").done(function(data){
                    var workspaceDefinitions = data.entities;
                    callback(workspaceDefinitions);
                }).error(function(){
                    location.reload();
                });
            }

        },
        loadFiles:function(workspaceId, maxSize, searchString, page, callback){

            var searchBody = {
                  "pageNumber": page,
                  "pageSize": 50,
                  "facetNameRequests": [
                    "tags",
                    "createdByDisplayName",
                    "contentType",
                    "name",
                    "contentLength",
                    "dateModified"
                  ],
                  "sort": [
                    {
                      "name": "name",
                      "ascending": false
                    }
                  ],
                  "filters": [
                      {
                        "systemFilter": false,
                        "id": "workspaceId",
                        "type": "STRING",
                        "name": "workspaceId",
                        "operator": "EQUALS",
                        "values": [
                          workspaceId
                        ]
                    }
                  ],
                  "queryPhrase":searchString

              };

            currentPage = 1;
            $.ajax({
                method: 'POST',
                url: '/api/v1/contentmanagement/query',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 200000,
                data:JSON.stringify(searchBody  )
            }).success(function (data) {
                if(callback){
                    callback(data.results.pageCount, data.results.total, data.results.entities);
                }
            });
        }
    };

});
