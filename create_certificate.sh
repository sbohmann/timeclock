!/usr/bin/env bash
set -x
openssl genrsa -out root.key
openssl req -new -key root.key -out root.csr
openssl x509 -req -days 10000 -in root.csr -signkey root.key -out root.pem
openssl genrsa -out ca.key
openssl req -new -key ca.key -out ca.csr
openssl x509 -req -days 10000 -in ca.csr -CA root.pem -CAkey root.key -CAcreateserial -out ca.pem
openssl genrsa -out timeclock.key
if [["$1"="san"]]
then
  openssl req -new -key timeclock.key -nodes -out timeclock.csr -reqexts san -config <(cat /etc/ssl/openssl.cnf; echo; cat san.conf)
  openssl x509 -req -days 300 -in timeclock.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out timeclock.pem -extensions san -extfile san.conf
else
  openssl req -new -key timeclock.key -out timeclock.csr
  openssl x509 -req -days 300 -in timeclock.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out timeclock.pem
fi
openssl x509 -outform der -in root.pem -out root.crt
openssl x509 -outform der -in ca.pem -out ca.crt
openssl x509 -outform der -in timeclock.pem -out timeclock.crt
