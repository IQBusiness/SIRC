(curl orion.lab.fi-ware.org:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh" -d @- | python -mjson.tool) <<EOF
{
  "contextElements": [
      {
      "type": "Camion",
      "isPattern": "false",
      "id": "Camion-xxxxxxxxxx",
      "attributes": [
          {      
            "name" : "co2",      
            "type" : "float",      
            "value" : "22.2"    
          },    
          {      
            "name" : "co",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "luz",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "humedad",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "presion",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "gotas",      
            "type" : "int",      
            "value" : "77"    
          },  
          {      
            "name" : "latitud",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "longitud",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "altitud",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "xAcel",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "yAcel",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "zAcel",      
            "type" : "float",      
            "value" : "22.2"
          },  
          {      
            "name" : "temperatura",      
            "type" : "float",      
            "value" : "22.2"    
          },  
          {      
            "name" : "signal",      
            "type" : "float",      
            "value" : "22.2"    
          }
      ]
      }
  ],
  "updateAction": "UPDATE"
}
EOF
