package utils

import (
	"mime/multipart"
	"net/textproto"
	"testing"
)

func TestValidateImageUpload(t *testing.T) {
	tests := []struct {
		name    string
		file    *multipart.FileHeader
		wantErr bool
	}{
		{
			name:    "missing image",
			wantErr: true,
		},
		{
			name:    "empty image",
			file:    imageFileHeader(0, "image/jpeg"),
			wantErr: true,
		},
		{
			name:    "image exceeds limit",
			file:    imageFileHeader(MaxImageUploadSize+1, "image/jpeg"),
			wantErr: true,
		},
		{
			name:    "non image content type",
			file:    imageFileHeader(1024, "application/pdf"),
			wantErr: true,
		},
		{
			name: "valid image at limit",
			file: imageFileHeader(MaxImageUploadSize, "image/png"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := ValidateImageUpload(tt.file)
			if (err != nil) != tt.wantErr {
				t.Fatalf("ValidateImageUpload() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func imageFileHeader(size int64, contentType string) *multipart.FileHeader {
	return &multipart.FileHeader{
		Size: size,
		Header: textproto.MIMEHeader{
			"Content-Type": []string{contentType},
		},
	}
}
