/*
 * ==============================
 * DISEÑADO PARA EL ARDUINO MEGA
 * El puerto RX0 y TX0 Son para
 * la comunicación Serie-USB
 * El puerto RX1 y TX1 son para
 * la comunicación con el ESP8266
 * ==============================
*/

String ultimaRespuesta = "";

#define SSID "WIFIEXPO"
#define PASS ""

#define IP "sirc.iqbusiness.mx" //orion.lab.fi-ware.org
#define PORT 80
#define HEADERS "Content-Type: application/json\r\nAccept: application/json\r\nX-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh\r\nUser-Agent: arduino-wifi\r\n"
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  Serial1.begin(115200);

  while(!Serial);
  while(!Serial1);
  
  Serial.println(llamarComandoAT("AT"));
  Serial.println("Iniciando conexion");
  
  Serial.println("Conectando al WIFI");
  conectarWifi();
  Serial.println("IP:");
  Serial.println(ATr("AT+CIFSR", "ERROR"));
    
  Serial.println("Cambiando a modo 1 conexion");
  Serial.println(AT("AT+CIPMUX=0"));
}

void loop() {
  String data = "{\"valor\":1234567890, \"nombre\":\"jacobo\"}";
  data = "{\"contextElements\":[{\"type\":\"Camion\",\"isPattern\":\"false\",\"id\":\"Camion-0907983837\",\"attributes\":[{\"name\":\"co2\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"co\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"luz\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"humedad\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"presion\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"gotas\",\"type\":\"int\",\"value\":\"77\"},{\"name\":\"temperatura\",\"type\":\"float\",\"value\":\"22.2\"},{\"name\":\"signal\",\"type\":\"float\",\"value\":\"22.2\"}]}],\"updateAction\":\"UPDATE\"}";
  POST("/testjc", data);
  delay(1000);
}

// URL debe iniciar con /, ejemplo:  /mipagina.html
void POST(String url, String data) {
   String respuesta = "";
 
  String llamada = "AT+CIPSTART=\"TCP\",\"";
    llamada += IP;
    llamada += "\",";
    llamada += PORT;
  
  Serial1.println(llamada);
  while(!Serial1.find("OK"));

  // Configuramos las cabeceras de la llamada
  String command = "";
    command += "POST ";
    command += url;
    command += " HTTP/1.0\r\n";
    command += "Host: ";
    command += IP;
    command += "\r\n";
    command += HEADERS;

    command += "Content-Length:";
    command += data.length();
    command += "\r\n\r\n";

    command += data;
 
  // Aqui enviamos el comando para acceder al sitio web
  Serial1.print("AT+CIPSEND=");
  Serial1.println(command.length());

  // Esperamos la peticion de la consola
  delay(300);

  if(Serial1.find(">"))
  {
    Serial.println("Enviando comandos");
    Serial1.println(command);
/*    SE IGNORA LA RESPUESTA DEL SERVIDOR (POR AHORA)
    while(Serial1.available()){
      Serial.write(Serial1.read());
    }
      respuesta = Serial1.readString();
*/
  }
  Serial.println();
    Serial.println(AT("AT+CIPSTATUS"));
}

boolean conectarWifi() {
   AT("AT+CWMODE=1");
   
   delay(300);
   
   String cmd ="AT+CWJAP=\"";
     cmd+=SSID;
     cmd+="\",\"";
     cmd+=PASS;
     cmd+="\"";

  AT(cmd);
  
  while(!Serial1.find("OK"));
  
  return true;
}

// Similar a la función AT, pero reintenta si encuentra la cadena 'reintento'
String ATr(String comando, String reintento) {
  String respuesta = AT(comando);

  while(respuesta.indexOf(reintento) != -1) {
    Serial.println("Reintentando...");
    AT(comando);
  }

  return respuesta;
}

String AT(String comando) {
  return llamarComandoAT(comando);  
}

String llamarComandoAT(String comando) {
  ultimaRespuesta = "";
  char caracterTmp;
  
  Serial1.println(comando);

  // Esperamos una respuesta
  while(Serial1.available() == 0);

  while(Serial1.available() != 0) {
    ultimaRespuesta = Serial1.readStringUntil(char(14));
  }
  
  ultimaRespuesta = ultimaRespuesta.substring(ultimaRespuesta.indexOf(char(10)) + 1, ultimaRespuesta.length());

  ultimaRespuesta.trim();

  return ultimaRespuesta;
}

