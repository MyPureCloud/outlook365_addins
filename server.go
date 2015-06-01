package main

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"github.com/gorilla/mux"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
)

var (
	apiUrl, _      = url.Parse("https://public-api.us-east-1.inindca.com")
	platformUrl, _ = url.Parse("https://apps.inindca.com/platform")
)

var (
	exchangeContentRegex, _ = regexp.Compile("<t:Content>(.*)</t:Content>")
	exchangeBodyRegex, _    = regexp.Compile("<t:Body[\n.]*</t:Body>")
	phoneRegex, _           = regexp.Compile(`#43;\d{11}`)
	timeRegex, _            = regexp.Compile(`\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}`)
	durationRegex, _        = regexp.Compile(`Duration: (\d*) seconds`)
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/oauth2/callback", callback)
	r.HandleFunc("/{page}.html", handlePage)
	r.HandleFunc("/{file}.xml", handlePage)

	r.HandleFunc("/analytics.js", handleAnalytics)

	r.PathPrefix("/styles/").Handler(http.StripPrefix("/styles/", http.FileServer(http.Dir("./public/styles"))))
	r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir("./public/images"))))
	r.PathPrefix("/scripts/").Handler(http.StripPrefix("/scripts/", http.FileServer(http.Dir("./public/scripts"))))

	r.PathPrefix("/api/").HandlerFunc(handleApi)

	r.HandleFunc("/saveattachment", handleSaveAttachment)
	r.HandleFunc("/preparetoattachfile", handlePrepareToAttachFile)
	r.HandleFunc("/downloadfile/", handleDownloadFile)
	r.HandleFunc("/getrecordingurl", handleGetRecordingUrl)
	r.HandleFunc("/logout", handleLogout)

	//	http.Handle("/", r)
	/*
		publicproxy := httputil.NewSingleHostReverseProxy(apiUrl)
		http.HandleFunc("/public/", proxyhandler(publicproxy))

		platformproxy := httputil.NewSingleHostReverseProxy(platformUrl)
		http.HandleFunc("/platform/", proxyhandler(platformproxy))


		http.HandleFunc("/saveattachment", handleSaveAttachment)
		http.HandleFunc("/preparetoattachfile", handlePrepareToAttachFile)
		http.HandleFunc("/downloadfile/", handleDownloadFile)
		http.HandleFunc("/getrecordingurl", handleGetRecordingUrl)

		http.HandleFunc("/", handlePage)

	*/

	var port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting server on " + port)

	if os.Getenv("DYNO") == "" {
		//if we aren't running in heroku, we need to set up our own ssl for dev testing
		log.Panic(http.ListenAndServeTLS(":"+port, "ssl/server.crt", "ssl/server.key", r))
	} else {
		log.Panic(http.ListenAndServe(":"+port, r))
	}

}

func handleApi(w http.ResponseWriter, r *http.Request) {
	authValue := getAuthToken(r)

	log.Printf("%+v", r)

	req, err := http.NewRequest(r.Method, apiUrl.String()+r.URL.String(), r.Body)

	req.Header.Set("Authorization", fmt.Sprintf("bearer %s", authValue))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		log.Printf("Error calling %v:  %+v", r.URL, err)

		return

	}
	defer response.Body.Close()

	log.Printf("%+v", response)

	/*data, _ := httputil.DumpResponse(response, true)
	log.Println(string(data))
	*/
	//response.Body.Write(w)

	if response.StatusCode == 401 {
		clearSession(w, r)
	}

	w.Header().Set("Content-Type", "application/json")

	contents, err := ioutil.ReadAll(response.Body)
	w.WriteHeader(response.StatusCode)
	fmt.Fprintf(w, string(contents))
}

func handlePage(w http.ResponseWriter, r *http.Request) {

	if r.URL.String() == "/favicon.ico" {
		blankTemplate.Execute(w, struct{}{})
		return
	}

	log.Printf("%v", r.URL)

	fileName := strings.Split(r.URL.String(), "?")[0]

	if strings.HasSuffix(fileName, "html") {

		if !checkSession(w, r) && strings.ToLower(fileName) != "/internalinstall.html" {
			return
		}

		if fileName == "/test.html" {
			fileName = "/directory.html"
		}

		tmpl, _ := template.ParseFiles("public" + fileName)

		tmpl.Execute(w, nil)

	} else {
		log.Print("is xml")

		fileReader, _ := ioutil.ReadFile("public" + fileName)
		w.Write(fileReader)
	}

}

func sendDataToEws(ewsUrl, authToken, body string) ([]byte, error) {
	req, err := http.NewRequest("POST", ewsUrl, bytes.NewBuffer([]byte(body)))

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", authToken))
	req.Header.Set("Content-Type", "text/xml; charset=utf-8")

	fmt.Println("send data to ews")
	//fmt.Println("%+v", req)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("error with response: %+v", err)
		return nil, err
	}
	defer resp.Body.Close()

	//	fmt.Println("response Status:", resp.Status)
	//fmt.Println("response Headers:", resp.Header)

	return ioutil.ReadAll(resp.Body)
}

func randToken() string {
	b := make([]byte, 28)
	rand.Read(b)
	return fmt.Sprintf("%x", b)
}
