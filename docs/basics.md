// Ref.
const notes = firebase.database().ref('notes');
const users = firebase.database().ref('users');
console.info(notes);

// Set.
console.info(' -- SET --');
notes.set({
  0: {
    createdAt: Date('2016'),
    text: 'through js',
  },
  1: {
    createAt: Date('2017'),
    text: 'yeee',
  },
});

// Push.
// console.info('-- PUSH --');
// notes.push({
//   text: "gen index firebase",
// });

// Transactions.
console.info('-- TRANSACTION --');
const note0 = notes.child('0').child('text');
console.info(note0);
note0.transaction((note) => note + ' - modified');

// Read.
console.info('-- READ --');
notes.on('value', (snapshot) => {
  console.info(snapshot.val());
}, (error) => {
  console.error(error.code);
});
notes.off('value');

users.on('value', (snapshot) => {
  console.info(snapshot.val());
}, (error) => {
  console.info(error.code);
});

notes.once('value')
  .then((snapshot) => {
    console.info('(once)');
    console.info(snapshot.val());
});

// Order.
console.info('-- ORDER --');
notes.orderByChild('text').on('child_added', (data) => {
  console.info('(ordered by text)');
  console.info(data.val());
});

notes.orderByKey().on('child_added', (data) => {
  console.info('(ordered by key)');
  console.info(data.val());
});

// Filter.
console.info('-- FILTER --');
notes.equalTo('0').on('child_added', (data) => {
  console.info('(filtered)');
  console.info(data.val());
});

// Account.
const email = 'foo@example.com';
const password = '123456';

firebase.auth().createUserWithEmailAndPassword(email, password)
  .catch((error) => {
    console.error(error.code);
    console.error(error.message);
  });

firebase.auth().signInWithEmailAndPassword(email, password)
  .then(() => {
    console.info('Logged in!');
  })
  .catch((error) => {
    console.error(error.code);
    console.error(error.message);
  });

// OAuth.
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