"""
WhatsApp Bulk Message Sender
============================

This script sends the same WhatsApp message to multiple contacts using WhatsApp Web.

INSTALLATION:
-------------
1. Make sure you have Python 3.7+ installed
2. Install required libraries by running:
   pip install pywhatkit

HOW TO PREPARE contacts.csv:
----------------------------
1. Create a file named 'contacts.csv' in the same folder as this script
2. The CSV file should have one column named 'number'
3. Add phone numbers WITHOUT the country code (script adds +94 automatically)
4. Example contacts.csv content:
   
   number
   7XXXXXXXX
   7XXXXXXXX

HOW TO RUN:
-----------
1. Make sure WhatsApp Web is logged in on your default browser
2. Open terminal/command prompt in this folder
3. Run: python whatsapp_sender.py
4. Keep your computer unlocked and don't close the browser windows

IMPORTANT NOTES:
----------------
- The script adds +94 (Sri Lanka) country code automatically
- There's a 15-20 second delay between messages to avoid WhatsApp blocking
- If a message fails, the script will continue to the next contact
- WhatsApp Web tabs close automatically after each message

Author: WhatsApp Automation Tool
"""

import pywhatkit as kit
import csv
import time
import random
import os
import pyautogui  # For pressing Enter key to send message

# ============================================
# CONFIGURATION - CHANGE THESE VALUES AS NEEDED
# ============================================

# The message you want to send (change this to your desired message)
MESSAGE = """Hello! 👋

This is an automated message sent via WhatsApp Web.

Thank you!"""

# Country code (change if you're in a different country)
COUNTRY_CODE = "+94"

# Path to the CSV file containing phone numbers
CSV_FILE = "contacts.csv"

# Delay between messages (in seconds) - helps avoid WhatsApp blocking
MIN_DELAY = 15  # Minimum delay
MAX_DELAY = 20  # Maximum delay

# Wait time for WhatsApp Web to load (in seconds)
WAIT_TIME = 20

# Time to wait before closing the tab (in seconds)
CLOSE_TAB_DELAY = 5


# ============================================
# MAIN FUNCTIONS
# ============================================

def read_contacts_from_csv(file_path):
    """
    Reads phone numbers from a CSV file.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        List of phone numbers
    """
    contacts = []
    
    try:
        # Open and read the CSV file
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            # Check if 'number' column exists
            if 'number' not in reader.fieldnames:
                print("❌ Error: CSV file must have a column named 'number'")
                return []
            
            # Read each row and extract phone number
            for row in reader:
                number = row['number'].strip()
                if number:  # Only add non-empty numbers
                    contacts.append(number)
                    
        print(f"✅ Successfully loaded {len(contacts)} contacts from {file_path}")
        return contacts
        
    except FileNotFoundError:
        print(f"❌ Error: File '{file_path}' not found!")
        print("Please create a contacts.csv file with a 'number' column.")
        return []
    except Exception as e:
        print(f"❌ Error reading CSV file: {e}")
        return []


def format_phone_number(number, country_code):
    """
    Formats the phone number by adding country code.
    
    Handles different formats:
    - Starts with '7' → Add +94 (e.g., 771234567 → +94771234567)
    - Starts with '94' → Just add + (e.g., 94771234567 → +94771234567)
    - Starts with '0' → Remove 0 and add +94 (e.g., 0771234567 → +94771234567)
    
    Args:
        number: The phone number in any format
        country_code: The country code to add (e.g., '+94')
        
    Returns:
        Formatted phone number with country code
    """
    # Remove any spaces, dashes, or dots from the number
    cleaned_number = number.replace(" ", "").replace("-", "").replace(".", "")
    
    # Check different formats and format accordingly
    if cleaned_number.startswith("94"):
        # Already has country code, just add +
        formatted_number = "+" + cleaned_number
    elif cleaned_number.startswith("0"):
        # Remove leading zero and add country code
        formatted_number = country_code + cleaned_number[1:]
    elif cleaned_number.startswith("7"):
        # Local number starting with 7, add country code
        formatted_number = country_code + cleaned_number
    else:
        # For any other format, just add country code
        formatted_number = country_code + cleaned_number
    
    return formatted_number


