let swRegistration = " ";
let permission = false;
let gotData = false;
const shoppingList = document.querySelector('.list-group');
const form = document.querySelector('#listForm');
const listInput = document.querySelector('#listInput');
const listItem = document.querySelector('.listItem');
const loginButton = document.querySelector('#login-btn')
const notificationButton = document.querySelector('#permission-btn');

const pushAudio = new Audio("../audio/iron_man_repulsor.mp3");

//Firebase
var config = {
  apiKey: "AIzaSyB8tLQ6sxchB8fau4g5LlX9FecO15hy4yo",
  authDomain: "superheroshopping-3430c.firebaseapp.com",
  databaseURL: "https://superheroshopping-3430c.firebaseio.com/",
  messagingSenderId: "214142605751"
};
firebase.initializeApp(config);
var provider = new firebase.auth.GoogleAuthProvider();

const installServiceWorker = async () => {
  swRegistration = await registerServiceWorker();
}

const messaging = firebase.messaging();

messaging.onMessage(function(payload) {
  console.log('onMessage: ', payload);
})

firebase.auth().onAuthStateChanged(function(user) { 
  if(user){
    loginButton.innerHTML = user.displayName + "   | Logout";
    var ref = firebase.database().ref('lists/' + user.uid);
    ref.on('value', function(snapshot) {
      showList(snapshot.val());
    });
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

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('../service-worker.js');
    return swRegistration;
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
    addToFirebaseDatabase(listInput.value);

    listInput.value = '';
    // playAudio();
  } 
}

function addToFirebaseDatabase(listInput) {
  let myUserId = firebase.auth().currentUser.uid;
  firebase.database().ref('lists/' + myUserId).push(listInput);
}

function removeItem(e) {
  let myUserId = firebase.auth().currentUser.uid;
  if (e.target.classList.contains('fa-trash-alt')) {
    e.target.parentElement.remove();

    firebase.database().ref('lists/' + myUserId + '/' + e.target.parentElement.key).remove();
  }

  if (e.target.classList.contains('todo-text')) {
      e.target.parentElement.classList.toggle('done');      
      updateEntry(e.target.parentElement.key, myUserId);
  }
  if (e.target.classList.contains('done-icon')) {
      e.target.parentElement.classList.toggle('done');
      updateEntry(e.target.parentElement.key, myUserId);
  }
}

function updateEntry(key, myUserId) {
  let itemValue = '';
  let ref = firebase.database().ref('lists/' + myUserId);
  var updates = {};
  ref.on('value', (snapshot) => {
    snapshot.forEach((snap) => {
      if(snap.key == key) {
        if(snap.val().indexOf('--done') !== -1) {
          itemValue = snap.val().replace('--done','');
          updates[key] = itemValue;
        }
        else {
          itemValue = snap.val() + '--done';
          updates[key] = itemValue;
        }
      }
    });
  });
  ref.update(updates);
}

function login() {
  playAudio();
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
    playAudio();
    subscribeToNotification();
  }
}

function playAudio() { 
  pushAudio.volume = 0.1;
  pushAudio.play(); 
}

allEventListners();