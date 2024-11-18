var editBtn = document.getElementsByClassName("edit-btn");
var deleteBtn = document.getElementsByClassName("delete-btn");

Array.from(editBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const website = this.parentNode.parentNode.childNodes[1].innerText
    const username = this.parentNode.parentNode.childNodes[1].innerText
    const password = this.parentNode.parentNode.childNodes[1].innerText
    const id = this.dataset.id;//breakdown: this:button being clicked | dataset: objc containing all data | id: specify to get the id from the click of the button. the id is sent to the server so it knows what to update. without dataset.id the serve doesnt know what to update bcs of the specific id it doesn't have. the id is provided by mongo (_id)

  //prompt is outdated?
    const newWebsite = prompt("Enter new website", website);
    const newUsername = prompt("Enter new username", username);
    const newPassword = prompt("Enter new password", password);

    fetch('/passwords/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        website: newWebsite,
        username: newUsername,
        password: newPassword
      })
    })
    .then(response => response.json())
    .then(data => window.location.reload());
  });
});
Array.from(deleteBtn).forEach(function(element) {
  element.addEventListener('click', function(){
    const id = this.dataset.id;
    fetch('/passwords', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: id })
    }).then(response => window.location.reload());
  });
});
