import sys
import json
from .commands import perform_action

def main(command_input):
    """Main function to handle incoming commands."""
    try:
        if isinstance(command_input, str):
            command = json.loads(command_input)
        elif isinstance(command_input, dict):
            command = command_input
        else:
            raise ValueError("Invalid command input type")

        result = perform_action(command)
        return result
    except json.JSONDecodeError:
        return "Error: Invalid JSON input"
    except KeyError as e:
        return f"Error: Missing key in command: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        result = main(sys.argv[1])
        print(result)
    else:
        print("Error: No command provided")
