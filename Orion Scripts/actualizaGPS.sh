(curl orion.lab.fi-ware.org:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh" -d @- | python -mjson.tool) <<EOF
{
  "contextElements": [
      {
      "type": "Camion",
      "isPattern": "false",
      "id": "Camion-xxxxxxxxx",
      "attributes": [  
          {      
            "name" : "latitud",      
            "type" : "float",      
            "value" : "88.6"    
          },  
          {      
            "name" : "longitud",      
            "type" : "float",      
            "value" : "88.7"    
          },  
          {      
            "name" : "altitud",      
            "type" : "float",      
            "value" : "66.6"    
          },  
          {      
            "name" : "xAcel",      
            "type" : "float",      
            "value" : "66.6"    
          },  
          {      
            "name" : "yAcel",      
            "type" : "float",      
            "value" : "66.6"    
          },  
          {      
            "name" : "zAcel",      
            "type" : "float",      
            "value" : "66.6"
          }
      ]
      }
  ],
  "updateAction": "UPDATE"
}
EOF
