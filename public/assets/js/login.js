const logBtn = document.getElementById("logBtn");

logBtn.addEventListener("click", function(e) {
  e.preventDefault();

  const emailPlace = document.getElementById("email");
  const passwordPlace = document.getElementById("password");

  const email = emailPlace.value.trim();
  const password = passwordPlace.value.trim();

  if (email && password) {
    $.ajax("/api/user/login", {method: "POST", data: {email, password}})
      .then(result => {
        console.log(result);
        // redirect to members page on result.success
      }).catch(err => {
        console.log(err);
        // display to user err
      })
  }
})