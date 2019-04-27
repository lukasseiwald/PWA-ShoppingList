let swRegistration = " ";
let permission = " ";
const shoppingList = document.querySelector('.list-group');
const form = document.querySelector('#listForm');
const listInput = document.querySelector('#listInput');
const listItem = document.querySelector('.listItem');

const pushAudio = new Audio("../audio/iron_man_repulsor.mp3");

const pushNotifications = async () => {
  //check();
  swRegistration = await registerServiceWorker();
  permission =  await requestNotificationPermission();
  showLocalNotification('SUPERHERO SHOPPING', 'Notifications Activated.', swRegistration);
}

// Functions of all event listners
function allEventListners() {
    form.addEventListener('submit', addToList);
    shoppingList.addEventListener('click', removeItem);
}

const registerServiceWorker = async () => {
  const swRegistration = await navigator.serviceWorker.register('../service-worker.js'); //notice the file name
    return swRegistration;
}

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  if(permission !== 'granted'){
      throw new Error('Permission not granted for Notification');
  }
}

const showLocalNotification = (title, body, swRegistration) => {
  const options = {
    body: body,
    icon: "../images/icons/icon-128x128.png",
    badge: "../images/icons/icon-128x128.png",
    vibrate: [100, 50, 100],
  }
  playAudio();
  swRegistration.showNotification(title, options);
}

function addToList(e) {
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

    listInput.value = '';
    // playAudio();
    showLocalNotification('SUPERHERO SHOPPING', 'Item added.', swRegistration);
  } 
  e.preventDefault();
}

function removeItem(e) {
  if (e.target.classList.contains('fa-trash-alt')) {
    e.target.parentElement.remove();
    showLocalNotification('SUPERHERO SHOPPING', 'Item deleted.', swRegistration);
  }

  if (e.target.classList.contains('todo-text')) {
      e.target.parentElement.classList.toggle('done');
      showLocalNotification('SUPERHERO SHOPPING', 'Item done.', swRegistration);
  }
  if (e.target.classList.contains('done-icon')) {
      e.target.parentElement.classList.toggle('done');
      showLocalNotification('SUPERHERO SHOPPING', 'Item done.', swRegistration);
  }
}

function playAudio() { 
  pushAudio.volume = 0.1;
  pushAudio.play(); 
}

pushNotifications();
allEventListners();