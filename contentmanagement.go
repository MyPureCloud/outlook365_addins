package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"github.com/garyburd/redigo/redis"
	"github.com/soveran/redisurl"
	"io"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"net/textproto"
	"os"
	"strings"
)

func handlePrepareToAttachFile(w http.ResponseWriter, r *http.Request) {

	cookie := getAuthToken(r)

	key := randToken()

	data := struct {
		key string
	}{
		key,
	}

	js, err := json.Marshal(data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

	saveTokenToRedis(key, cookie)
}

func handleSaveAttachment(w http.ResponseWriter, r *http.Request) {

	cookie := getAuthToken(r)

	requestData := &SaveAttachmentData{}
	dec := json.NewDecoder(r.Body)
	dec.Decode(requestData)

	attachmentData, err := getAttachmentContent(requestData.EwsUrl, requestData.AuthToken, requestData.AttachmentId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	uploadUrl := createContentManagementDocument(requestData.FileName, requestData.WorkspaceId, cookie)

	if uploadUrl == "" {
		http.Error(w, "Unable to get file upload url", http.StatusInternalServerError)
	}

	err = performMultipartPost(uploadUrl, requestData.FileName, requestData.ContentType, attachmentData)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.WriteHeader(200)
	}

}

func createContentManagementDocument(fileName, workspaceId, purecloudToken string) string {

	newDocument := map[string]interface{}{
		"name": fileName,
		"workspace": map[string]string{
			"id": workspaceId,
		},
	}
	rbody, _ := json.Marshal(newDocument)

	req, err := http.NewRequest("POST", apiUrl.String()+"/api/v1/contentmanagement/documents", bytes.NewReader(rbody))

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", purecloudToken))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	log.Printf("%+v", req)

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		log.Print(err)
		return ""

	}
	defer response.Body.Close()

	body, err := ioutil.ReadAll(response.Body)

	var newFileParams map[string]interface{}
	err = json.Unmarshal(body, &newFileParams)

	log.Printf("%+v", newFileParams["uploadDestinationUri"].(string))

	//    http://matt.aimonetti.net/posts/2013/07/01/golang-multipart-file-upload-example/
	return newFileParams["uploadDestinationUri"].(string)
}

var quoteEscaper = strings.NewReplacer("\\", "\\\\", `"`, "\\\"")

func escapeQuotes(s string) string {
	return quoteEscaper.Replace(s)
}

func performMultipartPost(uri, filename, fileType string, fileData []byte) error {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)

	h := make(textproto.MIMEHeader)
	h.Set("Content-Disposition", fmt.Sprintf(`form-data; name="%s"; filename="%s"`,
		escapeQuotes(filename), escapeQuotes(filename)))
	h.Set("Content-Type", fileType)
	ioWriter, err := writer.CreatePart(h)

	//ioWriter, err := writer.CreateFormFile(filename, filename)
	_, err = io.Copy(ioWriter, bytes.NewReader([]byte(fileData)))

	if err != nil {
		return err
	}

	// If you don't close it, your request will be missing the terminating boundary.
	writer.Close()

	uploadRequest, err := http.NewRequest("POST", uri, body)

	if err != nil {
		return err
	}

	uploadRequest.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}

	resp, err := client.Do(uploadRequest)

	log.Printf("%+v", resp)

	if err != nil {
		return err
	}

	return nil

}

func getAttachmentContent(ewsUrl, authToken, attachmentId string) ([]byte, error) {

	requestSoapFormat := `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:xsd="http://www.w3.org/2001/XMLSchema"
xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
<soap:Header>
<t:RequestServerVersion Version="Exchange2013" />
</soap:Header>
  <soap:Body>
    <GetAttachment xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"
    xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
      <AttachmentShape/>
      <AttachmentIds>
        <t:AttachmentId Id="%v"/>
      </AttachmentIds>
    </GetAttachment>
  </soap:Body>
</soap:Envelope>`

	bodyString := fmt.Sprintf(requestSoapFormat, attachmentId)

	response, err := sendDataToEws(ewsUrl, authToken, bodyString)

	if err != nil {
		return nil, err
	}

	//There is most likely a better way to parse the soap response, but hacking it here for now.
	contentByteString := strings.Replace(strings.Replace(exchangeContentRegex.FindString(string(response)), "</t:Content>", "", -1), "<t:Content>", "", -1)

	return base64.StdEncoding.DecodeString(contentByteString)

}

func saveTokenToRedis(token, apikey string) {
	client, _ := redisurl.ConnectToURL(os.Getenv("REDIS_URL"))
	client.Do("SET", token, apikey)
	client.Do("EXPIRE", token, 60)
	client.Close()
}

func getTokenFromRedis(token string) string {
	client, _ := redisurl.ConnectToURL(os.Getenv("REDIS_URL"))
	val, _ := redis.String(client.Do("GET", token))

	defer client.Close()
	return val
}

func handleDownloadFile(w http.ResponseWriter, r *http.Request) {
	log.Printf("%v", r.URL.Path)
	splitPath := strings.Split(strings.Replace(r.URL.Path, "/downloadfile/", "", -1), "/")

	log.Printf("split: %v", splitPath[0])

}
