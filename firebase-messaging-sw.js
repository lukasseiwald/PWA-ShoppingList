importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/6.0.2/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '214142605751'
});    

const messaging = firebase.messaging();