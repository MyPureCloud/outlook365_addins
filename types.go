package main

type SaveAttachmentData struct {
	AuthToken      string `json:"AuthToken"`
	AttachmentId   string `json:"AttachmentId"`
	FileName       string `json:"FileName"`
	EwsUrl         string `json:"EwsUrl"`
	WorkspaceId    string `json:"WorkspaceId"`
	PureCloudToken string `json:"PureCloudToken"`
	MailId         string `json:"MailId"`
	ContentType    string `json:"ContentType"`
}

type GetRecordingUrlData struct {
	AuthToken string `json:"AuthToken"`
	EwsUrl    string `json:"EwsUrl"`
	MailId    string `json:"MailId"`
}

type VoicemailEntity struct {
	AudioRecordingDurationSeconds int    `json:"audioRecordingDurationSeconds"`
	AudioRecordingSizeBytes       int    `json:"audioRecordingSizeBytes"`
	CreatedDate                   string `json:"createdDate"`
	CallerAddress                 string `json:"callerAddress"`
	SelfUri                       string `json:"selfUri"`
}

type MessageResponse struct {
	PageSize   int               `json:"pageSize"`
	PageNumber int               `json:"pageNumber"`
	Total      int               `json:"total"`
	NextUri    string            `json:"nextUri"`
	Entities   []VoicemailEntity `json:"entities"`
}
