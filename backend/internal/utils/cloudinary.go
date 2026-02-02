package utils

import (
	"context"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

func UploadDocumentToCloudinary(
	ctx context.Context,
	file *multipart.FileHeader,
	folder string,
) (string, error) {

	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	resp, err := cld.Upload.Upload(ctx, src, uploader.UploadParams{
		Folder:       folder,
		ResourceType: "raw",
	})
	if err != nil {
		return "", err
	}

	return resp.SecureURL, nil
}
