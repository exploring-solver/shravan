import os
import subprocess
import platform
import asyncio
import websockets
import json

# User-specific token (each user will enter their unique token at first run)
USER_TOKEN = None

# Mapping of application names to their executable commands
APP_PATHS = {
    "chrome": "chrome" if platform.system() == "Windows" else "google-chrome",
    "notepad": "notepad" if platform.system() == "Windows" else "gedit",
    "spotify": "spotify"
}

async def open_application(app_name):
    """Opens the specified application if it exists in APP_PATHS."""
    if app_name in APP_PATHS:
        try:
            print(f"Opening {app_name}...")
            subprocess.Popen([APP_PATHS[app_name]])
            return f"Opened {app_name} successfully"
        except Exception as e:
            return f"Failed to open {app_name}: {e}"
    else:
        return f"Application {app_name} not recognized."

async def perform_task(command):
    """Handle tasks like opening URLs, performing search actions."""
    app_name = command.get('application')
    action = command.get('action')
    task = command.get('task')

    if action == "open" and app_name:
        result = await open_application(app_name)
        if task and app_name == "chrome":
            # Handle tasks for Chrome (like opening URLs)
            import time
            time.sleep(3)  # Give Chrome time to open
            os.system(f'start chrome {task}' if platform.system() == "Windows" else f'open -a "Google Chrome" {task}')
            result += f", Opened URL: {task}"
        return result
    else:
        return "Action not supported or unrecognized."

async def listen_to_server(uri, user_token):
    """Connect to the server and listen for commands."""
    async with websockets.connect(uri, extra_headers={"Authorization": user_token}) as websocket:
        print("Connected to the Bylexa server...")
        
        while True:
            # Receive a command from the server
            command_json = await websocket.recv()
            print(f"Received command: {command_json}")
            
            # Simulate the task based on the received command
            command = json.loads(command_json)
            result = await perform_task(command)
            
            # Send the result back to the server
            await websocket.send(f"Result: {result}")
            print(f"Sent result: {result}")

def configure_agent():
    """Configure agent on first run by asking the user for their token."""
    global USER_TOKEN
    USER_TOKEN = input("Enter your Bylexa API token: ")
    with open("agent_config.json", "w") as config_file:
        json.dump({"user_token": USER_TOKEN}, config_file)
    print("Agent configured successfully.")

if __name__ == "__main__":
    # Check if the agent has been configured already
    try:
        with open("agent_config.json", "r") as config_file:
            config = json.load(config_file)
            USER_TOKEN = config["user_token"]
    except FileNotFoundError:
        configure_agent()  # First run configuration

    # WebSocket server URI (Bylexa server)
    server_uri = "ws://your-bylexa-server.com:8080"
    asyncio.get_event_loop().run_until_complete(listen_to_server(server_uri, USER_TOKEN))
