const { Menu, shell}  = require('electron');
module.exports = appWin => {
    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'Ctrl+N',
                    click: () => {
                        appWin.send('menu-show-modal');
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'Ctrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item');
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'Ctrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item');
                    }
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'Ctrl+Shift+Enter',
                    click: () => 
                    {
                        appWin.send('menu-open-item-native');
                    }
                },
                {
                    label: 'Search',
                    accelerator: 'Ctrl+S',
                    click: () => {
                        appWin.send('menu-focus-search');
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'Help',
            submenu: [
                {
                    label: 'Learn more',
                    click: () => {
                        shell.openExternal('https://github.com/stackacademytv/master-electron');
                    }
                }
            ]
        }
    ];
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};