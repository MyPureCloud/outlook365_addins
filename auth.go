package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/gorilla/sessions"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

const (
	//authorization server endpoints
	authPath    = "/authorize"
	tokenPath   = "/token"
	redirect    = "/oauth2/callback"
	sessionName = "PureCloudOutlookSession"
)

var (
	signInUrl, _ = url.Parse("https://auth.us-east-1.inindca.com")
)

var cookieStore = sessions.NewCookieStore([]byte(os.Getenv("COOKIESTORE")))

type TokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int64  `json:"expires_in"`
}

func getAuthToken(r *http.Request) string {
	session1, _ := cookieStore.Get(r, sessionName)
	authValue := session1.Values["authValue"]

	return authValue.(string)
}

func clearSession(w http.ResponseWriter, r *http.Request) {
	session1, _ := cookieStore.Get(r, sessionName)
	session1.Values["authValue"] = nil

	session1.Save(r, w)
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	session, _ := cookieStore.Get(r, sessionName)
	session.Options.MaxAge = -1
	session.Save(r, w)

}

func checkSession(w http.ResponseWriter, r *http.Request) bool {
	session1, _ := cookieStore.Get(r, sessionName)
	authValue := session1.Values["authValue"]

	if session1.Values["expire"] != nil {
		if authValue != nil && session1.Values["expire"].(int64) > time.Now().UTC().Unix() {
			return true
		}
	}

	query := url.Values(map[string][]string{
		"response_type": []string{"code"},
		"client_id":     []string{os.Getenv("OAUTHID")},
		"redirect_uri":  []string{"https://" + r.Host + redirect},
	})

	target, _ := signInUrl.Parse(authPath)
	target.RawQuery = url.Values(query).Encode()

	session1.Values["nextUrl"] = r.URL.String()
	session1.Save(r, w)

	http.Redirect(w, r, target.String(), http.StatusFound)

	return false
}

func callback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	target, _ := signInUrl.Parse(tokenPath)
	//form the oauth token request
	body := bytes.NewBufferString(
		url.Values(map[string][]string{
			"grant_type":   []string{"authorization_code"},
			"code":         []string{code},
			"redirect_uri": []string{"https://" + r.Host + redirect},
		}).Encode())

	request := &http.Request{
		URL:    target,
		Method: "POST",
		Header: map[string][]string{
			"Accept":       []string{"application/json"},
			"Content-Type": []string{"application/x-www-form-urlencoded"},
		},
		Body:          ioutil.NopCloser(body),
		ContentLength: int64(body.Len()),
	}
	//the token endpoint uses basic auth with client credentials
	clientID, secret := os.Getenv("OAUTHID"), os.Getenv("OAUTHSECRET")
	request.SetBasicAuth(clientID, secret)

	response, err := http.DefaultClient.Do(request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer response.Body.Close()
	if status := response.StatusCode; status != http.StatusOK {
		log.Printf("Unable to get token %+v", response)
		msg := fmt.Sprintf("bad status for token request: %d", status)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}
	//parse the access token from the response
	tokenResponse := &TokenResponse{}
	dec := json.NewDecoder(response.Body)
	dec.Decode(tokenResponse)

	session1, _ := cookieStore.Get(r, sessionName)
	session1.Values["authValue"] = tokenResponse.AccessToken
	session1.Values["expire"] = time.Now().Add(time.Duration(tokenResponse.ExpiresIn) * time.Second).UTC().Unix()
	session1.Save(r, w)

	log.Printf("%+v", session1)

	http.Redirect(w, r, session1.Values["nextUrl"].(string), http.StatusFound)

	//We have the access token now, everything from here is just for fun and demonstration
	//get the user from the public api

}
