/*
 * Copyright 2018 Hochikong
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { app, BrowserWindow, ipcMain } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let childWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 579,
    show: false,
    resizable: false,
    backgroundColor: '#938D7F',
  });
  // hide menu
  mainWindow.setMenu(null);
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    childWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const userDataFileName = 'userdata.json';

function createNewHelpWindow(father) {
  const tmp = new BrowserWindow({
    parent: father,
    width: 700,
    height: 686,
    show: false,
    resizable: false,
    backgroundColor: '#938D7F',
  });
  tmp.loadURL(`file://${__dirname}/help.html`);
  return tmp;
}

function fileExists(name) {
  return existsSync(name);
}

function loadDataFromFile(name) {
  const rawData = readFileSync(name);
  return JSON.parse(rawData);
}

function writeDataToFile(name, data) {
  const cache = JSON.stringify(data);
  writeFileSync(name, cache);
}

function checkUserData(fileName) {
  if (fileExists(fileName)) {
    return {
      exists: true,
      data: loadDataFromFile(fileName),
    };
  }
  return {
    exists: false,
  };
}

// Initial work
const result = checkUserData(userDataFileName);

ipcMain.on('RTOM', (event, arg) => {
  switch (arg.head) {
    case 'query': {
      event.sender.send('MTOR', result);
      break;
    }
    case 'update': {
      writeDataToFile(userDataFileName, arg.body);
      const tmp = checkUserData(userDataFileName);
      event.sender.send('MTORUpdateView', tmp);
      break;
    }
    default:
    // empty
  }
});

ipcMain.on('RTOMCheck', (event, arg) => {
  const tmp = checkUserData(userDataFileName);
  event.sender.send('MTORNeedPersistence', tmp);
});

ipcMain.on('showHelp', (event, arg) => {
  if (arg === 'show') {
    childWindow = createNewHelpWindow();
    childWindow.once('ready-to-show', () => {
      childWindow.show();
    });
  }
});
