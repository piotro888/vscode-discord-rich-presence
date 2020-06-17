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
    client.setActivity({
        details: 'idle, no file opened',
        state: 'uwu',
        startTimestamp: startTime,
        largeImageKey: 'vscode_icon',
        largeImageText: 'vscode@linux',
        smallImageKey: 'discord_idle_icon',
        smallImageText: 'Thread.sleep(2000);',
        instance: false,
    }).catch((err)=>errorHandler(1));
}

function updateData(filename, startTime, currline, maxline, lang){
    console.log(`${lang}_icon`);
    if(typeof lang !== "undefined")
        client.setActivity({
            details: `File: ${filename}`,
            state: `@ line ${currline} of ${maxline}`,
            startTimestamp: startTime,
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
            startTimestamp: startTime,
            largeImageKey: `vscode_icon`,
            largeImageText: `vscode@linux`,
            smallImageKey: 'undefined_icon',
            smallImageText: 'unknown language',
            instance: false,
        }).catch((err)=>errorHandler(1));
}

function updateDebug(filename, startTime, currline, maxline, lang){
    if(typeof lang !== "undefined")
        client.setActivity({
            details: `Debugging file: ${filename}`,
            state: `Observing line ${currline} of ${maxline}`,
            startTimestamp: startTime,
            smallImageKey: `${lang}_icon`,
            smallImageText: `${lang}@vscode@linux`,
            largeImageKey: 'debug_icon',
            largeImageText: 'dddddeebug',
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
            largeImageText: 'dddddeebug',
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