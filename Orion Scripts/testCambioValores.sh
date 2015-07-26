(curl orion.lab.fi-ware.org:1026/v1/subscribeContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh" -d @- | python -mjson.tool) <<EOF
  {
  "entities": [
      {
      "type": "Camion",
      "isPattern": "false",
      "id": "Camion-xxxxxxxxxx"
      }
  ],
  "attributes": [
      "co2",
      "co",
      "luz",
      "humedad",
      "gotas",
      "presion",
      "temperatura",
      "signal"
  ],
  "reference": "http://sirc.iqbusiness.mx/cbparams",
  "duration": "P1M",
  "notifyConditions": [
      {
      "type": "ONCHANGE",
      "condValues": [
          "co2",
          "co",
          "luz",
          "humedad",
          "gotas",
          "presion",
          "temperatura",
          "signal"
        ]
      }
  ],
  "throttling": "PT0S"
  }
EOF
