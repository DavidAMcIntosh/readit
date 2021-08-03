const { ipcRenderer } = require("electron");
const items = require('./items');

// Responsible for everything that happens on the main window
let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal'),
    itemUrl = document.getElementById('url'),
    addItem = document.getElementById('add-item'),
    search = document.getElementById('search');

//open modal fro-m menu
ipcRenderer.on('menu-show-modal', () => {
    showModal.click();
});

ipcRenderer.on('menu-open-item', () => {
    items.open();
});

ipcRenderer.on('menu-delete-item', () => {
   let selectedItem = items.getSelectedItem();
   items.delete(selectedItem.index);
});

ipcRenderer.on('menu-open-item-native', () => {
    items.openNative();
});

ipcRenderer.on('menu-focus-search', () => {
    search.focus();
});

// filter items with "search"
search.addEventListener('keyup', e => {
    //loop items
    Array.from(document.getElementsByClassName('read-item')).forEach(item => {
        let hasMatch = item.innerText.toLowerCase().includes(search.value);
        item.style.display = hasMatch ? 'flex' : 'none';
    });
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        items.changeSelection(e.key);
    }
});

// disable and enable modal buttons
const toggleModalButtons = () => { 
    if (addItem.disabled === true) {
        addItem.disabled = false;
        addItem.style.opacity = 1;
        addItem.innerText = 'Add Item';
        closeModal.style.display = 'inline';
    } else {
        addItem.disabled = true;
        addItem.style.opacity = 0.5;
        addItem.innerText = 'Adding...';
        closeModal.style.display = 'none';
    }
}


showModal.addEventListener('click', e => {
    modal.style.display = 'flex';
    itemUrl.focus();
});

closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
});

addItem.addEventListener('click', e => {
    if (itemUrl.value) {
        //send new item url to main process
        ipcRenderer.send('new-item', itemUrl.value);
        toggleModalButtons();
    }
});

// listen for the new item success from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
    // add new item to "items" node
    items.addItem(newItem, true);

    toggleModalButtons();

    //hide the modal and clear the input value
    modal.style.display = 'none';
    itemUrl.value = '';
});

// listen for a keyboard submit
itemUrl.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        addItem.click();
    }
});
