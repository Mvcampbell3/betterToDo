const addProjectBtn = document.getElementById("addProject");

function addProject() {
  const projectPlace = document.getElementById("project");
  const project = projectPlace.value.trim();

  console.log(project);

  if (project) {
    $.ajax("/api/todo/addProject", {method: "POST", data: {project}})
      .then(result => {
        console.log(result);
        // Refresh the page so that it includes all projects
      })
      .catch(err => {
        console.log(err);
      })
  }
}

addProjectBtn.addEventListener("click", addProject)