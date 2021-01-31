!/usr/bin/env bash
set -x
openssl genrsa -out key.pem
openssl req -new -key key.pem -out root.csr
openssl x509 -req -days 10000 -in root.csr -signkey key.pem -out root.pem
openssl req -new -key key.pem -out cert.csr
openssl x509 -req -days 300 -in cert.csr -CA root.pem -CAkey key.pem -CAcreateserial -out cert.pem
openssl x509 -outform der -in root.pem -out root.crt
