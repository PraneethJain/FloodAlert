#include <WiFi.h>
#include "ThingSpeak.h"
#include <HTTPClient.h>
#include <time.h>

#define CSE_IP "192.168.33.201"
#define CSE_PORT 5089
#define OM2M_ORGIN "admin:admin"
#define OM2M_MN "/~/in-cse/in-name/"
#define OM2M_AE "Demo"
// #define OM2M_DATA_CONT "Datas/Values"
// const char *WATER_LEVEL = "WaterLevel/Data";
// const char *SOIL_MOISTURE = "SoilMoisture/Data";
// const char *WATER_FLOW = "WaterFlow/Data";

const char *CONT = "Datas/Values";

#define INTERVAL 15000L

const char *ssid = "Praneeth's ROG";
const char *pass = "olaaqies";

long writeChannelID = 2151430;
const char *writeAPIKey = "YSQDHI1PZ3YPFENE";

WiFiClient client;

#define sensorPin1 33 // the analog pin the sensor is connected to
#define sensorPin2 26
#define sensorPowerPin 27    // the digital pin the sensor power is connected to
const int flowSensorPin = 2; // Connect the sensor to digital pin 2
// WATER LEVE END
// SOIL
const int sensor_pin1 = 34;
const int sensor_pin2 = 35;
const int sensor_pin3 = 32;

int _moisture, sensor_analog;
// SOIL END

volatile int flowPulse = 0; // Number of pulses from the sensor
float flowRate = 0.0;       // Flow rate in liters per minute (L/min)
unsigned int flowMilliLitres = 0;
unsigned long totalMilliLitres = 0;

unsigned long oldTime;

void flowSensorInterrupt()
{
  flowPulse++;
}

const char *ntpServer = "pool.ntp.org";

long randNumber;
long int prev_millis = 0;
unsigned long epochTime;

HTTPClient http;

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(sensorPowerPin, OUTPUT);   // declare sensor power pin as digital output pin
  digitalWrite(sensorPowerPin, LOW); // set sensor power pin to LOW
  pinMode(flowSensorPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(flowSensorPin), flowSensorInterrupt, RISING);
  oldTime = millis();

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Connecting to WiFi");
    delay(1000);
  }
  Serial.println("WiFi Connected!");
  ThingSpeak.begin(client);
  configTime(0, 0, ntpServer);
  delay(2000);
}

void post_to_om2m(float value1, float value2, float value3)
{
  String data;
  String server = "http://" + String() + CSE_IP + ":" + String() + CSE_PORT + String() + OM2M_MN;

  http.begin(server + String() + OM2M_AE + "/" + CONT + "/");

  http.addHeader("X-M2M-Origin", OM2M_ORGIN);
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");

  data = "[" + String(value1) + "," + String(value2) + "," + String(value3) + "]";
  String req_data = String() + "{\"m2m:cin\": {"

                    + "\"con\": \"" + data + "\","

                    + "\"lbl\": \"" + "V1.0.0" + "\","

                    //+ "\"rn\": \"" + "cin_"+String(i++) + "\","

                    + "\"cnf\": \"text\""

                    + "}}";
  int code = http.POST(req_data);
  http.end();
  Serial.println(code);
}

void loop()
{
  int water_level_count = 0;
  int soil_count = 0;
  int water_level_sum = 0;
  int soil_sum = 0;
  digitalWrite(sensorPowerPin, HIGH); // power on the water level sensor
  delay(500);                         // wait for sensor to stabilize
  float sensorValue2 = analogRead(sensorPin2);
  float sensorValue1 = analogRead(sensorPin1); // read the sensor value
  Serial.print("Water level1: ");              // print the label for the value
  Serial.println(sensorValue1);                // print the value to the serial monitor
  if (sensorValue1 > 0)
  {
    water_level_count++;
    water_level_sum += sensorValue1;
  }
  if (sensorValue2 > 0)
  {
    water_level_count++;
    water_level_sum += sensorValue2;
  }
  Serial.print("Water level2: ");    // print the label for the value
  Serial.println(sensorValue2);      // print the value to the serial monitor
  digitalWrite(sensorPowerPin, LOW); // turn off sensor power
  float moisture_average = 0;
  float water_level_average = 0;
  float flowrate = 0;
  if (water_level_count > 0)
  {
    water_level_average = water_level_sum / water_level_count;
    ThingSpeak.setField(2, water_level_average);
  }
  unsigned long currentTime = millis();
  if (currentTime - oldTime >= 1000)
  {
    flowRate = ((1000.0 / (currentTime - oldTime)) * flowPulse) / 7.5;
    oldTime = currentTime;
    flowMilliLitres = (flowRate / 60) * 1000;
    totalMilliLitres += flowMilliLitres;
    flowPulse = 0;

    Serial.print("Flow rate: ");
    Serial.println(flowRate);
    flowrate = flowRate;
    // Serial.print(" L/min\t");
    // Serial.print("Total volume: ");
    // Serial.print(totalMilliLitres);
    // Serial.println(" mL");
  }
  float sensor_analog1 = analogRead(sensor_pin1);
  float _moisture1 = (100 - (sensor_analog1 / 4095.00) * 100);
  Serial.print("Moisture = ");
  Serial.print(_moisture1);
  Serial.println("%");
  if (_moisture1 > 0)
  {
    soil_count++;
    soil_sum += _moisture1;
  }
  float sensor_analog2 = analogRead(sensor_pin2);
  float _moisture2 = (100 - (sensor_analog2 / 4095.00) * 100);
  Serial.print("Moisture = ");
  Serial.print(_moisture2);
  Serial.println("%");
  if (_moisture2 > 0)
  {
    soil_count++;
    soil_sum += _moisture2;
  }
  float sensor_analog3 = analogRead(sensor_pin3);
  float _moisture3 = (100 - (sensor_analog3 / 4095.00) * 100);
  Serial.print("Moisture = ");
  Serial.print(_moisture3);
  if (_moisture3 > 0)
  {
    soil_count++;
    soil_sum += _moisture3;
  }
  if (soil_count > 0)
  {
    moisture_average = soil_sum / soil_count;
    ThingSpeak.setField(4, moisture_average);
  }
  Serial.println("%");

  if (flowRate > 0)
  {
    ThingSpeak.setField(3, flowRate);
  }
  int x = ThingSpeak.writeFields(writeChannelID, writeAPIKey);
  post_to_om2m(water_level_average, moisture_average, flowRate);

  delay(2000);
}