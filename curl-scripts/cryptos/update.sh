#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cryptos"

curl "${API}${URL_PATH}/${ID}" \
  --include \
  --request PATCH \
  --header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "crypto": {
    "asset": "'"${ASSET}"'",
    "amount": "'"${AMOUNT}"'",
    "exchange": "'"${EXCHANGE}"'"
    }
  }'

echo
