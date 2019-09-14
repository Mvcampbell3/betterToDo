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
        // redirect to members page on result.success
        if (result.success) {
          window.location.replace("/members");
        }
      }).catch(err => {
        let errorArray = [];
        console.log(err);
        console.log(err.responseText)
        // display to user err
        if (err.responseText === "Unauthorized") {
          errorArray.push({msg: "Email and/or Password was incorrect"});
        } else {
          errorArray.push({msg: "Something went wrong"})
        }
        addAlert(errorArray);
      })
  }
})

function addAlert(errors) {
  if (errors.length === 0) {
    errors.push({ msg: "Something went wrong" })
  }
  errors.forEach(one => {
    const newAlert = document.createElement("div");
    newAlert.classList = "alert alert-warning alert-dismissible fade show";
    newAlert.setAttribute("role", "alert")
    newAlert.textContent = one.msg;

    const closeAlert = document.createElement("button");
    closeAlert.classList = "close"
    closeAlert.setAttribute("data-dismiss", "alert")
    closeAlert.setAttribute("aria-label", "Close")
    closeAlert.innerHTML = "<span aria-hidden='true'>&times;</span>"

    newAlert.append(closeAlert);
    const formAdd = document.getElementById("form");
    formAdd.prepend(newAlert)
  })
}