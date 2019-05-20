let swRegistration = " ";
let permission = false;
let gotData = false;
const shoppingList = document.querySelector('.list-group');
const form = document.querySelector('#listForm');
const listInput = document.querySelector('#listInput');
const listItem = document.querySelector('.listItem');
const loginButton = document.querySelector('#login-btn')
const notificationButton = document.querySelector('#permission-btn');

let audio1 = new Audio("../audio/all.mp3");
let audio2 = new Audio("../audio/awful.mp3");
let audio3 = new Audio("../audio/bathroom.mp3");
let audio4 = new Audio("../audio/caught.mp3");
let audio5 = new Audio("../audio/christmas.mp3");
let audio6 = new Audio("../audio/condition.mp3");
let audio7 = new Audio("../audio/cooler.mp3");
let audio8 = new Audio("../audio/core.mp3");
let audio9 = new Audio("../audio/expert.mp3");
let audio10 = new Audio("../audio/hard.mp3");
let audio11 = new Audio("../audio/hardware.mp3");
let audio12 = new Audio("../audio/home.mp3");
let audio13 = new Audio("../audio/myspace.mp3");
let audio14 = new Audio("../audio/myturn.mp3");
let audio15 = new Audio("../audio/privatized.mp3");
let audio16 = new Audio("../audio/sick.mp3");
let audio17 = new Audio("../audio/trust.mp3");
let audio18 = new Audio("../audio/wantone.mp3");
let audio19 = new Audio("../audio/iron_man_repulsor.mp3");
let sounds = [audio1, audio2, audio3, audio4, audio5, audio6, audio7, audio8, audio9, audio10, audio11, audio12, audio13, audio14, audio15, audio16, audio17, audio18, audio19]
let currentSound;

var config = {
  apiKey: "AIzaSyB8tLQ6sxchB8fau4g5LlX9FecO15hy4yo",
  authDomain: "superheroshopping-3430c.firebaseapp.com",
  databaseURL: "https://superheroshopping-3430c.firebaseio.com/",
  projectId: 'superheroshopping-3430c',
  messagingSenderId: "214142605751"
};
firebase.initializeApp(config);

let db = firebase.firestore();
firebase.firestore().enablePersistence(); // für offline

const pushNotifications = async () => {
  swRegistration = await registerServiceWorker();
  //permission =  await requestNotificationPermission();
  //showLocalNotification('SUPERHERO SHOPPING', 'Notifications Activated.', swRegistration);
}

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('../service-worker.js'); //notice the file name
    return swRegistration;
}

// const requestNotificationPermission = async () => {
//   const permission = await window.Notification.requestPermission();
//   if(permission !== 'granted'){
//       throw new Error('Permission not granted for Notification');
//   }
// }

//Firebase
var provider = new firebase.auth.GoogleAuthProvider();
const messaging = firebase.messaging();

messaging.onMessage(function(payload) {
  console.log('onMessage: ', payload);
})


firebase.auth().onAuthStateChanged(function(user) { 
  if(user){
    loginButton.innerHTML = user.displayName + "   | Logout";
    
    getListItems(user.uid);
    // let ref = db.collection('lists/').doc(user.uid);
    // ref.get().then((querySnapshot) => {
    //   console.log(querySnapshot);
      // querySnapshot.forEach((snap) => {
      //   console.log(snap)
      //   showList(snap.val());
      //   // console.log(`${doc.id} => ${doc.data()}`);
      // });
    // });
    // ref.on('value', function(snapshot) {
    //   showList(snapshot.val());
    // });
    if(Notification.permission == "granted") {
      notificationButton.style.color = '#393';
      notificationButton.innerHTML += '  ON' 
    }
    else if(Notification.permission == "denied") {
      notificationButton.style.color = '#933';
      notificationButton.innerHTML += '  DENIED' 
    }
  } else {
    console.log("User is logged out");
  }
});

async function getListItems(userId) {
  let list = new window.Object();

  const snapshot = await firebase.firestore().collection('lists/').doc(userId).collection('list/').get()
  snapshot.docs.map((doc) => {
    let key = doc.id;
    let value = doc.data().item
    list[key] = value;
    console.log(list);
  });
  showList(list)
}

function showList(list) {
  if(!gotData) {
    for (var key in list) {

      let item = list[key].replace('--done','');
      const li = document.createElement('li')

      if(list[key].indexOf('--done') !== -1) {
        li.className = 'list-group-item done';
      }
      else {
        li.className = 'list-group-item';
      }

      li.className = 'list-group-item';
      li.key = key;
      li.innerHTML = `<i class="far fa-square done-icon"></i>
                      <i class="far fa-check-square done-icon"></i>
                      <i class="far fa-trash-alt"></i>`;
      const span = document.createElement('span');
      span.className = 'todo-text';
      
      if(list[key].indexOf('--done') !== -1) {
        list[key].replace('--done','');
        li.className = 'list-group-item done';
      }

      span.appendChild(document.createTextNode(item));
      li.appendChild(span);
      shoppingList.appendChild(li);
    }
    gotData = true;
  }
}

// Functions of all event listners
function allEventListners() {
    form.addEventListener('submit', addToList);
    shoppingList.addEventListener('click', removeItem);
    loginButton.addEventListener('click', login);
    notificationButton.addEventListener('click', subscribeNotification);
}

