#!/bin/bash
COUNTER=0
CURLURL="http://127.0.0.1:9200/bsc/vendor"
COUNT=$(less vendor-data.json | jq '.vendors | length')    
echo $COUNT
while [  $COUNTER -lt $COUNT ]; do
  echo $COUNTER
  CURLDATA=$(less vendor-data.json | jq '.vendors['$COUNTER']')
  RESPONSE=$(curl -XPOST "$CURLURL"  -d "$CURLDATA" -vn)
  let COUNTER=COUNTER+1
done