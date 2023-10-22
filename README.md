## Cooldown Manager for Elgato Stream Deck

**Description**: This plugin helps you manage in-game cooldowns using the Elgato Stream Deck. It consists of a JavaScript plugin for setting up your buttons and a Python WebSocket server for listening to your keybinds.

### Prerequisites:

- Knowledge of your system's file system and directory structures.
- Installed Elgato Stream Deck software.
- Python installed on your computer.

### Installation:

1. **Setting up the JavaScript Plugin**

    a. Navigate to your Stream Deck's plugin directory:

    ```
    ...\AppData\Roaming\Elgato\StreamDeck\Plugins\
    ```

    b. Create a symbolic link from the above directory to the plugin folder in the cloned repository:

    ```
    <cloned repo directory>\src\com.vicplusplus.cooldown.sdPlugin
    ```

    This will make the Stream Deck software recognize the plugin.

2. **Setting up the WebSocket Server**

    a. Navigate to the directory where the `main.py` file is located:

    ```
    ...\src\cdmanager\
    ```

    b. Run the `main.py` script:

    ```
    python main.py
    ```

    This will start the WebSocket server that listens to the keyboard input.

### Usage:

1. Once both the symbolic link has been created and the WebSocket server is running, you can open the Elgato Stream Deck software.

2. Set up your buttons using the provided interface. Ensure you input the cooldown name, length, and whether or not it can be prematurely refreshed. You can also customize the image and text display, though this is outside of the scope of the plugin.

3. The plugin will now listen for the keybinds you've set in the button settings. When the specified key is pressed, the server will communicate with the plugin to reset the timer.

### Troubleshooting:

- Ensure both the symbolic link and the WebSocket server are properly set up.
- Check if Python is running and the `main.py` script doesn't have any errors.
- Ensure your Stream Deck software is up-to-date.

**Note**: It's essential to have both the plugin and server running for the cooldown management to function correctly.

We hope this makes your gaming sessions smoother and more organized!