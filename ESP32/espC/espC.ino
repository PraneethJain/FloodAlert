#include <Adafruit_BMP280.h>
#include <Wire.h>
#include <WiFi.h>
#include "ThingSpeak.h"
#include <HTTPClient.h>
#include <time.h>
Adafruit_BMP280 bmp1; // First BMP280 sensor
Adafruit_BMP280 bmp2; // Second BMP280 sensor

#define CSE_IP "172.20.10.13"
#define CSE_PORT 5089
#define OM2M_ORGIN "admin:admin"
#define OM2M_MN "/~/in-cse/in-name/"
#define OM2M_AE "Flood"

#include <DHT.h>
#define DHTTYPE DHT11

const char *CONT = "Datas2/Values";
const char *ntpServer = "pool.ntp.org";
HTTPClient http;

#define DHT1_PIN 27
#define DHT2_PIN 26
#define DHT3_PIN 25
#define BMP280_1_SDA_PIN 21
#define BMP280_1_SCL_PIN 32
#define BMP280_2_SDA_PIN 22
#define BMP280_2_SCL_PIN 33
DHT dht1(DHT1_PIN, DHTTYPE);
DHT dht2(DHT2_PIN, DHTTYPE);
DHT dht3(DHT3_PIN, DHTTYPE);
const char *ssid = "iPhone_atp";
const char *pass = "1 2 3 4 5 6 7";

long writeChannelID = 2151430;
const char *writeAPIKey = "YSQDHI1PZ3YPFENE";

WiFiClient client;

int i = 0;
float t_average = 0;
float p_average = 0;
float a_average = 0;
float h_average = 0;

const int sensorPin = 18; // The analog pin the sensor is connected to
const int sensorPowerPin = 7;
const int flowSensorPin = 19; // Connect the sensor to digital pin 2

volatile int flowPulse = 0; // Number of pulses from the sensor
float flowRate = 0.0;       // Flow rate in liters per minute (L/min)
unsigned int flowMilliLitres = 0;
unsigned long totalMilliLitres = 0;
unsigned long oldTime = 0;

void flowSensorInterrupt()
{
  flowPulse++;
}

void setup()
{
  Serial.begin(115200);
  Wire.begin(BMP280_1_SDA_PIN, BMP280_1_SCL_PIN);
  bmp1.begin(0x76); // First BMP280 sensor
  Wire.begin(BMP280_2_SDA_PIN, BMP280_2_SCL_PIN);

  bmp2.begin(0x77); // Second BMP280 sensor

  dht1.begin();
  dht2.begin();
  dht3.begin();

  pinMode(sensorPowerPin, OUTPUT);
  digitalWrite(sensorPowerPin, LOW);

  pinMode(flowSensorPin, INPUT);
  attachInterrupt(digitalPinToInterrupt(flowSensorPin), flowSensorInterrupt, RISING);

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

  float temperature1 = bmp1.readTemperature();
  float pressure1 = bmp1.readPressure();
  float altitude1 = bmp1.readAltitude();

  float temperature2 = bmp2.readTemperature();
  float pressure2 = bmp2.readPressure();
  float altitude2 = bmp2.readAltitude();

  Serial.println("BMP1 - Temperature: " + String(temperature1) + "°C Pressure: " + String(pressure1) + "Pa Altitude: " + String(altitude1) + "m");
  Serial.println("BMP2 - Temperature: " + String(temperature2) + "°C Pressure: " + String(pressure2) + "Pa Altitude: " + String(altitude2) + "m");

  // t_average = temperature1 ;
  p_average = pressure1 * 12.4325;
  a_average = altitude1;
  p_average = p_average;
  a_average = a_average;

  Serial.println("BMP1 - Temperature Average: " + String(t_average) + "°C");
  Serial.println("BMP1 - Pressure Average: " + String(p_average) + "Pa");
  Serial.println("BMP1 - Altitude Average: " + String(a_average) + "m");

  delay(2000);

  float humidity1 = dht1.readHumidity();
  float temperatureDHT1 = dht1.readTemperature();

  float humidity2 = dht2.readHumidity();
  float temperatureDHT2 = dht2.readTemperature();

  float humidity3 = dht3.readHumidity();
  float temperatureDHT3 = dht3.readTemperature();

  Serial.println("DHT1 - Humidity: " + String(humidity1) + "% Temperature: " + String(temperatureDHT1) + "°C");
  Serial.println("DHT2 - Humidity: " + String(humidity2) + "% Temperature: " + String(temperatureDHT2) + "°C");
  Serial.println("DHT3 - Humidity: " + String(humidity3) + "% Temperature: " + String(temperatureDHT3) + "°C");

  t_average = (temperatureDHT1 + temperatureDHT2 + temperatureDHT3) / 3;
  h_average = (humidity1 + humidity2 + humidity3) / 3;
  Serial.println("Temperature Average: " + String(t_average) + "°C");
  Serial.println("DHT - Humidity Average: " + String(h_average) + "%");

  digitalWrite(sensorPowerPin, HIGH);
  int sensorValue = analogRead(sensorPin);
  Serial.print("Water Level: ");
  Serial.println(sensorValue);
  digitalWrite(sensorPowerPin, LOW);

  unsigned long currentTime = millis();
  if (currentTime - oldTime >= 1000)
  {
    flowRate = ((1000.0 / (currentTime - oldTime)) * flowPulse) / 7.5;
    oldTime = currentTime;
    flowMilliLitres = (flowRate / 60) * 1000;
    totalMilliLitres += flowMilliLitres;
    flowPulse = 0;

    Serial.println("Flow Rate: " + String(flowRate) + " L/min");
    Serial.println("Total Volume: " + String(totalMilliLitres) + " mL");
  }
  //  ThingSpeak.writeField(writeChannelID, 5,t_average , writeAPIKey);
  // ThingSpeak.writeField(writeChannelID, 6, random(1, 100), writeAPIKey);
  // ThingSpeak.writeField(writeChannelID, 6, random(1, 100), writeAPIKey);
  ThingSpeak.setField(5, t_average);
  ThingSpeak.setField(6, p_average);
  ThingSpeak.setField(7, h_average);
  int x = ThingSpeak.writeFields(writeChannelID, writeAPIKey);

  post_to_om2m(t_average, p_average, h_average);
  t_average = 0;
  p_average = 0;
  a_average = 0;
  delay(2000);
}