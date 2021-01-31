!/usr/bin/env bash
set -x
openssl genrsa -out root.key
openssl req -new -key root.key -out root.csr
openssl x509 -req -days 10000 -in root.csr -signkey root.key -out root.pem
openssl genrsa -out ca.key
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 10000 -in ca.csr -CA root.pem -CAkey root.key -CAcreateserial -out ca.pem
openssl genrsa -out timeclock.key
openssl req -new -key timeclock.key -out timeclock.csr
openssl x509 -req -days 300 -in timeclock.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out timeclock.pem
openssl x509 -outform der -in root.pem -out root.crt
openssl x509 -outform der -in ca.pem -out ca.crt
openssl x509 -outform der -in timeclock.pem -out timeclock.crt
