# cli.py
import click
from .token import login as do_login
from .websocket_client import start_client
from .config_gui import run_gui

@click.group()
def main():
    pass

@main.command()
def login():
    """Login to shravan and store the token."""
    do_login()

@main.command()
def start():
    """Start listening for commands from the shravan server."""
    start_client()

@main.command()
def config():
    """Open the shravan configuration GUI."""
    run_gui()
