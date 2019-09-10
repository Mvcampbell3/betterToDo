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
        if (result.success) {
          window.location.replace("/members");
        }
      }).catch(err => {
        console.log(err);
        console.log(err.responseText)
        // display to user err
        if (err.responseText === "Unauthorized") {
          alert("Email and/or password is incorrect")

        }
      })
  }
})