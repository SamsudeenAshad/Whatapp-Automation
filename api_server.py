"""
WhatsApp Bulk Sender - Backend API Server
==========================================

This Flask server provides an API for the web application to send WhatsApp messages
using pywhatkit and pyautogui for automatic sending.

Run this server alongside the web app for fully automatic message sending.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pywhatkit as kit
import pyautogui
import time
import threading
import queue

app = Flask(__name__)
CORS(app)  # Enable CORS for web app

# Queue to manage sending tasks
message_queue = queue.Queue()
sending_status = {
    "is_sending": False,
    "current_index": 0,
    "total": 0,
    "current_number": "",
    "results": []
}

# Configuration
WAIT_TIME = 15  # Seconds to wait for WhatsApp Web to load
CLOSE_TAB_DELAY = 3  # Seconds before closing tab
DELAY_BETWEEN_MESSAGES = 15  # Seconds between messages


def format_phone_number(number: str) -> str:
    """Format phone number with +94 country code."""
    cleaned = number.replace(" ", "").replace("-", "").replace(".", "")
    
    if cleaned.startswith("94"):
        return "+" + cleaned
    elif cleaned.startswith("0"):
        return "+94" + cleaned[1:]
    elif cleaned.startswith("7"):
        return "+94" + cleaned
    else:
        return "+94" + cleaned


def send_single_message(phone_number: str, message: str) -> dict:
    """Send a single WhatsApp message."""
    try:
        formatted_number = format_phone_number(phone_number)
        
        # Send using pywhatkit
        kit.sendwhatmsg_instantly(
            phone_no=formatted_number,
            message=message,
            wait_time=WAIT_TIME,
            tab_close=False,
            close_time=CLOSE_TAB_DELAY
        )
        
        # Wait and press Enter to send
        time.sleep(2)
        pyautogui.press('enter')
        
        # Wait before closing
        time.sleep(CLOSE_TAB_DELAY)
        
        # Close the tab
        pyautogui.hotkey('ctrl', 'w')
        
        return {"number": formatted_number, "status": "sent", "error": None}
        
    except Exception as e:
        return {"number": phone_number, "status": "failed", "error": str(e)}


def process_message_queue():
    """Background worker to process message queue."""
    global sending_status
    
    while True:
        try:
            task = message_queue.get(timeout=1)
            if task is None:
                continue
                
            contacts = task["contacts"]
            message = task["message"]
            
            sending_status["is_sending"] = True
            sending_status["total"] = len(contacts)
            sending_status["current_index"] = 0
            sending_status["results"] = []
            
            for i, contact in enumerate(contacts):
                sending_status["current_index"] = i + 1
                sending_status["current_number"] = contact
                
                result = send_single_message(contact, message)
                sending_status["results"].append(result)
                
                # Delay between messages (except last one)
                if i < len(contacts) - 1:
                    time.sleep(DELAY_BETWEEN_MESSAGES)
            
            sending_status["is_sending"] = False
            message_queue.task_done()
            
        except queue.Empty:
            continue
        except Exception as e:
            print(f"Error in queue processor: {e}")
            sending_status["is_sending"] = False


# Start background worker thread
worker_thread = threading.Thread(target=process_message_queue, daemon=True)
worker_thread.start()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "WhatsApp Sender API is running"})


@app.route('/api/send', methods=['POST'])
def send_messages():
    """Start sending messages to contacts."""
    global sending_status
    
    if sending_status["is_sending"]:
        return jsonify({
            "success": False,
            "error": "Already sending messages. Please wait."
        }), 400
    
    data = request.json
    contacts = data.get("contacts", [])
    message = data.get("message", "")
    
    if not contacts:
        return jsonify({"success": False, "error": "No contacts provided"}), 400
    
    if not message:
        return jsonify({"success": False, "error": "No message provided"}), 400
    
    # Add to queue
    message_queue.put({"contacts": contacts, "message": message})
    
    return jsonify({
        "success": True,
        "message": f"Started sending to {len(contacts)} contacts",
        "total": len(contacts)
    })


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current sending status."""
    return jsonify({
        "is_sending": sending_status["is_sending"],
        "current_index": sending_status["current_index"],
        "total": sending_status["total"],
        "current_number": sending_status["current_number"],
        "results": sending_status["results"],
        "progress": (sending_status["current_index"] / sending_status["total"] * 100) if sending_status["total"] > 0 else 0
    })


@app.route('/api/results', methods=['GET'])
def get_results():
    """Get sending results."""
    sent = len([r for r in sending_status["results"] if r["status"] == "sent"])
    failed = len([r for r in sending_status["results"] if r["status"] == "failed"])
    
    return jsonify({
        "results": sending_status["results"],
        "summary": {
            "total": len(sending_status["results"]),
            "sent": sent,
            "failed": failed
        }
    })


if __name__ == '__main__':
    print("=" * 60)
    print("       WhatsApp Bulk Sender - API Server")
    print("=" * 60)
    print()
    print("🚀 Server running at http://localhost:5000")
    print("📱 Make sure WhatsApp Web is logged in!")
    print()
    print("Endpoints:")
    print("  POST /api/send    - Send messages")
    print("  GET  /api/status  - Get sending status")
    print("  GET  /api/results - Get results")
    print()
    
    app.run(host='0.0.0.0', port=5000, debug=False)
