var contentmanagement = (function(){
    currentPage = 0;


    return{
        getWorkspaces:function(callback) {

            if(callback != null){
                $.ajax({
                    method: 'GET',
                    url: '/api/v1/contentmanagement/workspaces?pageSize=100&pageNumber=1&access=content',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'text/plain'
                    },
                    timeout: 2000
                }).success(function (data, status, headers, config) {
                    var workspaceDefinitions = data.entities;
                    var workspaces = {};

                    callback(workspaceDefinitions);
                }).error(function(data, status,headers,config){
                    location.reload();
                })

            }

        },
        loadFiles:function(workspaceId, maxSize, searchString, page, callback){

            var searchBody = {
                  "pageNumber": page,
                  "pageSize": 50,
                  "queryPhrase": "",
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

                  ],
                  "queryPhrase":searchString

              };

              if(workspaceId != null && workspaceId.length > 0){
                  searchBody.filters.push({
                    "systemFilter": false,
                    "id": "workspaceId",
                    "type": "STRING",
                    "name": "workspaceId",
                    "operator": "EQUALS",
                    "values": [
                      workspaceId
                    ]
                });
              }

              //102400
              if(maxSize != null && maxSize>0){
                  searchBody.filters.push({
                    "systemFilter": false,
                    "id": "contentLength",
                    "type": "NUMBER",
                    "operator": "RANGE",
                    "name": "contentLength",
                    "values": [
                      0,
                      maxSize
                    ]
                  })
              }


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
            }).success(function (data, status, headers, config) {
                if(callback){
                    callback(data.results.pageCount, data.results.total, data.results.entities);
                }
            })
        }
    }

});
