# Basics

> Firebase Web API basics.

All of the examples below can be run with or without [Promises](https://firebase.googleblog.com/2016/01/keeping-our-promises-and-callbacks_76.html).

## References

```
const messages = firebase.database().ref('messages');
const users = firebase.database().ref('users');
```

## Set

Replaces entire tree.

```
messages.set({
  0: {
    text: '🍭',
  },
  1: {
    text: '🍬',
  },
});
```

## Push

Appends new data by using a random identifier.

```
notes.push({
  text: '🍫',
});
```

## Transactions

[Atomically modifies the data](https://www.firebase.com/docs/web/api/firebase/transaction.html).

```
const message0 = messages.child('0').child('text');
message0.transaction((message) => message + ' - modified');
```

## Read

```
notes.on('value', (snapshot) => {
  console.info(snapshot.val());
}, (error) => {
  console.error(error.code);
});
notes.off('value'); // Stop listening for changes.
```

```
notes.once('value')
  .then((snapshot) => {
    console.info(snapshot.val());
  });
```

## Order

```
notes.orderByChild('text').on('child_added', (data) => {
  console.info(data.val());
});
```

```
notes.orderByKey().on('child_added', (data) => {
  console.info(data.val());
});
```

## Filter

```
notes.equalTo('0').on('child_added', (data) => {
  console.info(data.val());
});
```

## Account

```
firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch((error) => {
    console.error(error.code);
    console.error(error.message);
  });
```

```
firebase.auth().signInWithEmailAndPassword(email, password)
  .then(() => {
    console.info('Logged in!');
  })
  .catch((error) => {
    console.error(error.code);
    console.error(error.message);
  });
```

## OAuth

```
const googleProvider = new firebase.auth.GoogleAuthProvider();
function googleSignin() {
  firebase.auth()
    .signInWithPopup(googleProvider)
    .then((result) => {
      const token = result.credential.accessToken;
      const user = result.user;
      console.info(token);
      console.info(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.info(error.code);
      console.info(error.message);
    });
}
```
