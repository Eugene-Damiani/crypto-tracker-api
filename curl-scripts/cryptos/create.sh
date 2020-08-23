#!/bin/bash

API="http://localhost:4741"
URL_PATH="/cryptos"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{
    "crypto": {
      "asset": "'"${ASSET}"'",
      "amount": "'"${AMOUNT}"'",
      "exchange": "'"${EXCHANGE}"'"
    }
  }'


echo