def send_whatsapp_message(phone_number, message):
    """
    Sends a WhatsApp message to a single contact.
    
    Args:
        phone_number: The phone number with country code
        message: The message to send
        
    Returns:
        True if successful, False otherwise
    """
    try:
        print(f"📱 Sending message to {phone_number}...")
        
        # Send the message using pywhatkit
        # Parameters:
        # - phone_number: Number with country code
        # - message: The message text
        # - wait_time: Seconds to wait for WhatsApp Web to load
        # - tab_close: Close the browser tab after sending
        # - close_time: Seconds to wait before closing tab
        kit.sendwhatmsg_instantly(
            phone_no=phone_number,
            message=message,
            wait_time=WAIT_TIME,
            tab_close=False,  # Don't auto-close, we'll handle it
            close_time=CLOSE_TAB_DELAY
        )
        
        # Wait a moment then press Enter to send (in case it didn't auto-send)
        time.sleep(2)
        pyautogui.press('enter')
        
        # Wait before closing the tab
        time.sleep(CLOSE_TAB_DELAY)
        
        # Close the tab using Ctrl+W
        pyautogui.hotkey('ctrl', 'w')
        
        print(f"✅ Message sent successfully to {phone_number}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to send message to {phone_number}")
        print(f"   Error: {e}")
        return False


def main():
    """
    Main function that orchestrates the bulk message sending process.
    """
    print("=" * 60)
    print("       WhatsApp Bulk Message Sender")
    print("=" * 60)
    print()
    
    # Check if CSV file exists
    if not os.path.exists(CSV_FILE):
        print(f"❌ Error: '{CSV_FILE}' not found in current directory!")
        print()
        print("Please create a contacts.csv file with the following format:")
        print("number")
        print("7XXXXXXXX")
        print("7XXXXXXXX")
        print()
        return
    
    # Read contacts from CSV
    contacts = read_contacts_from_csv(CSV_FILE)
    
    if not contacts:
        print("❌ No contacts found. Please check your CSV file.")
        return
    
    # Display the message that will be sent
    print()
    print("-" * 60)
    print("Message to be sent:")
    print("-" * 60)
    print(MESSAGE)
    print("-" * 60)
    print()
    
    # Confirm before sending
    print(f"📋 Ready to send message to {len(contacts)} contacts")
    print(f"⏱️  Delay between messages: {MIN_DELAY}-{MAX_DELAY} seconds")
    print()
    
    # Ask for confirmation
    confirm = input("Do you want to proceed? (yes/no): ").strip().lower()
    if confirm not in ['yes', 'y']:
        print("❌ Operation cancelled by user.")
        return
    
    print()
    print("🚀 Starting to send messages...")
    print("=" * 60)
    print()
    
    # Track success and failure counts
    success_count = 0
    failure_count = 0
    
    # Send message to each contact
    for index, number in enumerate(contacts, start=1):
        # Format the phone number with country code
        formatted_number = format_phone_number(number, COUNTRY_CODE)
        
        print(f"[{index}/{len(contacts)}] Processing {formatted_number}")
        
        # Send the message
        if send_whatsapp_message(formatted_number, MESSAGE):
            success_count += 1
        else:
            failure_count += 1
        
        # Add delay between messages (except for the last one)
        if index < len(contacts):
            delay = random.randint(MIN_DELAY, MAX_DELAY)
            print(f"⏳ Waiting {delay} seconds before next message...")
            print()
            time.sleep(delay)
    
    # Print summary
    print()
    print("=" * 60)
    print("                    SUMMARY")
    print("=" * 60)
    print(f"✅ Messages sent successfully: {success_count}")
    print(f"❌ Messages failed: {failure_count}")
    print(f"📊 Total contacts: {len(contacts)}")
    print("=" * 60)
    print()
    print("🎉 Process completed!")


# Run the main function when script is executed
if __name__ == "__main__":
    main()