const subscribeToNotification = async () => {
  // const permission = await window.Notification.requestPermission();
  messaging.requestPermission()
    .then(function() {
      notificationButton.style.color = '#393';
      notificationButton.innerHTML += '  ON' 
      handleTokenRefresh();
    })
    .catch(function(err) {
      notificationButton.style.color = '#933';
      notificationButton.innerHTML += '  DENIED' 
      console.log(err.message);
    })
}

function handleTokenRefresh() {
  return messaging.getToken()
    .then(function(token) {
      console.log(token);
      firebase.database().ref('/tokens').push({
        token: token,
        uid: firebase.auth().currentUser.uid
      })

      //let ref = firebase.firestore().collection('tokens/');
    })
}

// function unsubsribeFromNotifications() {
//   messaging.getToken() 
//     .then((token) => {
//       notificationButton.style.color = '#933';
//       let innerHTML = notificationButton.innerHTML.replace('ON','DENIED');
//       notificationButton.innerHTML = innerHTML;
//       messaging.deleteToken(token);
//     })
//     .then(()=> {
//       firebase.database().ref('/tokens').orderByChild('uid').equalTo(firebase.auth().currentUser.uid)
//       .once('value')
//       .then((snapshot) => {
//         console.log(snapshot.val());
//         const key = Object.keys( snapshot.val())[0];
//         return firebase.database().ref('/tokens').child(key).remove();
//       });
//     })
// }

// const showLocalNotification = (title, body, swRegistration) => {
//   const options = {
//     body: body,
//     icon: "../images/icons/icon-128x128.png",
//     badge: "../images/icons/icon-128x128.png",
//     vibrate: [100, 50, 100],
//   }
//   playAudio();
//   //swRegistration.showNotification(title, options);
// }

function addToList(e) {
  playRandomSound();
  e.preventDefault();
  if (listInput.value !== '') {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `<i class="far fa-square done-icon"></i>
                    <i class="far fa-check-square done-icon"></i>
                    <i class="far fa-trash-alt"></i>`;
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.appendChild(document.createTextNode(listInput.value));
    li.appendChild(span);
    shoppingList.appendChild(li);
    addToItemFirebaseDatabase(listInput.value, li);

    listInput.value = '';
  } 
}

function addToItemFirebaseDatabase(listInput, li) {
  let myUserId = firebase.auth().currentUser.uid;
  let ref = db.collection('lists/').doc(myUserId).collection('list')
  ref.add({ item: listInput})
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        li.key = docRef.id;
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  // let myUserId = firebase.auth().currentUser.uid;
  // firebase.database().ref('lists/' + myUserId).push(listInput);
}

function removeItem(e) {
  if (e.target.classList.contains('fa-trash-alt')) {
    e.target.parentElement.remove();
    deleteEntry(e.target.parentElement.key);
  }
  else if (e.target.classList.contains('todo-text')) {
      e.target.parentElement.classList.toggle('done'); 
      playRandomSound();     
      updateEntry(e.target.parentElement.key);
  }
  else if (e.target.classList.contains('done-icon')) {
      e.target.parentElement.classList.toggle('done');
      playRandomSound();
      updateEntry(e.target.parentElement.key);
  }
}

function deleteEntry(key) {
  let myUserId = firebase.auth().currentUser.uid;

  db.collection('lists/').doc(myUserId).collection('list').doc(e.target.parentElement.key).delete().then(function() {
    console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });
}

function updateEntry(key) {
  let myUserId = firebase.auth().currentUser.uid;
  let itemValue = '';
  let ref = db.collection('lists/').doc(myUserId).collection('list').doc(key)
  let updates = {};

  ref.get().then((doc) =>{
    if (doc.exists) {
        itemValue = doc.data().item;
        if(itemValue.indexOf('--done') !== -1) {
          itemValue = itemValue.replace('--done','');
          updates = {
            item: itemValue
          }
          updateData(key, myUserId ,updates);
        }
        else {
          itemValue = itemValue + '--done';
          updates = {
            item: itemValue
          }
          updateData(key, myUserId ,updates);
        }
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        return;
    }
  }).catch(function(error) {
      console.log("Error getting document:", error);
      return;
  });
}

function updateData(key, myUserId, updates) {
  let ref = db.collection('lists/').doc(myUserId).collection('list').doc(key)
  
  ref.update(updates)
  .then(function() {
    console.log("Document successfully updated!");
  })
  .catch(function(error) {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
  });
}

function login() {
  if(loginButton.innerHTML.indexOf("Logout") !== -1){
    firebase.auth().signOut().then(function() {
      loginButton.innerHTML = "Login";
    }).catch(function(error) {
      // An error happened.
    });
    return;
  }
  else {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      loginButton.innerHTML = user.displayName + "   | Logout";
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
}

function subscribeNotification() {
  if(Notification.permission !== "granted") { 
    playRandomSound();
    subscribeToNotification();
  }
}

function playAudio() { 
  pushAudio.volume = 0.1;
  pushAudio.play(); 
}

function playRandomSound(){
  var soundFile = sounds[Math.floor(Math.random()*sounds.length)];
  soundFile.volume = 0.2;
  soundFile.play(); 
}


pushNotifications();
allEventListners();
