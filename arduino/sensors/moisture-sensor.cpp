// Copy this code to Arduino IDE

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// WiFi credentials
const char* ssid = "NETWORK_SSID";
const char* password = "WIFI_PASSWORD";

// Server and device ID
const String deviceId = "SENSOR_NAME";
const String serverUrl = "http://RPI_WEB_SERVER_IP:3000/logs";

// Moisture sensor pins
const int sensorPin = A0;
const int sensorPowerPin = D6; // Powering sensor via GPIO

// Deep sleep time (in microseconds)
const uint64_t sleepTime = 60 * 60 * 1000000ULL; // 1 hour

int getAverageMoisture(int samples = 5) {
  long total = 0;
  for (int i = 0; i < samples; i++) {
    total += analogRead(sensorPin);
    delay(50);
  }
  return total / samples;
}

void setup() {
  Serial.begin(115200);
  delay(100);

  // Power on the sensor if using GPIO
  pinMode(sensorPowerPin, OUTPUT);
  digitalWrite(sensorPowerPin, HIGH);

  delay(300); // Wait for sensor to stabilize

  int moisture = getAverageMoisture();
  Serial.println("Average Moisture: " + String(moisture));

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 20) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi");

    WiFiClient client;
    HTTPClient http;

    http.begin(client, serverUrl);
    http.addHeader("Content-Type", "application/json");

    String json = "{\"deviceId\":\"" + deviceId + "\",\"logData\":{\"moisture\":" + String(moisture) + "}}";

    int httpCode = http.POST(json);
    String response = http.getString();

    Serial.println("HTTP code: " + String(httpCode));
    Serial.println("Response: " + response);

    http.end();
  } else {
    Serial.println("\nWiFi not connected. Skipping upload.");
  }

  // Power off the sensor
  digitalWrite(sensorPowerPin, LOW);

  Serial.println("Going to sleep...");
  ESP.deepSleep(sleepTime);
}

void loop() {
  // Not used with deep sleep
}
