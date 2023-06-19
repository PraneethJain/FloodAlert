#include <WiFi.h>
#include "ThingSpeak.h"
#include <HTTPClient.h>
#include <time.h>
#define CSE_IP "192.168.33.201"
#define CSE_PORT 5089
#define OM2M_ORGIN "admin:admin"
#define OM2M_MN "/~/in-cse/in-name/"
#define OM2M_AE "Demo"
const char *CONT = "Datas3/Values";
const char *ntpServer = "pool.ntp.org";
HTTPClient http;

const int trigPin = 19;
const int echoPins[] = {23, 25, 27, 33, 32, 35};
const int size = sizeof(echoPins) / sizeof(echoPins[0]);

const char *ssid = "Praneeth's ROG";
const char *pass = "olaaqies";

long writeChannelID = 2151430;
const char *writeAPIKey = "YSQDHI1PZ3YPFENE";

WiFiClient client;

void setup()
{
  pinMode(trigPin, OUTPUT);
  for (int i = 0; i < size; ++i)
    pinMode(echoPins[i], INPUT);

  Serial.begin(9600);
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
}

double readDistance(const int echoPin)
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return ((double)pulseIn(echoPin, HIGH)) / 29 / 2;
}

void post_to_om2m(float value1)
{
  String data;
  String server = "http://" + String() + CSE_IP + ":" + String() + CSE_PORT + String() + OM2M_MN;

  http.begin(server + String() + OM2M_AE + "/" + CONT + "/");

  http.addHeader("X-M2M-Origin", OM2M_ORGIN);
  http.addHeader("Content-Type", "application/json;ty=4");
  http.addHeader("Content-Length", "100");

  data = "[" + String(value1) + "]";
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
  int sum = 0, p = 0;
  delay(1000);
  for (int i = 0; i < size; ++i)
  {
    float q = readDistance(echoPins[i]);

    Serial.print(echoPins[i]);
    Serial.print(": ");
    Serial.println(q);
    sum += q;
    if (q != 0)
    {
      p += 1;
    }
  }
  if (p != 0)
  {
    sum /= p;
  }
  Serial.println(sum);
  ThingSpeak.writeField(writeChannelID, 1, sum, writeAPIKey);
  // Serial.println(ThingSpeak.readFloatField(writeChannelID, 1));
  post_to_om2m(sum);
}