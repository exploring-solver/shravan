import os
import subprocess
from typing import Optional, Dict, List
from .config import get_platform, load_app_configs
import shutil
import glob
import json
from pathlib import Path
import pyperclip  # For clipboard operations
import schedule   # For scheduling tasks
import time
import ctypes

def is_admin() -> bool:
    """Check if the script is running with administrative privileges."""
    try:
        return ctypes.windll.shell32.IsUserAnAdmin() != 0
    except:
        return False
    
def find_executable(app: str) -> Optional[str]:
    """Find the executable path for the given application."""
    platform = get_platform()
    app_configs = load_app_configs()
    app_paths = app_configs.get(platform, {}).get(app.lower(), [])

    for path in app_paths:
        expanded_path = os.path.expandvars(path)
        matched_paths = glob.glob(expanded_path)
        for matched_path in matched_paths:
            if os.path.exists(matched_path) or shutil.which(matched_path):
                return matched_path

    return None

def open_application(app: str, task: Optional[str] = None) -> str:
    """Open the specified application and perform a task if provided."""
    app_path = find_executable(app)
    if not app_path:
        return f"Application '{app}' not found or not supported."

    try:
        # Check if the app_path is a shortcut (.lnk file)
        if app_path.lower().endswith('.lnk'):
            os.startfile(app_path)  # This will open the shortcut properly on Windows
            return f"Opened '{app}' via shortcut"

        # If it's not a shortcut, run the executable directly
        command = [app_path]
        if task:
            command.append(task)

        subprocess.Popen(command)
        result = f"Opened '{app}'"
        if task:
            result += f" with task: {task}"
        return result
    except PermissionError:
        # If permission is denied, prompt the user to run as an administrator
        if not is_admin():
            return ("Error: Permission denied. Please run 'shravan start' as an administrator "
                    "for a complete experience.")
        else:
            return f"Error: Permission denied while opening '{app}'."
    except Exception as e:
        return f"Error opening '{app}': {str(e)}"

def run_shell_command(command_str: str) -> str:
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(command_str, shell=True, capture_output=True, text=True)
        if result.stdout:
            return result.stdout
        else:
            return "Command executed with no output."
    except Exception as e:
        return f"Error executing command: {str(e)}"

def manipulate_file(action: str, source: str, destination: Optional[str] = None) -> str:
    """Perform file operations like copy, move, delete."""
    try:
        if action == 'copy':
            shutil.copy(source, destination)
            return f"Copied '{source}' to '{destination}'"
        elif action == 'move':
            shutil.move(source, destination)
            return f"Moved '{source}' to '{destination}'"
        elif action == 'delete':
            os.remove(source)
            return f"Deleted '{source}'"
        elif action == 'create_directory':
            os.makedirs(source, exist_ok=True)
            return f"Directory '{source}' created"
        else:
            return f"Unsupported file action '{action}'"
    except Exception as e:
        return f"Error performing file action '{action}': {str(e)}"

def interact_with_clipboard(action: str, text: Optional[str] = None) -> str:
    """Copy to or paste from the clipboard."""
    try:
        if action == 'copy':
            pyperclip.copy(text)
            return "Text copied to clipboard."
        elif action == 'paste':
            pasted_text = pyperclip.paste()
            return f"Pasted text from clipboard: {pasted_text}"
        else:
            return f"Unsupported clipboard action '{action}'"
    except Exception as e:
        return f"Error with clipboard action '{action}': {str(e)}"

def schedule_task(time_str: str, command: dict) -> str:
    """Schedule a task to be executed at a specific time."""
    action = command.get('action')
    if not action:
        return "Error: 'action' not specified in command."

    def job():
        perform_action(command)

    schedule.every().day.at(time_str).do(job)
    # Run the scheduler in a separate thread or process in production
    return f"Scheduled task '{action}' at {time_str}"

def open_document(file_path: str) -> str:
    """Open a document with the default application."""
    try:
        if os.path.exists(file_path):
            os.startfile(file_path)  # For Windows
            return f"Opened document '{file_path}'"
        else:
            return f"File '{file_path}' does not exist."
    except Exception as e:
        return f"Error opening document: {str(e)}"


