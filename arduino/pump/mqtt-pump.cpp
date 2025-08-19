// This code should be copied into Arduino IDE and exported to Arduino
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

#define RELAY_PIN D7 // GPIO13 for NodeMCU D7
#define MAX_WATERING_DURATION 180000UL // 3 minutes in ms

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT broker settings
const char* mqtt_server = "192.168.100.3"; // MQTT broker IP
const int   mqtt_port = 1883;
const char* mqtt_client_id = "arduino-pump";
const char* topic_command = "pump/water";
const char* topic_status = "pump/status";

WiFiClient espClient;
PubSubClient client(espClient);

bool wateringInProgress = false;

void reconnect() {
  while (!client.connected()) {
    Serial.print("🔌 Attempting MQTT connection...");
    if (client.connect(mqtt_client_id)) {
      Serial.println("✅ connected");
      client.subscribe(topic_command);
    } else {
      Serial.print("❌ failed, rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 5s");
      delay(5000);
    }
  }
}

void handleWaterCommand(String payload) {
  if (wateringInProgress) {
    client.publish(topic_status, "❌ Already in progress");
    return;
  }

  unsigned long wantedDuration = payload.toInt();
  unsigned long duration = (wantedDuration > MAX_WATERING_DURATION)
                              ? MAX_WATERING_DURATION
                              : wantedDuration;

  wateringInProgress = true;

  Serial.printf("💧 Starting watering for %lu ms\n", duration);
  client.publish("pump/status", "💧 Watering started");

  digitalWrite(RELAY_PIN, LOW);
  delay(duration);
  digitalWrite(RELAY_PIN, HIGH);

  wateringInProgress = false;
  client.publish(topic_status, "✅ Watering done");
}

void callback(char* topic, byte* message, unsigned int length) {
  String payload;
  for (unsigned int i = 0; i < length; i++) {
    payload += (char)message[i];
  }
  Serial.printf("📩 MQTT message on %s: %s\n", topic, payload.c_str());

  if (String(topic) == topic_command) {
    handleWaterCommand(payload);
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  WiFi.begin(ssid, password);
  Serial.print("🔌 Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n✅ Connected! IP: %s\n", WiFi.localIP().toString().c_str());

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
