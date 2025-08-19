// ESP8266 + MQTT Pump Controller with JSON messages (non-blocking)
// ---------------------------------------------------------------

#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

#define RELAY_PIN D7                   // GPIO13 for NodeMCU D7
#define MAX_WATERING_DURATION 180000UL // 3 minutes in ms

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// MQTT broker settings
const char* mqtt_server   = "192.168.100.3"; // MQTT broker IP
const int   mqtt_port     = 1883;
const char* mqtt_client_id = "arduino-pump"; // unique per device
const char* topic_command  = "pump/water";
const char* topic_status   = "pump/status";

WiFiClient espClient;
PubSubClient client(espClient);

// State tracking
bool wateringInProgress = false;
unsigned long wateringStart    = 0;
unsigned long wateringDuration = 0;

void publishStatus(const char* message, bool success, unsigned long value = 0) {
  StaticJsonDocument<256> doc;
  doc["deviceId"] = mqtt_client_id;
  doc["type"]     = "pump";
  doc["success"]  = success;
  doc["message"]  = message;
  doc["value"]    = value;

  char buffer[256];
  size_t n = serializeJson(doc, buffer);
  client.publish(topic_status, buffer, n);
}

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

void handleWaterCommand(JsonDocument& doc) {
  // Verify deviceId matches this client
  const char* targetDevice = doc["deviceId"];
  if (!targetDevice || strcmp(targetDevice, mqtt_client_id) != 0) {
    Serial.printf("⏭ Ignoring command for %s (this is %s)\n", targetDevice ? targetDevice : "null", mqtt_client_id);
    return;
  }

  const char* command = doc["command"];
  if (!command) {
    Serial.println("❌ Missing command field");
    return;
  }

  if (strcmp(command, "WATER") == 0) {
    if (wateringInProgress) {
      publishStatus("Already in progress", false);
      return;
    }

    unsigned long wantedDuration = doc["duration"] | 0;
    wateringDuration = (wantedDuration > MAX_WATERING_DURATION)
                          ? MAX_WATERING_DURATION
                          : wantedDuration;

    // Start watering
    wateringInProgress = true;
    wateringStart = millis();

    Serial.printf("💧 Starting watering for %lu ms\n", wateringDuration);
    publishStatus("Watering started", true, wateringDuration);

    digitalWrite(RELAY_PIN, LOW); // pump ON
  }
  else {
    Serial.printf("❌ Unknown command: %s\n", command);
    publishStatus("Unknown command", false);
  }
}

void callback(char* topic, byte* message, unsigned int length) {
  String payload;
  for (unsigned int i = 0; i < length; i++) {
    payload += (char)message[i];
  }
  Serial.printf("📩 MQTT message on %s: %s\n", topic, payload.c_str());

  if (String(topic) == topic_command) {
    StaticJsonDocument<256> doc;
    DeserializationError err = deserializeJson(doc, payload);
    if (err) {
      Serial.printf("❌ JSON parse failed: %s\n", err.c_str());
      return;
    }
    handleWaterCommand(doc);
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // relay off

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

  // Check watering timeout
  if (wateringInProgress && (millis() - wateringStart >= wateringDuration)) {
    digitalWrite(RELAY_PIN, HIGH); // pump OFF
    wateringInProgress = false;

    publishStatus("Watering done", true, wateringDuration);
    Serial.println("✅ Watering completed");
  }
}
