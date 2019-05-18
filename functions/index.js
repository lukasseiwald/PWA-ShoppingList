let functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database.ref('lists/{userId}').onWrite((event) => {

    const NOTIFICATION_SNAPSHOT = event.data;
    const payload = {
        notification: {
            title: 'List has updated.',
            body: 'Item Added / Changed.'
        }
    }

    return admin.database().ref('/tokens').once('value').then((data) => {
        if(!data.val()) return;

        const snapshot = data.val();
        const tokens = [];

        for(let key in snapshot) {
            tokens.push(snapshot[key].token);
        }

        return admin.messaging().sendToDevice(tokens, payload);
    })
});