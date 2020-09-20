const {app, BrowserWindow} = require('electron');
const ejse = require('ejs-electron');

ejse.data({
    rows : 1000,
    cols : 27
});

app.whenReady().then(function(){
    const win = new BrowserWindow({
        width : 800,
        height : 600,
        show : false
    });
    win.loadFile('index.ejs').then(function(){
        win.maximize();
        win.show();
    });
});

// npm init
// npm install electron -g
// npm install --save-dev ejs-electron