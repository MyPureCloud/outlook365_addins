Running Locally
---------------
* clone repo
* run
	```
	npm install
	```
* run
	```
	bower install
	```
* start the local server
	```
	npm start
	```
* setup localhost test addin in Outlook 365
  * Log into OWA
  * Change the url from /owa to /ecp

  ![](src/web/images/setup/ecpurl.png)

  * Select apps from the options list

  ![](src/web/images/setup/apps.png)
  * Find the drop down and select Add from File

  ![](src/web/images/setup/addfromfile.png)

  _If you can't see that setting, you need to request from you outlook admin to enable access to install your own applications._

  * select /config/test.xml


* to change the app that loads instead of a teat page, change this handler in the server to redirect to the page you want to test
  ```
  app.get("/test.html", function(req, res){
      res.redirect("voicemail.html");
  })
  ```

  The CDN Mess
  ------------
  We host static files on cloudfront which allows us to version them and let the browser cache them to quicken requests.  This is great except that Outlook for Mac doesn't seem to like to load the files from cloudfront.  Oddly enough, if I use ngrok they load fine, handlebars is loaded from cloudflare and that loads fine and if I proxy the files through runscope before hitting cloudfront, they also load fine.  WTF.  So instead of using cloudflare for the assets we will load them through rawgit which will pull them out of github for the tagged build.  
