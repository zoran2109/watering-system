#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "NETWORK_SSID";
const char* password = "WIFI_PASSWORD";

const String deviceId = "SENSOR_NAME"; // Unique ID for your device
const String serverUrl = "http://RPI_WEB_SERVER_IP:3000/logs";

// Pin for moisture sensor
const int sensorPin = A0;

void setup() {
  Serial.begin(115200);
  delay(100);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int moisture = analogRead(sensorPin);
    Serial.println("Moisture: " + String(moisture));

    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl); // ✅ correct usage now
    http.addHeader("Content-Type", "application/json");

    String json = "{\"deviceId\":\"" + deviceId + "\",\"logData\":{\"moisture\":" + String(moisture) + "}}";

    int httpCode = http.POST(json);
    String response = http.getString();

    Serial.println("HTTP code: " + String(httpCode));
    Serial.println("Response: " + response);

    http.end();
  }

  delay(10 * 60 * 1000); // 10 minutes
}
