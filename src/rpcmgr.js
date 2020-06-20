/*
    (C) Copyright 2020 by Piotr Węgrzyn

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

const rpc = require('discord-rpc');
const vscode = require('vscode');
const os = require('os');

const CLIENT_ID = '722326832459939912';

let client;

// Flags for main
let errored = false;
let first_conn = true;
let shouldDeactivateState = false;
let os_name;

function init(){
    console.log("Initializing rpc client");
    client = new rpc.Client({transport:"ipc"});
    client.login({clientId: CLIENT_ID}).catch((err)=>{errorHandler(0); return;});
    errored = false;

    os_name = os.platform();
    console.log(os_name);
    if(os_name === "win32") os_name = "windows";
    else if (os_name === "darwin") os_name = "mac";
    //in different cases os name is correct
}

function generatePresence(presenceData = {}){
    let presence = {};
    let {isIdle, isDebug, currLine, maxLine, filename, startTime, lang} = presenceData;

    if(isIdle) presence.details = 'idle, no file opened';
    else if(isDebug) presence.details = `Debugging file: ${filename}`;
    else presence.details = `File: ${filename}`;

    let idleStateText = vscode.workspace.getConfiguration('discord').idleSmallText;
    if(isIdle) presence.state = idleStateText;
    else if(isDebug) presence.state = `Observing line ${currLine} of ${maxLine}`;
    else presence.state = `@ line ${currLine} of ${maxLine}`;

    let startTimestamp = (vscode.workspace.getConfiguration('discord').showTimer ? startTime : null);
    presence.startTimestamp = startTimestamp;

    if(isIdle) presence.largeImageKey = 'vscode_icon';
    else if(isDebug) presence.largeImageKey = 'debug_icon';
    else if(typeof lang === "undefined") presence.largeImageKey = 'vscode_icon';
    else presence.largeImageKey = `${lang}_icon`;

    let debugImageText = vscode.workspace.getConfiguration('discord').debugImageText;
    if(isIdle) presence.largeImageText = `vscode@${os_name}`;
    else if(isDebug) presence.largeImageText = debugImageText;
    else if(typeof lang === `undefined`) presence.largeImageText = `vscode@${os_name}`;
    else presence.largeImageText = `just ${lang}`;

    if(isIdle) presence.smallImageKey = 'discord_idle_icon';
    else if(typeof lang == "undefined") presence.smallImageKey = 'undefined_icon';
    else if(isDebug) presence.smallImageKey = `${lang}_icon`;
    else presence.smallImageKey = `vscode_icon`;

    let idleImageText = vscode.workspace.getConfiguration('discord').idleImageText;
    if(isIdle) presence.smallImageText= idleImageText;
    else if(typeof lang == "undefined" && isDebug) presence.smallImageText = `unknown_lang@vscode@${os_name}`;
    else if(typeof lang == "undefined") presence.smallImageText = `unknown_lang`;
    else if(isDebug) presence.smallImageText = `${lang}@vscode@${os_name}`;
    else presence.smallImageText = `vscode@${os_name}`;

    presence.instance = false;

    return presence;
}

function updatePresence(presence){
    client.setActivity(presence).catch(() => errorHandler(1));
}

function isErrored(){
    return errored;
}

function errorHandler(msg){
    errored = true;
    console.error("Error: Could not connect to discord");
    if(msg == 0) vscode.window.showErrorMessage('Could not connect to discord', 'OK', 'Retry').then((res)=>retryHandler(res));
    if(msg == 1) vscode.window.showErrorMessage('Disconnected from discord', 'OK', 'Retry').then();
}

function retryHandler(res){
    if(res == "Retry"){
        disconnect();
        init();
    } else {
        shouldDeactivateState = true;
    }
}

function disconnect(){
    console.log("Disconnecting from discord");
    if(client) client.destroy().catch((err)=>{});
    first_conn = true;
    errored = false;
}

function shouldDeactivate(){
    return shouldDeactivateState;
}

function isFirstConn(){
    return first_conn;
}

function resetFirstConn(){
    first_conn = false;
}

module.exports = {
    init,
    generatePresence,
    updatePresence,
    isErrored,
    shouldDeactivate,
    isFirstConn,
    resetFirstConn,
    disconnect
}