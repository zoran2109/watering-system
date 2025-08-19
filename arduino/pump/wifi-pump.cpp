// This code should be copied into Arduino IDE and exported to Arduino
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>

#define RELAY_PIN D7
#define MAX_WATERING_DURATION 180000UL // Max 3 minutes

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

ESP8266WebServer server(80);
bool wateringInProgress = false;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  Serial.begin(9600);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Start mDNS responder
  if (MDNS.begin("arduino-pump")) { // <-- This makes http://my-pump.local work
    Serial.println("mDNS responder started: http://arduino-pump.local/");
  } else {
    Serial.println("Error starting mDNS");
  }

  server.on("/water", HTTP_POST, handleWater);
  server.begin();
}

void loop() {
  server.handleClient();
  MDNS.update(); // Keep mDNS running
}

void handleWater() {
  if (wateringInProgress) {
    server.send(429, "text/plain", "Pump is busy");
    return;
  }

  if (!server.hasArg("duration")) {
    server.send(400, "text/plain", "Missing 'duration' parameter");
    return;
  }

  unsigned long duration = server.arg("duration").toInt();
  duration = min(duration, MAX_WATERING_DURATION);

  wateringInProgress = true;

  Serial.printf("💧 Watering for %lu ms\n", duration);

  digitalWrite(RELAY_PIN, LOW);
  delay(duration);
  digitalWrite(RELAY_PIN, HIGH);

  Serial.println("✅ Watering done");
  wateringInProgress = false;

  server.send(200, "text/plain", "OK");
}
