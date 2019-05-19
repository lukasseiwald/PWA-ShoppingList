let functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.modifyList = functions.firestore.document('lists/{userId}/list/{listId}').onWrite((snap, context) => {

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