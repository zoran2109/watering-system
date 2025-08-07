from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Webhook received. Deploying...")

        subprocess.Popen(["/home/repo/watering-system/deploy/deploy.sh"])

def run():
    server = HTTPServer(('0.0.0.0', 9000), WebhookHandler)
    print("🚀 Webhook server listening on port 9000")
    server.serve_forever()

if __name__ == "__main__":
    run()
