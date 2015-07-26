/* pendientes
 * - agregar comprobación para el arranque de los sensores
 * - usar variables para denotar el pin que usará cada sensor??
*/

/*
 * ==============================
 * DISEÑADO PARA EL ARDUINO MEGA
 * Pines utulizados:
 * A0 - Sensor CO2
 * A1 - Sensor CO
 * A2 - Sensor luz
 * A3 - Sensor de lluvia
 * 
 * 2 - Sensor de lluvia (Digital)
 * 3 - Sensor de humedad/temperatura
 * 6 - Reset del ESP8266
 * 
 * Rx0, Tx0 - Comunicación puerto Serie-USB (9600bps)
 * Rx1, Tx1 - Modulo Wifi (ESP8266) (115200bps)
 * Rx2, Tx2 - Modulo GPS (9600bps)
 * 
 * SCL, SDA - Sensor de presión barometrica (0x77)
 * ==============================
*/

// IMPORTACIÓN DE DEPENDENCIAS

#include <DHT.h> // Libreria para sensor de humedad
#include <SFE_BMP180.h> // Libreria para sensor de presion
#include <Wire.h> // I2C?
#include <TinyGPS.h> // GPS

// DECLARACIÓN DE CONSTANTES
//#define SSID "AndroidManuel"
//#define PASS "qhfc4106"

#define SSID "WIFIEXPO"
#define PASS ""

#define IP "orion.lab.fi-ware.org"
#define PORT 1026
#define HEADERS "Content-Type: application/json\r\nAccept: application/json\r\nX-Auth-Token: Ro4YsJPbzk0w8E1ZfgHT016BHXAxfh\r\nUser-Agent: arduino-wifi\r\n"

#define DHTPIN 3 //Seleccionamos el pin del sensor de humedad
#define DHTTYPE DHT11 // Tipo de sensor

// DECLARACIÓN DE VARIABLES
String ultimaRespuesta = "";

int sensorCO2;
int sensorCO;
int sensorLuz;
int sensorLluvia;

int sensorLluviaD;

DHT dht(DHTPIN, DHTTYPE);

float humedad;
float temperaturaH; // Temperatura medida con el sensor de humedad

SFE_BMP180 sensorPresion;

double baseline;
double temperaturaP;
double presion;

TinyGPS gps;

float flat, flon, alt, curso, vel;
unsigned long age;

String idCamion = "Camion-0907983837";
// CODIGO DE CONFIGURACIÓN
void setup() {
  // Reiniciamos el modulo inalambrico
  digitalWrite(6, 0);
  delay(300);
  digitalWrite(6, 1);
  // Esperamos un segundo por si hay que programar el micro
  delay(700);

  Serial.begin(9600);
  Serial1.begin(115200);
  Serial2.begin(9600);

  while(!Serial);
  while(!Serial1);
  while(!Serial2);

  Serial.println("Inicializando sensores...");
  dht.begin(); //Se inicia el sensor de humedad
  
  sensorPresion.begin();

  sensorPresion.startTemperature();

  baseline = getPressure();

  sensorPresion.getTemperature(temperaturaP);
  temperaturaP = (temperaturaP - 32) / 1.8;
  
  Serial.println("Conectando al WIFI...");
  conectarWifi();
  Serial.println("IP:");
  Serial.println(ATr("AT+CIFSR", "ERROR"));
    
  Serial.println("Cambiando a modo 1 conexion");
  Serial.println(AT("AT+CIPMUX=0"));
}

