((firebase, moment) => {
  const messages = firebase.database().ref('messages');
  const users = firebase.database().ref('users');
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  let user;

  // Auth.
  firebase.auth().onAuthStateChanged((newUser) => {
    if (newUser) {
      user = newUser;

      users.child(newUser.uid).set({
        displayName: newUser.displayName,
        email: newUser.email,
      });
      document.querySelector('#loggedIn').innerHTML = `Logged in as ${newUser.displayName}`;
    }
  });

  document.querySelector('.google-login').addEventListener('click', () => {
    firebase.auth()
      .signInWithRedirect(googleProvider)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${error.code} - ${error.message}`);
      });
  });

  // Read.
  messages.on('child_added', (snapshot) => {
    const list = document.querySelector('#list');
    const message = snapshot.val();
    const messageContainer = document.createElement('div');
      
    const ownerContainer = document.createElement('div');
    const owner = document.createTextNode(message.owner);
    const spacer = document.createTextNode(' - ');
    const timestamp = document.createTextNode(moment(new Date(message.updatedAt)).fromNow());
    loadDisplayName(message.owner, owner);
    ownerContainer.appendChild(owner);
    ownerContainer.appendChild(spacer);
    ownerContainer.appendChild(timestamp);
    messageContainer.appendChild(ownerContainer);
    
    const text = document.createTextNode(message.text);
    messageContainer.appendChild(text);
      
    list.insertBefore(messageContainer, list.firstChild);
  });

  function loadDisplayName(uid, node) {
    users.child(uid + '/displayName').once('value', (snapshot) => {
      node.nodeValue = snapshot.val();
    });
  }

  // Write.
  document.querySelector('#new').addEventListener('submit', (e) => {
    e.preventDefault();

    if(!user) {
      alert('Not logged in!');
      return;
    }

    const textElement = document.querySelector('#newText');
    const text = textElement.value;
    textElement.value = '';

    messages
      .push({ 
        text,
        owner: user.uid,
        updatedAt: firebase.database.ServerValue.TIMESTAMP,
      })
      .catch((error) => { alert(error); });
  });
})(firebase, moment);