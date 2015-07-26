(curl orion.lab.fi-ware.org:1026/v1/unsubscribeContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh" -d @- | python -mjson.tool) <<EOF
{
  "subscriptionId": "55b1c2f8bf78897897896eb8"
}
EOF
