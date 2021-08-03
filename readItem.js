const {BrowserWindow} = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
    //create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500, height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });
    offscreenWindow.loadURL(url);
    offscreenWindow.webContents.on('did-finish-load', e => {
        // get the title of the web page
        let title = offscreenWindow.getTitle();
        // get a screenshot of that web page (thumbnail)
        offscreenWindow.webContents.capturePage().then( image => {
            // get image as a dataURL
            let screenshot = image.toDataURL();
            // execure callback with new item object
            callback( { title, screenshot, url });

            //clean up
            offscreenWindow.close();
            offscreenWindow = null;
        });
    });
}