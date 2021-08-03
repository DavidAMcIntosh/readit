const { shell } = require("electron");
const fs = require("fs");

// DOM nodes
let items = document.getElementById('items');

// get readerJS content
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString();
});

window.addEventListener('message', e => {
    //delete item at given index
    if (e.data.action === 'delete-reader-item') {
        this.delete(e.data.itemIndex);
        e.source.close();
    }
});

exports.delete = itemIndex => {
    items.removeChild( items.childNodes[itemIndex] );

    // remove from storage
    this.storage.splice(itemIndex, 1);
    //persist storage
    this.save();
    if (this.storage.length) {
        let = newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex-1;
        document.getElementsByClassName('read-items')[newSelectedItemIndex].classList.add('selected');
    }
}

exports.getSelectedItem = () => {
    let currentItem = document.getElementsByClassName('read-item selected')[0];

    let itemIndex = 0;
    let child = currentItem;
    while ((child = child.previousElementSibling) != null) itemIndex++;

    return { node: currentItem, index: itemIndex }
}

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];
exports.save = () => {
    localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

//set item as selected
exports.select = e => {
    // remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected');
    // add to clicked item
    e.currentTarget.classList.add('selected');
}
// add new item
exports.addItem = (item, isNew = false) => {
    // create a new DOM node
    let itemNode = document.createElement('div');
    // append the css class
    itemNode.setAttribute('class', 'read-item');
    itemNode.setAttribute('data-url', item.url);
    // add new inner HTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;
    // append new node to "items" node
    items.appendChild(itemNode);
    // attach click handler to select
    itemNode.addEventListener('click', this.select);
    itemNode.addEventListener('dblclick', this.open);
    // if this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected');
    }
    if (isNew) {
        this.storage.push(item);
        this.save();
    }
}

exports.changeSelection = direction => {
    let currentItem = this.getSelectedItem();
    
    if (direction === 'ArrowUp' && currentItem.node.previousElementSibling) {
            currentItem.classList.remove('selected');
            currentItem.previousElementSibling.classList.add('selected');
        } else if (direction === 'ArrowDown' && currentItem.nextElementSibling) {
            currentItem.classList.remove('selected');
            currentItem.nextElementSibling.classList.add('selected');
        }
}

exports.open = () => {
    // onlt if we have items (in case of menu open)
    if (!this.storage.length) return;

    let selectedItem = this.getSelectedItem();
    let contentURL = selectedItem.node.dataset.url;

    //open item in proxy browserwindow
    let readerWin = window.open(contentURL, '', `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
    `);
    readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
}

exports.openNative = () => {
        // onlt if we have items (in case of menu open)
        if (!this.storage.length) return;

        let selectedItem = this.getSelectedItem();
        let contentURL = selectedItem.node.dataset.url;

        //open in user's default browser
        shell.openExternal(contentURL);
}

// add items from storage when app loads
this.storage.forEach(item => {
    this.addItem(item);
});