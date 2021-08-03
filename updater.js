const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

// enable logging with electron-log
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

//single export to check for and apply any available updates


//disable auto downloads
autoUpdater.autoDownload = false;

module.exports = () => {
    autoUpdater.checkForUpdates();
    autoUpdater.on('update-available', () => {
        //prompt the user to download
        dialog.showMessageBox(
            {
                type: 'info',
                title: 'Update available',
                message: 'A new version is available. Do you want to update now?',
                buttons: ['Update', 'No']
            }
        ).then( result => {
            let buttonIndex = result.response;
            if (buttonIndex === 0) { 
                autoUpdater.downloadUpdate();
            }
        });
    });
    // when download finished
    autoUpdater.on('update-downloaded', () =>
    {
        dialog.showMessageBox({
            type: 'info',
            title: 'Update ready',
            message: 'Install & restart now?',
            buttons: ['Yes', 'Later']
        }).then( result => {
            let buttonIndex = result.response;

            if (buttonIndex === 0) autoUpdater.quitAndInstall(false, true);
        });
    });
}