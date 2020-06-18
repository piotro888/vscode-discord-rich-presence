/*
    (C) Copyright 2020 Piotr Węgrzyn

    This file is part of Discord Rich Presence extension fo VSCode.

    Discord Rich Presence extension fo VSCode is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Discord Rich Presence extension fo VSCode is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Discord Rich Presence extension fo VSCode.  If not, see <https://www.gnu.org/licenses/>.
*/

const vscode = require('vscode'); //vscode api
const rpcmgr = require('./rpcmgr');
const jsonext = require('./data/extensions.json');

let interval;
let startTime;
let extensionMap = new Map();

function init(force){
    console.log("Initializing extension");
    if(vscode.workspace.getConfiguration('discord').enabled == true || force == true){
        startTime = new Date();
        rpcmgr.init();
        interval = setInterval(updatePresence, 2000);

        extensionArray = Array.from(jsonext);
        
        readJSON();
    }
}

function init_commands(){
    vscode.commands.registerCommand('discord.disconnect', () => {
        deactivate();
        rpcmgr.disconnect();
        vscode.window.showInformationMessage('Discord is DISCONNECTED');
    });

    vscode.commands.registerCommand('discord.connect', () => {
        deactivate();
        rpcmgr.disconnect();
        rpcmgr.init();
        interval = setInterval(updatePresence, 2000);
        if(vscode.workspace.getConfiguration('discord').enabled == false)
            vscode.window.showErrorMessage("Discord Rich presence is disabled in settings. Enable on settings or run discord.enable command");
    });

    vscode.commands.registerCommand('discord.reset', () => {
        deactivate();
        rpcmgr.disconnect();
        init();
    });

    vscode.commands.registerCommand('discord.enable', () => {
        vscode.workspace.getConfiguration('discord').update('enabled', true);
        deactivate();
        rpcmgr.disconnect();
        init(true);
        vscode.window.showInformationMessage('Exstension is ENABLED');
    });

    vscode.commands.registerCommand('discord.disable', () => {
        vscode.workspace.getConfiguration('discord').update('enabled', false);
        deactivate();
        rpcmgr.disconnect();
        vscode.window.showInformationMessage('Exstension is DISABLED');
    });

    vscode.commands.registerCommand('discord.timerreset', () => {
        startTime = new Date();
        vscode.window.showInformationMessage('Elapsed time cleared');
    });

    vscode.commands.registerCommand('discord.timerenable', () => {
        vscode.workspace.getConfiguration('discord').update('showTimer', true);
        vscode.window.showInformationMessage('Elapsed time field enabled');
    });

    vscode.commands.registerCommand('discord.timerdisable', () => {
        vscode.workspace.getConfiguration('discord').update('showTimer', false);
        vscode.window.showInformationMessage('Elapsed time field disabled');
    });
}

function readJSON(){
    console.log("converting JSON");
    console.log(jsonext);

    for(let i=0; i<jsonext.extensions.length; i++){
        extensionMap.set(`${jsonext.extensions[i].ext}`, `${jsonext.extensions[i].lang}`);
    }
}

function activate(context){
    console.log("Piotro-Discord-RPC Extension activated");
    init();
    init_commands();
}

function deactivate(){
    console.log("Deinitializing interval");
    clearInterval(interval);
}

module.exports = {
    activate,
    deactivate
}

function updatePresence(){
    if(rpcmgr.isErrored() == true){
        if(rpcmgr.shouldDeactivate()) deactivate();  // deactivate only if error window closed - no retry.
        return;
    }

    if(vscode.workspace.getConfiguration('discord').enabled == false){
        deactivate();
        rpcmgr.disconnect();
        return;
    }

    if(rpcmgr.isFirstConn()){
        vscode.window.showInformationMessage('Discord is CONNECTED');
        rpcmgr.resetFirstConn();
    }

    console.log("updating presence data");
    
    if(typeof vscode.window.activeTextEditor !== "undefined"){
        let filepath = vscode.window.activeTextEditor.document.fileName;
        let totlines = vscode.window.activeTextEditor.document.lineCount;
        let currline = vscode.window.activeTextEditor.selection.start.line+1;
        
        filepath = "\/" + filepath;
        const matches = filepath.split("/");
        let filename = matches[matches.length - 1];
        splitarr = filename.split(".")
        let ext = splitarr[splitarr.length - 1];

        let lang = extensionMap.get(ext);

        if(typeof vscode.debug.activeDebugSession !== "undefined"){
            rpcmgr.updateDebug(filename, startTime, currline, totlines, lang);
        } else {
            rpcmgr.updateData(filename, startTime, currline, totlines, lang);
        }

    } else {
        rpcmgr.updateIdle(startTime);
    }
}