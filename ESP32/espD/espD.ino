#include <WiFi.h>
#include "ThingSpeak.h"

// const char* ssid = "iPhone_atp";
// const char* pass = "1 2 3 4 5 6 7";
const char *ssid = "Redmi Note 11T 5G";
const char *pass = "AshwinsRedmi1221";
const int buzzerpin = 22;
const int motorPin1 = 12;
const int motorPin2 = 14;
long writeChannelID = 2151430;
const char *writeAPIKey = "YSQDHI1PZ3YPFENE";
WiFiClient client;
float avg = 0;
int statusCode = 0;
int field[8] = {1, 2, 3, 4, 5, 6, 7, 8};
int damstate, damstateretain;
int motorturned = 0;

void setup()
{
  Serial.begin(9600);
  pinMode(buzzerpin, OUTPUT);
  digitalWrite(buzzerpin, HIGH);
  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("Connecting to WiFi");
    delay(1000);
  }
  Serial.println("WiFi Connected!");
  ThingSpeak.begin(client);
}

void loop()
{
  digitalWrite(buzzerpin, HIGH);
  int damstate = ThingSpeak.readFloatField(writeChannelID, 8);
  delay(2000);
  Serial.print("Chance of Flood: ");
  Serial.println(damstate);

  Serial.print(damstate);
  Serial.print("      ");
  Serial.println(motorturned);
  if (damstate >= 80)
  {
    Serial.println("Dam down");
    for (int i = 0; i < 5; ++i)
    {
      digitalWrite(buzzerpin, LOW);
      delay(500);
      digitalWrite(buzzerpin, HIGH);
      delay(500);
    }
    if (motorturned != 1)
    {
      digitalWrite(motorPin1, HIGH);
      digitalWrite(motorPin2, LOW);
      delay(10000);
      motorturned = 1;
    }
    digitalWrite(motorPin2, LOW);
    digitalWrite(motorPin1, LOW);
    delay(5000);
  }
  else
  {
    Serial.println("Should Go up");
    digitalWrite(buzzerpin, HIGH);
    if (motorturned != 0)
    {
      Serial.println("whytf");
      digitalWrite(motorPin1, LOW);
      digitalWrite(motorPin2, HIGH);
      delay(10000);
      motorturned = 0;
    }
    digitalWrite(motorPin2, LOW);
    digitalWrite(motorPin1, LOW);
  }
}
