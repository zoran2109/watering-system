// This code should be copied into Arduino IDE and exported to Arduino
#define RELAY_PIN D7 // Use 7 for Uno, D7 (or 13 for GPIO number) for NODEMCU
#define MAX_WATERING_DURATION 180000UL // Max duration for watering is 3 min

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);
  Serial.begin(9600);
  Serial.println("🔌 Arduino ready");
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.startsWith("WATER")) {
      long unsigned int wantedDuration = command.substring(6).toInt();
      long int duration = min(wantedDuration, MAX_WATERING_DURATION);
      Serial.print("💧 Watering for ");
      Serial.print(duration);
      Serial.println("ms");

      digitalWrite(RELAY_PIN, LOW);
      delay(duration);
      digitalWrite(RELAY_PIN, HIGH);

      Serial.println("✅ Watering done");
    } else {
      Serial.print("❓ Unknown command: ");
      Serial.println(command);
    }
  }
}
