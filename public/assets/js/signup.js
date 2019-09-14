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
    $.ajax("/api/user/signup", { method: "POST", data: { email, username, password } })
      .then(result => {
        // redirect if result.success === true
        if (result.success) {
          window.location.replace(`/login/success/${result.id}`)
        }
      }).catch(err => {
        const errorArray = []
        console.log(err);
        const er = err.responseJSON;
        if (er.msg) {
          errorArray.push({ msg: er.msg });
        } else if (er.err.errors.email) {
          errorArray.push({ msg: er.err.errors.email.message })
        }
        addAlert(errorArray)
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