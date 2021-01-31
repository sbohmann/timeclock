!/usr/bin/env bash
set -x
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 300 -in csr.pem -signkey key.pem -out cert.pem
openssl x509 -outform der -in cert.pem -out csr.crt
