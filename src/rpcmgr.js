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

const CLIENT_ID = '722326832459939912';

let client;

// Flags for main
let errored = false;
let first_conn = true;
let shouldDeactivateState = false;

function init(){
    console.log("Initializing rpc client");
    client = new rpc.Client({transport:"ipc"});
    client.login({clientId: CLIENT_ID}).catch((err)=>{errorHandler(0); return;});
    errored = false;
}

function updateIdle(startTime){
    //config should be named in that way because of vscode config name display (displays space before capital letter)
    let idle_state_text = vscode.workspace.getConfiguration('discord').idleSmallText;
    let idle_image_text = vscode.workspace.getConfiguration('discord').idleImageText;
    let startTimestamp = (vscode.workspace.getConfiguration('discord').showTimer ? startTime : null);
    client.setActivity({
        details: 'idle, no file opened',
        state: idle_state_text,
        startTimestamp: startTimestamp,
        largeImageKey: 'vscode_icon',
        largeImageText: 'vscode@linux',
        smallImageKey: 'discord_idle_icon',
        smallImageText: idle_image_text,
        instance: false,
    }).catch((err)=>errorHandler(1));
}

function updateData(filename, startTime, currline, maxline, lang){
    console.log(`${lang}_icon`);
    let startTimestamp = (vscode.workspace.getConfiguration('discord').showTimer ? startTime : null);
    if(typeof lang !== "undefined")
        client.setActivity({
            details: `File: ${filename}`,
            state: `@ line ${currline} of ${maxline}`,
            startTimestamp: startTimestamp,
            largeImageKey: `${lang}_icon`,
            largeImageText: `just ${lang}`,
            smallImageKey: 'vscode_icon',
            smallImageText: 'vscode@linux',
            instance: false,
        }).catch((err)=>errorHandler(1));
    else
        client.setActivity({
            details: `file: ${filename}`,
            state: `@ line ${currline} of ${maxline}`,
            startTimestamp: startTimestamp,
            largeImageKey: `vscode_icon`,
            largeImageText: `vscode@linux`,
            smallImageKey: 'undefined_icon',
            smallImageText: 'unknown language',
            instance: false,
        }).catch((err)=>errorHandler(1));
}

function updateDebug(filename, startTime, currline, maxline, lang){
    let debug_image_text = vscode.workspace.getConfiguration('discord').debugImageText;
    if(typeof lang !== "undefined")
        client.setActivity({
            details: `Debugging file: ${filename}`,
            state: `Observing line ${currline} of ${maxline}`,
            startTimestamp: startTime,
            smallImageKey: `${lang}_icon`,
            smallImageText: `${lang}@vscode@linux`,
            largeImageKey: 'debug_icon',
            largeImageText: debug_image_text,
            instance: false,
        }).catch((err)=>errorHandler(1));
    else
        client.setActivity({
            details: `Debugging file: ${filename}`,
            state: `staring @ line ${currline} of ${maxline}`,
            startTimestamp: startTime,
            smallImageKey: `undefined_icon`,
            smallImageText: `unknown_lang@vscode@linux`,
            largeImageKey: 'debug_icon',
            largeImageText: debug_image_text,
            instance: false,
        }).catch((err)=>errorHandler(1));
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
    updateIdle,
    updateData,
    updateDebug,
    isErrored,
    shouldDeactivate,
    isFirstConn,
    resetFirstConn,
    disconnect
}