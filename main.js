// Basic init
const electron = require('electron')
const {app, BrowserWindow, ipcMain} = electron
const path = require('path');
const url = require('url');
const keytar = require('keytar');
const Cloudant = require('@cloudant/cloudant');
let CREDENTIALS = {};

// Let electron reloads by itself when webpack watches changes in ./app/
if (process.env.ELECTRON_START_URL) {
  require('electron-reload')(__dirname)
}

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {

    let mainWindow = new BrowserWindow({width: 800, height: 600})

    const startUrl = process.env.ELECTRON_START_URL || url.format({
          pathname: path.join(__dirname, './build/index.html'),
          protocol: 'file:',
          slashes: true
        });

    mainWindow.loadURL(startUrl)

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

ipcMain.on('findCredentials', async(event, service) => {
    const [credentials] = await keytar.findCredentials(service)
    if(credentials) {
        const { account, password } = credentials;
        event.sender.send('foundCredentials', {
            userName: account,
            password
        });
    } else {
        event.sender.send('foundCredentials', null)
    }
});

ipcMain.on('setPassword', async(event, props) => {
    const { service, account, password } = props;
    keytar.setPassword(service, account, password);
});

ipcMain.on('login', (event, credentials) => {
    Cloudant(credentials, async(err, cloudant, pong) => {
        if(err) {
            console.log(err);
            event.sender.send('loggedIn', err);
        } else {
            const databases = await cloudant.db.list();
            CREDENTIALS = { ...credentials };
            event.sender.send('loggedIn', { databases, ...credentials });
        }
    })
})

ipcMain.on('fetchDocuments', (event, db) => {
    Cloudant(CREDENTIALS, async(err, cloudant) => {
        if(err) {
            event.sender.send('cloudantError', err.message)
        } else {
            cloudant.use(db).list().then(response => {
                console.log(response.rows[0])
                event.sender.send('documentsFetched', response.rows);
            })
        }
    })
})

ipcMain.on('fetchDocument', (event, props) => {
    const { database, id } = props;
    Cloudant(CREDENTIALS, async(err, cloudant) => {
        if(err) {
            console.log('Err getting doc')
            event.sender.send('cloudantError', err.message)
        } else {
            cloudant.use(database).get(id).then(document => {
                console.log('Fetched doc')
                event.sender.send('documentFetched', document);
            })
        }
    })
})