Of course! Here's your README updated with those suggestions:

---

# Cooldown Manager for Elgato Stream Deck

**Description**: Manage in-game cooldowns using the Elgato Stream Deck with a combination of a JavaScript plugin for button setup and a Python WebSocket server for keybind listening.

### Prerequisites:

- Basic familiarity with terminal or command prompt.
- Installed Elgato Stream Deck software.
- Python installed on your system.
- Git installed on your system.

## Quick Installation (Windows):

1. Clone this repository:
   ```bash
   git clone https://github.com/vicplusplus/cooldown-manager-sdPlugin.git
   ```

2. Navigate to the repository folder and run the `install.bat` script to automate the installation process.

3. Go to `src/cdmanager` and:
   - Run `start_server.bat` to start the WebSocket server in the background (it won't show any window).
   - Use `run_server.bat` if you wish to see the server operations in a command prompt window.

## Manual Installation:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/vicplusplus/cooldown-manager-sdPlugin.git
   ```

2. **Download and Set Up the StreamDeck JavaScript SDK**:
   Clone the `streamdeck-javascript-sdk` into the `libs` directory:
   ```bash
   git clone https://github.com/elgatosf/streamdeck-javascript-sdk.git cooldown-manager-sdPlugin\src\com.vicplusplus.cooldown.sdPlugin\libs
   ```

3. **Setting up the JavaScript Plugin**:
   Create a symbolic link in the Stream Deck's plugin directory that points to the plugin folder in the cloned repository:

   - **For Windows** (using Command Prompt as administrator):
     ```bash
     mklink /D "%APPDATA%\Elgato\StreamDeck\Plugins\com.vicplusplus.cooldown.sdPlugin" "<path to cloned repo>\cooldown-manager-sdPlugin\src\com.vicplusplus.cooldown.sdPlugin"
     ```

   - **For macOS and Linux**:
     ```bash
     ln -s <path to cloned repo>/cooldown-manager-sdPlugin/src/com.vicplusplus.cooldown.sdPlugin ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/com.vicplusplus.cooldown.sdPlugin.sdPlugin
     ```

4. **Setting up the WebSocket Server**:

   a. Navigate to the directory containing `main.py` inside the cloned repository: `<path to cloned repo>/cooldown-manager-sdPlugin/src/cdmanager/`

   b. Install required Python packages:
   ```bash
   python -m pip install keyboard websockets
   ```

   c. Start the server:
   ```bash
   python main.py
   ```
   Once the server is running, you should see a message indicating it's listening for connections.

## Usage:

1. With the symlink established in the Stream Deck's plugin directory and the WebSocket server running, open the Elgato Stream Deck software.

2. Set up your buttons: Input cooldown name, length, and potential premature refresh details. Image and text customization is outside this plugin's scope.

3. The plugin now listens for keybinds you've set. When pressed, the server communicates with the plugin to potentially reset the timer.

4. For available keys and their names, check this file: [Keyboard Canonical Names](https://github.com/boppreh/keyboard/blob/master/keyboard/_canonical_names.py)

## Troubleshooting:

- Ensure symbolic link creation in the Stream Deck directory and WebSocket server setup were successful.
- Ensure Python and the `main.py` script are running without issues.
- Confirm your Stream Deck software version is current.
- If keystrokes don't trigger events on the Stream Deck, try running the server as an administrator. On Windows, some applications may consume input, and running the server with elevated privileges can resolve this.

**Note**: Both the plugin and server must be active for correct cooldown management.

We wish you smooth and organized gaming sessions!