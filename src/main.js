const vscode = require('vscode'); //vscode api
const rpcmgr = require('./rpcmgr');
const jsonext = require('./data/extensions.json')

let interval;
let startTime;
let extensionMap = new Map();

function init(){
    console.log("Initializing extension");
    if(vscode.workspace.getConfiguration('discord').enabled == true){
        startTime = new Date();
        rpcmgr.init(this);
        interval = setInterval(updatePresence, 2000);

        console.log(`Start time: ${startTime}`);
        extensionArray = Array.from(jsonext);
        
        readJSON();
    }
}

function init_commands(){
    vscode.commands.registerCommand('discord.disconnect', () => {
        deactivate();
        rpcmgr.disconnect();
    });

    vscode.commands.registerCommand('discord.connect', () => {
        deactivate();
        rpcmgr.disconnect();
        rpcmgr.init();
        interval = setInterval(updatePresence, 2000);
    });

    vscode.commands.registerCommand('discord.reset', () => {
        deactivate();
        rpcmgr.disconnect();
        init();
    });

    vscode.commands.registerCommand('discord.enableworkspace', () => {
        vscode.workspace.getConfiguration('discord').update('enabled', true);
        deactivate();
        rpcmgr.disconnect();
        init();
    });

    vscode.commands.registerCommand('discord.disableworkspace', () => {
        vscode.workspace.getConfiguration('discord').update('enabled', false);
        deactivate();
        rpcmgr.disconnect();

    });
}

function readJSON(){
    console.log("converting JSON");

    console.log(jsonext);

    for(let i=0; i<jsonext.extensions.length; i++){
        extensionMap.set(`${jsonext.extensions[i].ext}`, `${jsonext.extensions[i].lang}`);
    }

    console.log(extensionMap);
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
    console.log(rpcmgr.isErrored());
    if(rpcmgr.isErrored() == true){
        if(rpcmgr.shouldDeactivate()) deactivate();  // deactivate only if error window closed - no retry.
        return;
    }

    if(vscode.workspace.getConfiguration('discord').enabled == false){
        deactivate();
        rpcmgr.disconnect();
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