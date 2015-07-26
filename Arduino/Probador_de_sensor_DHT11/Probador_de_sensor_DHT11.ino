// Pin de lectura de datos: 2

#include "DHT.h" //cargamos la librería DHT
#define DHTPIN 3 //Seleccionamos el pin en el que se //conectará el sensor
#define DHTTYPE DHT11 //Se selecciona el DHT11 (hay //otros DHT)
DHT dht(DHTPIN, DHTTYPE); //Se inicia una variable que será usada por Arduino para comunicarse con el sensor
void setup() {
Serial.begin(9600); //Se inicia la comunicación serial 
dht.begin(); //Se inicia el sensor
}
void loop() {
float h = dht.readHumidity(); //Se lee la humedad
float t = dht.readTemperature(); //Se lee la temperatura
//Se imprimen las variables
Serial.print("Humedad: ");
Serial.print(int(h));
Serial.println("%"); 
Serial.print("Temperatura: ");
Serial.print(int(t));
Serial.println(" C");
delay(2000); //Se espera 2 segundos para seguir leyendo //datos
}
