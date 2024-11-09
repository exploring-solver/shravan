import os
import sys
import time

try:
    import win32api
    import win32con
    from ctypes import cast, POINTER
    from comtypes import CLSCTX_ALL
    from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
except ImportError:
    print("Please install the required libraries by running:")
    print("pip install pywin32 comtypes pycaw")
    sys.exit(1)


def set_volume(level: int):
    """Set the system volume level."""
    devices = AudioUtilities.GetSpeakers()
    interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
    volume = cast(interface, POINTER(IAudioEndpointVolume))
    scalar_volume = max(0.0, min(1.0, level / 100.0))
    volume.SetMasterVolumeLevelScalar(scalar_volume, None)
    print(f"Volume set to {level}%")


def media_control(action: int):
    """Control media actions based on the action selected."""
    VK_MEDIA_PLAY_PAUSE = 0xB3
    VK_MEDIA_NEXT_TRACK = 0xB0
    VK_MEDIA_PREV_TRACK = 0xB1
    VK_VOLUME_UP = 0xAF
    VK_VOLUME_DOWN = 0xAE
    VK_VOLUME_MUTE = 0xAD

    if action == 1:  # Play/Pause
        print("Toggling play/pause...")
        win32api.keybd_event(VK_MEDIA_PLAY_PAUSE, 0, 0, 0)
    elif action == 2:  # Next Track
        print("Playing next track...")
        win32api.keybd_event(VK_MEDIA_NEXT_TRACK, 0, 0, 0)
    elif action == 3:  # Previous Track
        print("Playing previous track...")
        win32api.keybd_event(VK_MEDIA_PREV_TRACK, 0, 0, 0)
    elif action == 4:  # Volume Up
        print("Increasing volume...")
        win32api.keybd_event(VK_VOLUME_UP, 0, 0, 0)
    elif action == 5:  # Volume Down
        print("Decreasing volume...")
        win32api.keybd_event(VK_VOLUME_DOWN, 0, 0, 0)
    elif action == 6:  # Set Volume
        try:
            level = int(input("Enter volume level (0-100): "))
            if 0 <= level <= 100:
                set_volume(level)
            else:
                print("Please enter a valid volume level between 0 and 100.")
        except ValueError:
            print("Invalid input. Please enter a number between 0 and 100.")
    elif action == 7:  # Mute
        print("Toggling mute...")
        win32api.keybd_event(VK_VOLUME_MUTE, 0, 0, 0)
    else:
        print("Invalid option.")


def main():
    while True:
        print("\nMedia Control Menu:")
        print("1. Play/Pause")
        print("2. Next Track")
        print("3. Previous Track")
        print("4. Volume Up")
        print("5. Volume Down")
        print("6. Set Volume")
        print("7. Mute/Unmute")
        print("0. Exit")

        try:
            choice = int(input("Enter your choice: "))
            if choice == 0:
                print("Exiting...")
                break
            media_control(choice)
        except ValueError:
            print("Invalid input. Please enter a number.")

if __name__ == "__main__":
    if sys.platform == "win32":
        main()
    else:
        print("This script only works on Windows.")
