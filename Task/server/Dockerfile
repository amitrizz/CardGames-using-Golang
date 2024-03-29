FROM golang:1.22-alpine
WORKDIR /
COPY . .
RUN go mod download
CMD go run main.go