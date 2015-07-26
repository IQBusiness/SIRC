#include <SFE_BMP180.h>
#include <Wire.h>


SFE_BMP180 sensor;

double baseline;
double temperatura;
double presion;

void setup() {
  Serial.begin(9600);
  Serial.println("Iniciando..");
  if(sensor.begin()){
    Serial.println("Sensor inicializado correctamente");
  }else{
    Serial.println("No se ha podido iniciar el sensor, compruebe conexiones");
    while(1);
  }

  sensor.startTemperature();
  baseline = getPressure();

  sensor.getTemperature(temperatura);

  Serial.print("Temperatura:");
  temperatura = (temperatura - 32) / 1.8;
  Serial.print(temperatura);
  Serial.println(" C");

  Serial.print("Presion:");
  Serial.print(baseline);
  Serial.println(" mBar");
}

void loop() {
  double a,P;
 
  P = getPressure();

  a = sensor.altitude(P,baseline);
   
  Serial.print("Altura relativa: ");
  if (a >= 0.0) Serial.print(" "); // add a space for positive numbers
  Serial.print(a,1);
  Serial.println(" metros");

  delay(500);
}

double getPressure()
{
  char status;
  double T,P,p0,a;

  // You must first get a temperature measurement to perform a pressure reading.
  
  // Start a temperature measurement:
  // If request is successful, the number of ms to wait is returned.
  // If request is unsuccessful, 0 is returned.

  status = sensor.startTemperature();
  if (status != 0)
  {
    // Wait for the measurement to complete:

    delay(status);

    // Retrieve the completed temperature measurement:
    // Note that the measurement is stored in the variable T.
    // Use '&T' to provide the address of T to the function.
    // Function returns 1 if successful, 0 if failure.

    status = sensor.getTemperature(T);
    if (status != 0)
    {
      // Start a pressure measurement:
      // The parameter is the oversampling setting, from 0 to 3 (highest res, longest wait).
      // If request is successful, the number of ms to wait is returned.
      // If request is unsuccessful, 0 is returned.

      status = sensor.startPressure(3);
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

        status = sensor.getPressure(P,T);
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