void loop() {
  sensorCO2 = analogRead(A0);
  sensorCO = analogRead(A1);
  sensorLuz = analogRead(A2);
  sensorLluvia = analogRead(A3);
  sensorLluvia = ((sensorLluvia/1024)*100);
  
  sensorLluviaD = digitalRead(2);

  humedad = dht.readHumidity();
  temperaturaH = dht.readTemperature();

  presion = getPressure();
  sensorPresion.getTemperature(temperaturaP);
  temperaturaP = (temperaturaP - 32) / 1.8;
  
  String data;
  data =  "{\"contextElements\":[{\"type\":\"Camion\",\"isPattern\":\"false\",\"id\":\""; data += idCamion; data += "\",\"attributes\":[";
  data += "{\"name\":\"co2\",\"type\":\"float\",\"value\":\""; data += sensorCO2; data += "\"},";
  data += "{\"name\":\"co\",\"type\":\"float\",\"value\":\""; data += sensorCO; data += "\"},";
  data += "{\"name\":\"luz\",\"type\":\"float\",\"value\":\""; data += sensorLuz; data += "\"},";
  data += "{\"name\":\"humedad\",\"type\":\"float\",\"value\":\""; data += humedad; data += "\"},";
  data += "{\"name\":\"presion\",\"type\":\"float\",\"value\":\""; data += presion; data += "\"},";
  data += "{\"name\":\"gotas\",\"type\":\"int\",\"value\":\""; data += sensorLluvia; data += "\"},";
  data += "{\"name\":\"temperatura\",\"type\":\"float\",\"value\":\""; data += temperaturaH; data += "\"},";
  data += "{\"name\":\"signal\",\"type\":\"float\",\"value\":\""; data += "0"; data += "\"}]}";
  data += "],\"updateAction\":\"UPDATE\"}";

  POST("/v1/updateContext", data);
  delay(3000);

  // Recopilamos los datos del GPS (4 de cada 5 envios son del gps)
  for(int i = 0; i < 4; i++) {
    Serial.print("Enviando posicion GPS ");
    Serial.println(i);
    gps.f_get_position(&flat, &flon, &age);
    
    data = "{\"contextElements\":[{\"type\":\"Camion\",\"isPattern\":\"false\",\"id\":\"Camion-0907983837\",\"attributes\":[";
    
    data += "{\"name\":\"altitud\",\"type\":\"float\",\"value\":\""; data += gps.f_altitude(); data += "\"},";
    data += "{\"name\":\"latitud\",\"type\":\"float\",\"value\":\""; data += flat; data += "\"},";
    data += "{\"name\":\"longitud\",\"type\":\"float\",\"value\":\""; data += flon; data += "\"},";
    
    //data += "{\"name\":\"velocidad\",\"type\":\"float\",\"value\":\""; data += gps.f_speed_kmph(); data += "\"},";
    //data += "{\"name\":\"curso\",\"type\":\"float\",\"value\":\""; data += gps.f_course(); data += "\"},";
    data += "{\"name\":\"xAcel\",\"type\":\"float\",\"value\":\""; data += i; data += "\"},";
    data += "{\"name\":\"yAcel\",\"type\":\"float\",\"value\":\""; data += i; data += "\"},";
    data += "{\"name\":\"zAcel\",\"type\":\"float\",\"value\":\""; data += i; data += "\"}]}";
    data += "],\"updateAction\":\"UPDATE\"}"; 

    POST("/v1/updateContext", data);
    //Serial.println(data);
    delay(3000);
  }
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
  delay(400);
  //Serial1.flush();

  if(Serial1.find(">"))
  {
    Serial.println("Enviando comandos");
    Serial1.println(command);
  }
  Serial.println();
    // Imprime la respuesta
    delay(100);
    Serial.println(AT("AT+CIPSTATUS"));
    //Serial.flush();
    delay(300);
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

double getPressure()
{
  char status;
  double T,P,p0,a;

  // You must first get a temperature measurement to perform a pressure reading.
  
  // Start a temperature measurement:
  // If request is successful, the number of ms to wait is returned.
  // If request is unsuccessful, 0 is returned.

  status = sensorPresion.startTemperature();
  if (status != 0)
  {
    // Wait for the measurement to complete:

    delay(status);

    // Retrieve the completed temperature measurement:
    // Note that the measurement is stored in the variable T.
    // Use '&T' to provide the address of T to the function.
    // Function returns 1 if successful, 0 if failure.

    status = sensorPresion.getTemperature(T);
    if (status != 0)
    {
      // Start a pressure measurement:
      // The parameter is the oversampling setting, from 0 to 3 (highest res, longest wait).
      // If request is successful, the number of ms to wait is returned.
      // If request is unsuccessful, 0 is returned.

      status = sensorPresion.startPressure(3);
      if (status != 0)
      {
        // Wait for the measurement to complete:
        delay(status);

        // Retrieve the completed pressure measurement:
        // Note that the measurement is stored in the variable P.
        // Use '&P' to provide the address of P.
        // Note also that the function requires the previous temperature measurement (T).
        // (If temperature is stable, you can do one temperature measurement for a number of pressure measurements.)
        // Function returns 1 if successful, 0 if failure.

        status = sensorPresion.getPressure(P,T);
        if (status != 0)
        {
          return(P);
        }
        else Serial.println("error retrieving pressure measurement\n");
      }
      else Serial.println("error starting pressure measurement\n");
    }
    else Serial.println("error retrieving temperature measurement\n");
  }
  else Serial.println("error starting temperature measurement\n");
}


