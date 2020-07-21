# Discord Rich Presence extension for VSCode

<p align="center">
  <img alt="GitHub release" src="https://img.shields.io/github/v/release/piotro888/vscode-discord-rich-presence">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/piotro888/vscode-discord-rich-presence/dev?color=blue">
  <img alt="GitHub commits since latest release (by date)" src="https://img.shields.io/github/commits-since/piotro888/vscode-discord-rich-presence/latest/dev?label=commits%40dev%20since%20%20latest%20release">
  <img alt="GitHub issues" src="https://img.shields.io/github/issues/piotro888/vscode-discord-rich-presence">
  <img alt="GitHub closed issues" src="https://img.shields.io/github/issues-closed/piotro888/vscode-discord-rich-presence?color=green">
</p>

Discord Rich Presence extension for VSCode by Piotro

## Description

Shows what you're editing in VSCode with advanced Dicord Rich Presence.

## Features
* Shows currenty edited file name
* Shows total number of lines in file and current edited line
* Shows programming time
* Debug mode detection
* Idle display when you have no editor opened
* Detects file extension and shows language icon (see extensions.json for supported extensions)
* Option to disable in configuarions (you can disable it for specified workspaces or globally)
* Easy to use VSCode commands

## Download
### Notice: It won't work if you have discord or vscode installed from snap
Check `snap list` to see if you don't have them installed from snap store. On linux both vscode and discord need to be installed from ex. `.deb`, source or similar to work with this extension

### Instalation:
* Add Visual Studio Code as game in Discord

    Open VSCode, go to Discord -> User Settings -> Game Activity -> Not seeing your game? Add it! and select Visual Studio Code from list 
 
 * Download and install extenstion
 
    VSCode marketplace: Exstension will be avalible VSCode marketplace soon
     
     **Offline installation:**
     Download latest `.vsix` release from https://github.com/piotro888/vscode-discord-rich-presence/releases and install it in VSCode from Extensions (left side menu) > ... > Install from VSIX
* Restart Visual Studio Code

## Contributing, bug reports and feature requests
See CONTRIBUTING.md

## Commands
* `discord.enable` - Enable exstension in workspace (updates workspace settings)
* `discord.disable` - Disable exstension in workspace (updates workspace settings)
* `discord.connect` - Connect to Discord and show Rich Presence
* `discord.disconnect` - Disconnect from Discord
* `discord.reset` - Reset Discord connection
* `discord.timerreset` - Reset timer/elapsed time
* `discord.timerenable` - Enable timer/elapsed time field (updates workspace settings)
* `discord.timerdisable` - Disable timer/elapsed time field (updates workspace settings)

## Building
Clone repository and use `npm install`. Debugging and start already configured for VSCode in `launch.json`. Open in VSCode workspace and run configuration `Run Extension`.

## Upcoming features
* Support for more extensions
* More customization :)

## Images
![example image](https://github.com/piotro888/vscode-discord-rich-presence/blob/master/images/example.png?raw=true)

## License
License: GPL v3
