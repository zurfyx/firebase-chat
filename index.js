((firebase) => {
  const messages = firebase.database().ref('messages');
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  let user;

  // Auth.
  firebase.auth().onAuthStateChanged((newUser) => {
    if (newUser) {
      user = newUser;
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
  messages.on('value', (snapshot) => {
    const list = document.querySelector('#list');
    const values = snapshot.val();
    values && Object.keys(values).forEach((messageId) => {
      const message = values[messageId];
      const messageContainer = document.createElement('div');
      
      const ownerContainer = document.createElement('div');
      const owner = document.createTextNode(message.owner);
      ownerContainer.appendChild(owner);
      messageContainer.appendChild(ownerContainer);
      
      const text = document.createTextNode(message.text);
      messageContainer.appendChild(text);
      
      list.insertBefore(messageContainer, list.firstChild);
    });
  });

  // Write.
  document.querySelector('#new').addEventListener('submit', (e) => {
    e.preventDefault();

    const textElement = document.querySelector('#newText');
    const text = textElement.value;
    textElement.value = '';

    messages.push({
      text,
      owner: user.uid,
    });
  });
})(firebase);