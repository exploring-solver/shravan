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
import nbformat
from nbformat.v4 import new_notebook, new_code_cell
from datetime import datetime
import os

# WEBSOCKET_SERVER_URL = 'ws://localhost:3000/ws'
WEBSOCKET_SERVER_URL = 'wss://bylexa.onrender.com/ws'

class NotebookManager:
    def __init__(self):
        self.current_notebook = new_notebook()
        self.execution_count = 0
        
    def create_cell(self, code):
        """Create a new code cell and add it to the notebook"""
        cell = new_code_cell(code)
        cell.execution_count = self.execution_count
        self.current_notebook.cells.append(cell)
        self.execution_count += 1
        return len(self.current_notebook.cells) - 1
        
    def update_cell_output(self, cell_id, output):
        """Update the output of a cell"""
        if 0 <= cell_id < len(self.current_notebook.cells):
            cell = self.current_notebook.cells[cell_id]
            if output.get('success'):
                # Add stdout output
                if output.get('output'):
                    cell.outputs = [{
                        'output_type': 'stream',
                        'name': 'stdout',
                        'text': output['output']
                    }]
                # Add error output if any
                if output.get('errors'):
                    cell.outputs.append({
                        'output_type': 'stream',
                        'name': 'stderr',
                        'text': output['errors']
                    })
            else:
                # Handle error output
                cell.outputs = [{
                    'output_type': 'error',
                    'ename': output.get('exception', {}).get('type', 'Error'),
                    'evalue': output.get('exception', {}).get('message', 'Unknown error'),
                    'traceback': [output.get('exception', {}).get('traceback', '')]
                }]
    
    def save_notebook(self, filename=None):
        """Save the current notebook to a file"""
        if filename is None:
            os.makedirs('notebooks', exist_ok=True)
            filename = f'notebooks/notebook_{datetime.now().strftime("%Y%m%d_%H%M%S")}.ipynb'
        
        with open(filename, 'w', encoding='utf-8') as f:
            nbformat.write(self.current_notebook, f)
        return filename

class CodeExecutor:
    def __init__(self):
        self.globals = {}
        self.locals = {}
    
    def execute_code(self, code):
        """
        Execute Python code in a controlled environment and return the output.
        """
        output_buffer = io.StringIO()
        error_buffer = io.StringIO()
        
        try:
            with contextlib.redirect_stdout(output_buffer):
                with contextlib.redirect_stderr(error_buffer):
                    exec(code, self.globals, self.locals)
            
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

class EnhancedCodeExecutor(CodeExecutor):
    def __init__(self):
        super().__init__()
        self.notebook_manager = NotebookManager()
        
    def execute_notebook_cell(self, code):
        """Execute code and return results in a notebook-friendly format"""
        result = self.execute_code(code)
        return result

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
                
            elif command.get('action') == 'notebook_execute':
                # Create new cell and execute code
                cell_id = code_executor.notebook_manager.create_cell(command['code'])
                result = code_executor.execute_notebook_cell(command['code'])
                
                # Update cell with results
                code_executor.notebook_manager.update_cell_output(cell_id, result)
                
                # Send response back
                response = {
                    'action': 'notebook_result',
                    'cell_id': cell_id,
                    'result': result,
                    'original_sender': command.get('sender'),
                    'code': command['code']
                }
                
                await websocket.send(json.dumps(response))
                print(f"Sent notebook execution result: {result}")
                
            elif command.get('action') == 'save_notebook':
                filename = code_executor.notebook_manager.save_notebook()
                response = {
                    'action': 'notebook_saved',
                    'filename': filename,
                    'original_sender': command.get('sender')
                }
                await websocket.send(json.dumps(response))
                
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
            
            action_type = await aioconsole.ainput("Enter action type (e.g., 'broadcast', 'show_notification', 'python_execute', 'notebook_execute', 'save_notebook'): ")
            
            if action_type.lower() in ['python_execute', 'notebook_execute']:
                code = await aioconsole.ainput("Enter the Python code to execute: ")
                action_data = {
                    "action": action_type.lower(),
                    "code": code,
                    "room_code": room_code
                }
            elif action_type.lower() == 'save_notebook':
                action_data = {
                    "action": "save_notebook",
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

async def listen(token, room_code=None):
    headers = {'Authorization': f'Bearer {token}'}
    email = load_email()
    code_executor = EnhancedCodeExecutor()
    
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