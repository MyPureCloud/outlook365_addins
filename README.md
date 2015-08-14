
Environment variables
---------------------
**PORT** - The port to run the web server on

**COOKIESTORE** - A secure Id for the cookie

**OAUTHSECRET** - the OAuth Client Secret

**OAUTHIDID** - The OAuth Client Id

**ENV** - The purecloud environment

Testing Locally
---------------
To test locally, make sure that the above environment variables are set and run the rakefile to build and run the web server.  Import test.xml into your outlook account, this will make a request to load test.html.  

In the handlePage method in server.go, there is a line that looks like
```
if fileName == "/test.html" {
	fileName = "/voicemail.html"
}
```
change the fileName to the page you actually want to test and return back to the user.
