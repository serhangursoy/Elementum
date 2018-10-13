onload = () => {
  require('electron-titlebar')
  var electron = require('electron');
  const {
    BrowserWindow,
    shell
  } = require('electron').remote;
  const fs = require('fs');

  const {
    ipcRenderer
  } = require('electron');

  console.log("Can I access? ", electron.remote.getCurrentWindow().caniAccess);
  const createHubButton = document.querySelector('#createHubButton')
  const existingHubButton = document.querySelector("#existingHubButton")

  var database = null // will be filled once we are established connection!
  var AccessLink = ""

  createHubButton.addEventListener('click', CreateButtonClicked)
  existingHubButton.addEventListener('click', CheckOldConfig)

  function CreateButtonClicked() {
    var credValues = document.querySelector("#dbCredField").value;
    var UsernameVal = document.querySelector('#usernameFieldCreator').value;
    var passwordVal = document.querySelector("#passwordField").value;
    CreateHubWithCredentials(UsernameVal, credValues, passwordVal)
  }


  function CheckOldConfig() {
    fs.readFile('elementum.bin', 'utf8', function(err, contents) {
      if (contents == undefined) {
        document.querySelector("#alertArea").innerHTML = '<div class="alert alert-warning alert-dismissible fade show" role="alert"><span class="alert-inner--icon"><i class="ni ni-bell-55"></i></span><span class="alert-inner--text"><strong>Oups!</strong> It appears that you dont have any hubs, yet! </span><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div> '
        return
      }
      var contArr = contents.split("######")
      var confObj = JSON.parse(contArr[0])
      confObjFixed = ConnEstablisher(confObj);
      AccessLink = contArr[2]
      console.log("Existing hub installed!");
      ipcRenderer.send('open-dashboard', null);
    });
  }

  function CreateHubWithCredentials(username, dataCred, password) {
    // We need to connect the DB first..
    var confObj = FirebaseSyntaxChecker(dataCred).split(',')
      .map(x => x.split(':').map(y => y.trim()))
      .reduce((a, x) => {
        a[x[0]] = x[1];
        return a;
      }, {});
    confObj.databaseURL = "https:" + confObj.databaseURL
    confObjFixed = ConnEstablisher(confObj);
    // Add username to users section
    AddAdminAsUser(username, password)
    // We need a hashed url for user access for these exact same credentions
    // Before you say anything, I should say that I'm aware of the problems that
    // might occur in security sense. However, this app relies on "good behaviour"
    // of users. If you want to make a more secure connection, feel free to
    // let them access all the things and customize your own DB rules
    var dbAccLink = cryptName(confObj.projectId)
    AccessLink = createAccessLink(dbAccLink, confObjFixed);
    AccessLink = confObj.databaseURL.split('"').join('') + "/" + AccessLink
    // Now we need to fill all those info into a config file for later usage..
    WriteCredentials(JSON.stringify(confObjFixed), username, AccessLink);
    console.log("Created Access Link =>", AccessLink);
    ipcRenderer.send('open-dashboard', null);
  }

  function AddAdminAsUser(username, password) {
    var userObj = {
      Completed: {},
      Waiting: {},
      Chats: {},
      Groups: {},
      Profile: {
        Password: password
      }
    }

    database.ref('main/users/' + username).set(userObj, function(error) {
      if (error) {
        // The write failed...
        console.log("SOMETHING WENT WRONG, BIG TIME")
      } else {
        // Data saved successfully!
        console.log("Something not went wrong, seems alright!")
      }
    });
    return true
  }

  function WriteCredentials(credInfo, username, accessLink) {
    var combined = credInfo + "######" + username + "######" + accessLink
    fs.writeFile('elementum.bin', combined, (err) => {
      if (err) throw err;
      console.log('Credentials saved!');
    });
  }


  function createAccessLink(dbAccName, confObj) {
    database.ref('elementum/access/' + dbAccName).set(confObj);
    return 'elementum/access/' + dbAccName
  }


  function cryptName(str) {
    var p1 = 2654435761,
      p2 = 1597334677,
      h1 = 0xdeadbeef | 0,
      h2 = 0x41c6ce57 | 0;
    for (var i = 0; i < str.length; i++)
      ch = str.charCodeAt(i), h1 = Math.imul(h1 + ch, p1), h2 = Math.imul(h2 + ch, p2);
    h1 = Math.imul(h1 ^ h1 >>> 16, p2), h2 = Math.imul(h2 ^ h2 >>> 15, p1);
    return (h2 & 2097151) * 4294967296 + h1;
  };

  function ConnEstablisher(credentials) {

    var config = {
      apiKey: credentials.apiKey.split('"').join(''),
      authDomain: credentials.authDomain.split('"').join(''),
      databaseURL: credentials.databaseURL.split('"').join(''),
      projectId: credentials.projectId.split('"').join(''),
      storageBucket: credentials.storageBucket.split('"').join(''),
      messagingSenderId: credentials.messagingSenderId.split('"').join('')
    };
    firebase.initializeApp(config)
    database = firebase.database()
    return config
  }

  function FirebaseSyntaxChecker(credentials) {
    // Little correction in here
    credentials = credentials.replace("https:", "");
    credentials = credentials.replace("http:", "")

    if (credentials[0] == "{") {
      credentials = credentials.slice(1, credentials.length)
      if (credentials[credentials.length - 1] == "}") {
        credentials = credentials.slice(0, credentials.length - 1)
      }
    }
    console.log("New Syntax ", credentials);
    return credentials
  }

}