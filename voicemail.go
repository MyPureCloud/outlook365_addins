package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"strconv"
	"strings"
)

func handleGetRecordingUrl(w http.ResponseWriter, r *http.Request) {
	log.Println("Getting recording url")
	cookie := getAuthToken(r)

	requestData := &GetRecordingUrlData{}
	dec := json.NewDecoder(r.Body)
	dec.Decode(requestData)

	log.Printf("%v", requestData)

	phone, time, duration := getVoicemailDataFromEmailItem(requestData.EwsUrl, requestData.AuthToken, requestData.MailId)

	voicemailUri := findVoicemailMessage(cookie, phone, time, duration)

	if voicemailUri == "" {
		log.Printf("Unable to find recording")
		http.Error(w, "Unable to find recording.", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintln(w, "{\"media\":\""+strings.Replace(voicemailUri, apiUrl.String(), "", -1)+"\"}")

}

func findVoicemailMessage(purecloudToken, phone, time string, duration int) string {

	req, err := http.NewRequest("GET", apiUrl.String()+"/api/v1/voicemail/messages", nil)

	req.Header.Set("Authorization", fmt.Sprintf("bearer %s", purecloudToken))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	client := &http.Client{}
	response, err := client.Do(req)
	if err != nil {
		log.Printf("Error calling /api/v1/voicemail/messages:  %+v", err)
		return ""

	}
	defer response.Body.Close()

	data, _ := httputil.DumpResponse(response, true)
	log.Println(string(data))

	body, err := ioutil.ReadAll(response.Body)

	var messageParams MessageResponse
	err = json.Unmarshal(body, &messageParams)

	//log.Printf("%+v", messageParams)

	for _, message := range messageParams.Entities {
		log.Printf("%+v", message)

		log.Printf("%v %v", message.AudioRecordingDurationSeconds, duration)
		log.Printf("%v %v", message.CallerAddress, phone)
		log.Printf("%v %v", message.CreatedDate, time)

		if message.AudioRecordingDurationSeconds == duration &&
			message.CallerAddress == phone &&
			strings.Contains(message.CreatedDate, time) {
			return message.SelfUri
		}

		//TODO: Handle when there are multiple pages
	}

	log.Printf("unable to find voicemail message in list of entities.  List length %v", len(messageParams.Entities))
	return ""
}

func getVoicemailDataFromEmailItem(ewsUrl, authToken, mailId string) (phone, time string, duration int) {

	requestSoapFormat := `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
<soap:Header>
<t:RequestServerVersion Version="Exchange2013" />
</soap:Header>
<soap:Body>
    <GetItem
      xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"
      xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">
      <ItemShape>
        <t:BaseShape>Default</t:BaseShape>
        <t:IncludeMimeContent>true</t:IncludeMimeContent>
      </ItemShape>
      <ItemIds>
        <t:ItemId Id="%v" />
      </ItemIds>
    </GetItem>
  </soap:Body>
</soap:Envelope>`

	bodyString := fmt.Sprintf(requestSoapFormat, mailId)

	response, err := sendDataToEws(ewsUrl, authToken, bodyString)

	if err != nil {
		return "", "", 0
	}

	log.Printf("getVoicemailDataFromEmailItem - got response from ews")

	phone = strings.Replace(phoneRegex.FindString(string(response)), "#43;", "+", -1)

	//2015-02-19T17:42:49.579
	time = timeRegex.FindString(string(response))

	//Duration: 57 seconds
	duration, _ = strconv.Atoi(durationRegex.FindStringSubmatch(string(response))[1])

	log.Printf("getVoicemailDataFromEmailItem - Got time %v and duration %v", time, duration)

	return phone, time, duration

}
