const signBtn = document.getElementById("signBtn");

signBtn.addEventListener("click", function(e) {
  e.preventDefault();

  const emailPlace = document.getElementById("email");
  const usernamePlace = document.getElementById("username");
  const passwordPlace = document.getElementById("password");

  const email = emailPlace.value.trim();
  const username = usernamePlace.value.trim();
  const password = passwordPlace.value.trim();

  if (email && username && password) {
    $.ajax("/api/user/signup", {method: "POST", data: {email, username, password}})
      .then(result => {
        console.log(result);
        // redirect if result.success === true
        if (result.success) {
          window.location.replace(`/login/success/${result.id}`)
        }
      }).catch(err => {
        console.log(err.responseJSON.msg);
        alert(err.responseJSON.msg)
        // display to user err
      })
  }
})