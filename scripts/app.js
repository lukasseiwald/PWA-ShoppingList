const shoppingList = document.querySelector('.list-group');
const form = document.querySelector('#listForm');
const listInput = document.querySelector('#listInput');
const listItem = document.querySelector('.listItem');
//clearBtn = document.querySelector('#clearBtn')

// Load all event listners
allEventListners();

// Functions of all event listners
function allEventListners() {
    form.addEventListener('submit', addToList);
    shoppingList.addEventListener('click', removeItem);
    //clearBtn.addEventListener('click', clearTodoList);
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
  } 
  e.preventDefault();
}

function removeItem(e) {
  if (e.target.classList.contains('fa-trash-alt')) {
    e.target.parentElement.remove();
  }

  if (e.target.classList.contains('todo-text')) {
      e.target.parentElement.classList.toggle('done');
  }
  if (e.target.classList.contains('done-icon')) {
      e.target.parentElement.classList.toggle('done');
  }
}


(function() {
  'use strict';

  var app = {


  };
 


  //Login

  app.toggleLoginButton = function(status) {
    if(status == 'Login'){
      document.getElementById('butLogin').innerHTML = 'Logout'
    }
    else if(status == 'Logout'){
      document.getElementById('butLogin').innerHTML = 'Login'
    }
  }

  // TODO add service worker code here
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('../service-worker.js')
             .then(
               function() { 
                  console.log('Service Worker Registered.'); 
                });

    navigator.serviceWorker.addEventListener('message', function (event) {
      console.log(event.data);
      app.toggleLoginButton(event.data);
    }) 
  }

  //zuerst mit MessageChannel gemacht, und nach 3 stunden aufgegben, weil es nicht gescheid ging.

  //Login / Logout
  document.getElementById('butLogin').addEventListener('click', function() {
    app.loginUser();
  });

  app.loginUser = function() {    
    //status entweder Login oder Logout
    var status = document.getElementById('butLogin').innerHTML;
    var msg = status;
    navigator.serviceWorker.controller.postMessage(msg);
  };



})();