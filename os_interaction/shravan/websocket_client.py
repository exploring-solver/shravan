import asyncio
import websockets
import json
import io
import sys
import contextlib
import traceback
from .commands import perform_action
from .config import load_email, load_token
import aioconsole

# WEBSOCKET_SERVER_URL = 'ws://localhost:3000/ws'
WEBSOCKET_SERVER_URL = 'wss://shravan.onrender.com/ws'

class CodeExecutor:
    def __init__(self):
        self.globals = {}
        self.locals = {}
    
    def execute_code(self, code):
        """
        Execute Python code in a controlled environment and return the output.
        """
        # Create string buffer to capture output
        output_buffer = io.StringIO()
        error_buffer = io.StringIO()
        
        try:
            # Redirect stdout and stderr
            with contextlib.redirect_stdout(output_buffer):
                with contextlib.redirect_stderr(error_buffer):
                    # Execute the code
                    exec(code, self.globals, self.locals)
            
            # Get the output
            output = output_buffer.getvalue()
            errors = error_buffer.getvalue()
            
            return {
                'success': True,
                'output': output,
                'errors': errors,
                'exception': None
            }
            
        except Exception as e:
            return {
                'success': False,
                'output': output_buffer.getvalue(),
                'errors': error_buffer.getvalue(),
                'exception': {
                    'type': type(e).__name__,
                    'message': str(e),
                    'traceback': traceback.format_exc()
                }
            }
        finally:
            output_buffer.close()
            error_buffer.close()

async def listen(token, room_code=None):
    headers = {'Authorization': f'Bearer {token}'}
    email = load_email()
    code_executor = CodeExecutor()
    
    while True:
        try:
            print(f"Connecting to server at {WEBSOCKET_SERVER_URL}...")
            async with websockets.connect(WEBSOCKET_SERVER_URL, extra_headers=headers) as websocket:
                print(f"Connected to {WEBSOCKET_SERVER_URL} as {email}")
                
                if room_code:
                    await websocket.send(json.dumps({'action': 'join_room', 'room_code': room_code}))
                    print(f"Joined room: {room_code}")

                input_task = asyncio.create_task(handle_user_input(websocket, room_code))
                receive_task = asyncio.create_task(handle_server_messages(websocket, code_executor))

                done, pending = await asyncio.wait(
                    [input_task, receive_task],
                    return_when=asyncio.FIRST_COMPLETED
                )

                for task in pending:
                    task.cancel()
                    try:
                        await task
                    except asyncio.CancelledError:
                        pass

                for task in done:
                    try:
                        await task
                    except Exception as e:
                        print(f"Task error: {e}")
                        raise

        except websockets.exceptions.ConnectionClosed:
            print("Connection closed. Attempting to reconnect...")
            await asyncio.sleep(5)
        except Exception as e:
            print(f"An error occurred: {e}. Retrying in 5 seconds...")
            await asyncio.sleep(5)

async def handle_server_messages(websocket, code_executor):
    while True:
        try:
            message = await websocket.recv()
            command = json.loads(message)
            print(f"\nReceived: {command}")
            
            if command.get('action') == 'python_execute':
                # Execute the code and get the result
                result = code_executor.execute_code(command['code'])
                
                # Send response back
                response = {
                    'action': 'python_output',
                    'result': result,
                    'original_sender': command.get('sender'),
                    'code': command['code']
                }
                
                await websocket.send(json.dumps(response))
                print(f"Sent execution result: {result}")
                
            elif command.get('action') == 'python_result':
                # Handle received Python execution results
                result = command['result']
                
                # Print execution details in a formatted way
                print("\n=== Python Execution Result ===")
                print(f"Status: {'Success' if result['success'] else 'Failed'}")
                if result['output']:
                    print("\nOutput:")
                    print(result['output'].rstrip())
                if result['errors']:
                    print("\nErrors:")
                    print(result['errors'])
                if result['exception']:
                    print("\nException:")
                    print(result['exception'])
                print(f"\nExecuted by: {command['executor']}")
                print("============================\n")
                
            elif 'command' in command:
                result = perform_action(command['command'])
                await websocket.send(json.dumps({'result': result}))
                print(f"Sent result: {result}")
                
            elif 'message' in command:
                print(f"Message from server: {command['message']}")
                
            else:
                print(f"Unhandled message type: {command.get('action', 'unknown')}")
                print(f"Message content: {command}")
                
        except asyncio.CancelledError:
            raise
        except Exception as e:
            print(f"Error handling server message: {e}")
            raise

async def handle_user_input(websocket, room_code):
    while True:
        try:
            print("\nPress Enter to send a message (or Ctrl+C to quit)")
            await aioconsole.ainput()
            
            action_type = await aioconsole.ainput("Enter action type (e.g., 'broadcast', 'show_notification', 'python_execute'): ")
            
            if action_type.lower() == 'python_execute':
                code = await aioconsole.ainput("Enter the Python code to execute: ")
                action_data = {
                    "action": "python_execute",
                    "code": code,
                    "room_code": room_code
                }
            elif action_type.lower() == 'broadcast' and room_code:
                message = await aioconsole.ainput("Enter the message you want to send: ")
                action_data = {
                    "action": "broadcast",
                    "room_code": room_code,
                    "command": message
                }
            else:
                message = await aioconsole.ainput("Enter the message you want to send: ")
                action_data = {
                    "action": action_type,
                    "message": message
                }

            await websocket.send(json.dumps(action_data))
            print(f"Sent: {action_data}")
            
        except asyncio.CancelledError:
            raise
        except Exception as e:
            print(f"Error sending message: {e}")

async def main():
    token = load_token() 
    if not token:
        print("No token found. Please run 'shravan login' to authenticate.")
        return

    print("Press Ctrl+C to quit")
    print("Enter room code (or press Enter to skip):")
    room_code = await aioconsole.ainput()
    room_code = room_code.strip() if room_code else None

    await listen(token, room_code)

def start_client():
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nClient stopped.")

if __name__ == "__main__":
    start_client()