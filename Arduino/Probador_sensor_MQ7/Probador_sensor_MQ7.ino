int tiempo = 0;
int pinSensorCO;
void setup() {
  Serial.begin(9600);
 
  Serial.println("Mediciones del sensor de Monoxido de Carbono");
  Serial.println("El tiempo esta dado en segundos");
  Serial.println("========================");
  Serial.println("Tiempo - Valor - Concentracion (aprox)");
  Serial.println("========================");
}

void loop() {
  pinSensorCO = analogRead(A0);
  
  Serial.print("Tiempo: ");
  Serial.print(tiempo);
  Serial.print(" Valor: ");
  Serial.print(pinSensorCO);
  Serial.print(" ");
  Serial.print((1024 - pinSensorCO)/100);
  Serial.println(" %");

  tiempo++;
  delay(1000);
}