def control_media_player(action: str, media: str = None, seek_time: int = None, volume_level: int = None) -> str:
    """
    Control media playback with enhanced functionality.
    
    Args:
        action: The media control action to perform
        media: Optional media file or stream to play
        seek_time: Number of seconds to seek forward/backward
        volume_level: Volume level (0-100)
        
    Returns:
        str: Status message indicating the result of the operation
    """
    try:
        print("Determining platform...")
        platform = get_platform()
        print(f"Platform detected: {platform}")

        if platform == 'windows':
            print("Running on Windows platform.")
            try:
                import win32api
                import win32con
            except ImportError:
                return "Error: 'pywin32' library is required on Windows for media control."

            # Virtual key mappings for media control
            VK_MEDIA_PLAY_PAUSE = 0xB3
            VK_MEDIA_NEXT_TRACK = 0xB0
            VK_MEDIA_PREV_TRACK = 0xB1
            VK_VOLUME_UP = 0xAF
            VK_VOLUME_DOWN = 0xAE
            VK_VOLUME_MUTE = 0xAD
            
            print(f"Action requested: {action}")

            if action == "play":
                # Check if "media" specifies next or previous track
                if media == "next":
                    print("Playing next track.")
                    win32api.keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, 0)
                    return "Next track played"
                elif media == "previous":
                    print("Playing previous track.")
                    win32api.keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, 0)
                    return "Previous track played"
                elif media:
                    # If media is specified as a file, attempt to play it
                    print(f"Attempting to play media file: {media}")
                    os.startfile(media)
                    return f"Playing {media}"
                else:
                    # Toggle play/pause if no specific media is specified
                    print("Attempting to toggle play/pause.")
                    win32api.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
                    return "Media playback started"
                    
            elif action == "pause":
                print("Attempting to pause media.")
                win32api.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
                return "Media playback paused"
                
            elif action == "stop":
                print("Attempting to stop media.")
                win32api.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
                win32api.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
                return "Media playback stopped"
                
            elif action == "forward":
                if seek_time:
                    print(f"Attempting to seek forward within the track by {seek_time} seconds.")
                    # Placeholder: Implement seeking if specific player allows it, otherwise use next track as fallback
                    # Note: Implement specific player integration if needed
                    win32api.keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, 0)
                    return f"Sought forward {seek_time} seconds"
                    
            elif action == "rewind":
                if seek_time:
                    print(f"Attempting to seek backward within the track by {seek_time} seconds.")
                    # Placeholder: Implement seeking if specific player allows it, otherwise use previous track as fallback
                    win32api.keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, 0)
                    # Note: Implement specific player integration if needed
                    return f"Sought backward {seek_time} seconds"

            elif action == "next":
                print("Playing next track.")
                win32api.keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, 0)
                return "Next track played"

            elif action == "previous":
                print("Playing previous track.")
                win32api.keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, 0)
                return "Previous track played"

            elif action == "volume":
                if volume_level is not None:
                    print(f"Setting volume to {volume_level}%.")
                    try:
                        from ctypes import cast, POINTER
                        from comtypes import CLSCTX_ALL
                        from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
                    except ImportError:
                        return "Error: 'pycaw' and 'comtypes' libraries are required for volume control."

                    devices = AudioUtilities.GetSpeakers()
                    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
                    volume = cast(interface, POINTER(IAudioEndpointVolume))
                    
                    scalar_volume = max(0.0, min(1.0, volume_level / 100.0))
                    volume.SetMasterVolumeLevelScalar(scalar_volume, None)
                    return f"Volume set to {volume_level}%"
                    
            elif action == "volume_up":
                print("Increasing volume.")
                win32api.keybd_event(VK_VOLUME_UP, 0, 0, 0)
                return "Volume increased"
                
            elif action == "volume_down":
                print("Decreasing volume.")
                win32api.keybd_event(VK_VOLUME_DOWN, 0, 0, 0)
                return "Volume decreased"
                
            elif action == "mute":
                print("Muting volume.")
                win32api.keybd_event(VK_VOLUME_MUTE, 0, 0, 0)
                return "Volume muted"

        else:
            # For Linux/macOS systems
            print("Running on Linux/macOS platform.")
            print(f"Action requested: {action}")

            if action == "play":
                if media:
                    print(f"Attempting to play media file: {media}")
                    os.system(f"xdg-open '{media}'")  # Linux
                    return f"Playing {media}"
                else:
                    print("Attempting to start playback using playerctl.")
                    os.system("playerctl play")
                    return "Media playback started"
                    
            elif action == "pause":
                print("Attempting to pause playback using playerctl.")
                os.system("playerctl pause")
                return "Media playback paused"
                
            elif action == "stop":
                print("Attempting to stop playback using playerctl.")
                os.system("playerctl stop")
                return "Media playback stopped"
                
            elif action == "forward":
                if seek_time:
                    print(f"Seeking forward {seek_time} seconds.")
                    os.system(f"playerctl position {seek_time}+")
                    return f"Sought forward {seek_time} seconds"
                    
            elif action == "rewind":
                if seek_time:
                    print(f"Seeking backward {seek_time} seconds.")
                    os.system(f"playerctl position {seek_time}-")
                    return f"Sought backward {seek_time} seconds"

            elif action == "next":
                print("Playing next track.")
                os.system("playerctl next")
                return "Next track played"

            elif action == "previous":
                print("Playing previous track.")
                os.system("playerctl previous")
                return "Previous track played"

            elif action == "volume":
                if volume_level is not None:
                    print(f"Setting volume to {volume_level}%.")
                    os.system(f"amixer set Master {volume_level}%")
                    return f"Volume set to {volume_level}%"
                    
            elif action == "volume_up":
                print("Increasing volume using amixer.")
                os.system("amixer set Master 5%+")
                return "Volume increased"
                
            elif action == "volume_down":
                print("Decreasing volume using amixer.")
                os.system("amixer set Master 5%-")
                return "Volume decreased"
                
            elif action == "mute":
                print("Muting volume using amixer.")
                os.system("amixer set Master toggle")
                return "Volume muted"
        
        print("Action completed successfully.")
        return f"Media action '{action}' completed successfully"
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return f"Error controlling media player: {str(e)}"

def perform_custom_script(
    script_path: str,
    args: Optional[List[str]] = None,
    parameters: Optional[Dict[str, str]] = None
) -> str:
    """Execute a custom script with optional arguments and parameters."""
    if not os.path.exists(script_path):
        return f"Script '{script_path}' does not exist."

    try:
        # Start with base command
        command = ['python', script_path]

        # Add regular args if they exist
        if args:
            command.extend(args)

        # Add parameters as key=value pairs if they exist
        if parameters:
            for key, value in parameters.items():
                command.append(f"{key}={value}")

        print("Executing command:", command)  # Debugging print statement

        # Run the command
        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate()

        # Return the result or an error message
        if process.returncode == 0:
            return stdout or "Script executed successfully with no output."
        else:
            return f"Error executing script: {stderr.strip()}"
    except Exception as e:
        return f"Error executing script: {str(e)}"


def parse_parameter_arg(arg: str) -> tuple:
    """Parse a parameter argument in the format key=value."""
    if '=' in arg:
        key, value = arg.split('=', 1)
        return key.strip(), value.strip()
    return None, None
# Add more functions for additional features as needed
