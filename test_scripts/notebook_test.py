import asyncio
import websockets
import json
import aioconsole
import jwt
import os

# Configuration
WS_URL = 'ws://localhost:3000/ws'  # Update with your server URL
JWT_SECRET = 'bylexa'  # Same as your server's JWT_SECRET

class NotebookTestClient:
    def __init__(self, email):
        self.email = email
        self.token = jwt.encode({'email': email}, JWT_SECRET, algorithm='hs256')
        self.current_room = None
        self.cell_counter = 0
        
    async def connect(self):
        headers = {'Authorization': f'Bearer {self.token}'}
        self.ws = await websockets.connect(WS_URL, extra_headers=headers)
        print(f"Connected as {self.email}")
        
    async def join_room(self, room_code):
        await self.ws.send(json.dumps({
            'action': 'join_room',
            'room_code': room_code
        }))
        self.current_room = room_code
        print(f"Joined room: {room_code}")
        
    async def create_notebook_cell(self, code):
        if not self.current_room:
            print("Must join a room first!")
            return
            
        self.cell_counter += 1
        await self.ws.send(json.dumps({
            'action': 'notebook_execute',
            'code': code,
            'cell_id': self.cell_counter,
            'room_code': self.current_room
        }))
        print(f"Created and executed cell {self.cell_counter}")
        
    async def save_notebook(self):
        if not self.current_room:
            print("Must join a room first!")
            return
            
        await self.ws.send(json.dumps({
            'action': 'save_notebook',
            'room_code': self.current_room
        }))
        print("Requested notebook save")
        
    async def listen_for_messages(self):
        while True:
            try:
                message = await self.ws.recv()
                data = json.loads(message)
                
                if data.get('action') == 'notebook_result':
                    print("\n=== Notebook Cell Execution Result ===")
                    print(f"Cell ID: {data.get('cell_id')}")
                    print(f"Executed by: {data.get('executor', 'unknown')}")
                    result = data.get('result', {})
                    if result.get('success'):
                        if result.get('output'):
                            print("\nOutput:")
                            print(result['output'].rstrip())
                        if result.get('errors'):
                            print("\nErrors:")
                            print(result['errors'])
                    else:
                        print("\nExecution Failed:")
                        if result.get('exception'):
                            print(f"Error: {result['exception'].get('type')}: {result['exception'].get('message')}")
                            print(result['exception'].get('traceback'))
                            
                elif data.get('action') == 'notebook_saved':
                    print(f"\nNotebook saved to: {data.get('filename')}")
                    
                else:
                    print(f"\nReceived message: {data}")
                    
            except Exception as e:
                print(f"Error in message handling: {e}")
                break

async def interactive_session():
    print("Welcome to Notebook Test Client")
    email = input("Enter your email: ")
    
    client = NotebookTestClient(email)
    await client.connect()
    
    print("\nAvailable commands:")
    print("1. join <room_code> - Join a room")
    print("2. cell - Create and execute a new notebook cell")
    print("3. save - Save the current notebook")
    print("4. exit - Exit the client")
    
    # Start message listener in background
    listener_task = asyncio.create_task(client.listen_for_messages())
    
    while True:
        try:
            command = await aioconsole.ainput("\nEnter command: ")
            
            if command.startswith('join '):
                room_code = command.split(' ')[1]
                await client.join_room(room_code)
                
            elif command == 'cell':
                print("Enter Python code (type 'end' on a new line when done):")
                code_lines = []
                while True:
                    line = await aioconsole.ainput()
                    if line.strip() == 'end':
                        break
                    code_lines.append(line)
                code = '\n'.join(code_lines)
                await client.create_notebook_cell(code)
                
            elif command == 'save':
                await client.save_notebook()
                
            elif command == 'exit':
                break
                
        except Exception as e:
            print(f"Error: {e}")
    
    listener_task.cancel()
    await client.ws.close()

def main():
    try:
        asyncio.run(interactive_session())
    except KeyboardInterrupt:
        print("\nClient stopped.")

if __name__ == "__main__":
    main()