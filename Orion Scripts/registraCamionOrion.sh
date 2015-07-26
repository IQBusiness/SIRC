(curl orion.lab.fi-ware.org:1026/v1/contextEntities/type/Camion/id/Camion-0907983837 -X POST -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' --header "X-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh" -d @- | python -mjson.tool) <<EOF
{
  "attributes" : [    
    {      
      "name" : "co2",      
      "type" : "float",      
      "value" : "44.4"    
    },    
    {      
      "name" : "co",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "luz",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "humedad",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "presion",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "gotas",      
      "type" : "int",      
      "value" : "44"    
    },  
    {      
      "name" : "latitud",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "longitud",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "altitud",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "xAcel",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "yAcel",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "zAcel",      
      "type" : "float",      
      "value" : "44.4"
    },  
    {      
      "name" : "temperatura",      
      "type" : "float",      
      "value" : "44.4"    
    },  
    {      
      "name" : "signal",      
      "type" : "float",      
      "value" : "44.4"    
    }    
  ]
}
EOF
