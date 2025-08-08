#define RELAY_PIN 7  // safer than D0

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);
  Serial.begin(9600);
  Serial.println("🔌 Arduino ready");
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();

    if (command.startsWith("WATER")) {
      int duration = command.substring(6).toInt();
      Serial.print("💧 Watering for ");
      Serial.print(duration);
      Serial.println("ms");

      digitalWrite(RELAY_PIN, HIGH);
      delay(duration);
      digitalWrite(RELAY_PIN, LOW);

      Serial.println("✅ Watering done");
    } else {
      Serial.print("❓ Unknown command: ");
      Serial.println(command);
    }
  }
}
