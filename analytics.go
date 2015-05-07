package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
)

func handleAnalytics(w http.ResponseWriter, r *http.Request) {

	var ga = os.Getenv("ANALYTICS")

	w.Header().Set("Content-Type", "application/json")

	if ga != "" {
		log.Printf("returning analytics")
		analyticsTemplate.Execute(w, struct {
			Key string
		}{ga})
	} else {
		blankTemplate.Execute(w, struct{}{})
	}

}

var analyticsTemplate = template.Must(template.New("analytics").Parse(analytics_templ))
var blankTemplate = template.Must(template.New("analyticsblank").Parse(""))

const analytics_templ = `
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', '{{.Key}}', 'auto');
ga('send', 'pageview');
`
