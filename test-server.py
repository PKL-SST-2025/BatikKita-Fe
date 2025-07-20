#!/usr/bin/env python3
"""
Simple HTTP server to serve the CORS test page
Run this from the fe directory
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Set the port
PORT = 3000

# Change to the directory containing this script
script_dir = Path(__file__).parent
os.chdir(script_dir)

# Create a custom request handler that adds CORS headers
class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

# Create the server
with socketserver.TCPServer(("", PORT), CORSHTTPRequestHandler) as httpd:
    print(f"🌐 Serving HTTP on port {PORT}")
    print(f"📁 Serving directory: {script_dir}")
    print(f"🔗 Test page: http://localhost:{PORT}/cors-test.html")
    print("📱 Opening browser...")
    
    # Open the test page in browser
    webbrowser.open(f"http://localhost:{PORT}/cors-test.html")
    
    print("🛑 Press Ctrl+C to stop the server")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
