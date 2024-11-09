from typing import Dict, Callable, Any, List
from .config import get_platform, get_custom_scripts, ensure_script_manager
from .actions import (
    open_application,
    run_shell_command,
    manipulate_file,
    interact_with_clipboard,
    schedule_task,
    open_document,
    control_media_player,
    perform_custom_script,
    parse_parameter_arg
)
import json
import os
from difflib import get_close_matches
from .script_manager import init_script_manager, get_script_manager

# Registry for command handlers
COMMAND_HANDLERS: Dict[str, Callable] = {}

def register_command(action: str):
    """Decorator to register a command handler."""
    def decorator(func):
        COMMAND_HANDLERS[action.lower()] = func
        return func
    return decorator

def perform_action(command: Dict[str, str]) -> str:
    """Perform the action specified in the command dictionary."""
    action = command.get('action', '').lower()
    handler = COMMAND_HANDLERS.get(action)
    if handler:
        return handler(command)
    else:
        return f"Action '{action}' is not supported."

@register_command("open")
def handle_open_command(command: Dict[str, str]) -> str:
    app = command.get('application')
    task = command.get('task')
    file_path = command.get('file_path')
    if file_path:
        return open_document(file_path)
    if not app:
        return "Error: 'application' not specified in command."
    return open_application(app, task)

@register_command("script")
def handle_custom_script_command(command: Dict[str, Any]) -> str:
    """
    Handles script execution commands with automatic WebDriver session management.
    """
    try:
        print("Received command:", command)

        # Ensure script manager is initialized
        ensure_script_manager()

        script_name = command.get('script_name')
        args = command.get('args', [])
        parameters = {}
        
        # Prepare args as list of strings
        flattened_args = []
        for arg in args:
            if isinstance(arg, dict):
                for key, value in arg.items():
                    flattened_args.append(f"--{key}")
                    flattened_args.append(str(value))
            elif isinstance(arg, str):
                flattened_args.append(arg)
            else:
                print(f"Unhandled argument type: {type(arg)}")
                continue
        
        # Include any parameters directly specified in the command
        if 'parameters' in command:
            parameters.update(command['parameters'])

        print("Script name:", script_name)
        print("Arguments:", flattened_args)
        print("Parameters:", parameters)

        if not script_name:
            return "Error: 'script_name' not specified."
        
        # Get the script manager instance
        script_manager = get_script_manager()
        
        # Load custom scripts from configuration
        print("Loading custom scripts from configuration...")
        custom_scripts = get_custom_scripts()
        print("Custom scripts loaded:", custom_scripts)

        # Find the closest match for the requested script name
        print("Finding closest match for script name:", script_name)
        closest_matches = get_close_matches(script_name.lower(), custom_scripts.keys(), n=1, cutoff=0.5)
        print("Closest matches found:", closest_matches)

        if not closest_matches:
            return f"Error: Script '{script_name}' not found."
        
        # Get the best match script path
        best_match_script_name = closest_matches[0]
        script_path = custom_scripts[best_match_script_name]
        
        # Run the script with the specified arguments and parameters
        print("Running script:", script_path, "with arguments:", flattened_args, "and parameters:", parameters)
        result = script_manager.perform_script(script_path, flattened_args, parameters)
        print("Script result:", result)
        
        return result

    except Exception as e:
        error_msg = f"Error executing script command: {str(e)}"
        print(error_msg)
        return error_msg

@register_command("run")
def handle_run_command(command: Dict[str, str]) -> str:
    command_str = command.get('command_line')
    if not command_str:
        return "Error: 'command' not specified."
    return run_shell_command(command_str)

@register_command("file")
def handle_file_command(command: Dict[str, str]) -> str:
    action = command.get('file_action')
    source = command.get('source')
    destination = command.get('destination')
    if not action or not source:
        return "Error: 'file_action' and 'source' are required."
    return manipulate_file(action, source, destination)

@register_command("clipboard")
def handle_clipboard_command(command: Dict[str, str]) -> str:
    action = command.get('clipboard_action')
    text = command.get('text')
    return interact_with_clipboard(action, text)

@register_command("schedule")
def handle_schedule_command(command: Dict[str, str]) -> str:
    time_str = command.get('time')
    if not time_str:
        return "Error: 'time' not specified."
    return schedule_task(time_str, command.get('task_command'))

@register_command("media")
def handle_media_command(command: Dict[str, str]) -> str:
    """
    Handle media control commands with enhanced functionality.
    
    Supports:
    - Basic media controls (play, pause, stop)
    - Seeking (forward/rewind)
    - Volume control (up, down, mute, specific level)
    - Media file playback
    
    Args:
        command: Dictionary containing media control parameters
            - media_action: Required. The action to perform
            - media: Optional. Media file or stream to play
            - seek_time: Optional. Time in seconds for seeking
            - volume_level: Optional. Volume level (0-100)
    
    Returns:
        str: Status message indicating the result of the operation
    """
    action = command.get('media_action')
    media = command.get('media')
    seek_time = command.get('seek_time')
    volume_level = command.get('volume_level')
    
    if not action:
        return "Error: 'media_action' not specified."
    
    # Convert seek_time and volume_level to appropriate types if present
    if seek_time is not None:
        try:
            seek_time = int(seek_time)
        except ValueError:
            return "Error: 'seek_time' must be a valid number."
            
    if volume_level is not None:
        try:
            volume_level = int(volume_level)
            if not 0 <= volume_level <= 100:
                return "Error: 'volume_level' must be between 0 and 100."
        except ValueError:
            return "Error: 'volume_level' must be a valid number."
    
    return control_media_player(
        action=action,
        media=media,
        seek_time=seek_time,
        volume_level=volume_level
    )

# @register_command("script")
# def handle_script_command(command: Dict[str, str]) -> str:
#     script_path = command.get('script_path')
#     args = command.get('args', [])
#     if not script_path:
#         return "Error: 'script_path' not specified."
#     return perform_custom_script(script_path, args)

@register_command("close")
def handle_close_command(command: Dict[str, str]) -> str:
    app = command.get('application')
    if not app:
        return "Error: 'application' not specified in command."
    # Implement logic to close the application
    # For example, use os.system("taskkill /im app.exe /f") on Windows
    try:
        if get_platform() == 'windows':
            os.system(f"taskkill /im {app}.exe /f")
        else:
            os.system(f"pkill {app}")
        return f"Closed '{app}'"
    except Exception as e:
        return f"Error closing '{app}': {str(e)}"
