$env:GOOSE_DRIVER="postgres"
$env:GOOSE_DBSTRING="postgres://postgres:nabin@localhost:5432/dhune_db?sslmode=disable"

goose -dir db/migrations up
