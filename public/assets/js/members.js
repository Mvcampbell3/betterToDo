const addProjectBtn = document.getElementById("addProject");
addProjectBtn.addEventListener("click", addProject)

function addProject() {
  const projectPlace = document.getElementById("project");
  const project = projectPlace.value.trim();

  console.log(project);

  if (project) {
    $.ajax("/api/todo/addProject", { method: "POST", data: { project: project } })
      .then(result => {
        console.log(result);
        // Run projects to page
        getProjects();
      })
      .catch(err => {
        console.log(err);
      })
  }
}

function getProjects() {
  $.ajax("/api/todo/gettodos", { method: "GET" })
    .then(result => {
      console.log(result);
      // run html creation based on result
      // Need to make the that data carries todo info, not todo id
      projectsToPage(result)
    })
    .catch(err => console.log(err))
}

function projectsToPage(userInfo) {
  const outputArea = document.getElementById("outputArea");
  outputArea.innerHTML = "";
  const { projects, todos } = userInfo;
  console.log(projects, todos);

  // Create Divs for projects
  projects.forEach(project => {
    const newProjectCol = document.createElement("div");
    newProjectCol.classList = "col-lg-4 col-md-6 col-sm-12 newProject p-4 mb-2";

    const newProjectRow = document.createElement("row");
    newProjectRow.classList = "row";

    const newProjectCard = document.createElement("div");
    newProjectCard.classList = "col-sm-10 m-auto card p-3"

    const newTitle = document.createElement("h4");
    newTitle.textContent = project;
    newTitle.classList = "text-center";

    const newInput = document.createElement("div");
    newInput.classList = "input-group";

    const newTodoInput = document.createElement("input");
    newTodoInput.classList = "form-control";
    newTodoInput.setAttribute("name", "todo")
    newTodoInput.setAttribute("placeholder", "Add Todo...");
    newTodoInput.setAttribute("data-project", project)

    const newInlineInput = document.createElement("div");
    newInlineInput.classList = "input-group-append";

    const newTodoSubmit = document.createElement("button");
    newTodoSubmit.classList = "btn btn-info";
    newTodoSubmit.textContent = "+";
    newTodoSubmit.addEventListener("click", createTodo)
    // Need to add submit functionality

    newInlineInput.append(newTodoSubmit);

    const newTodoPlace = document.createElement("div");


    // Todo div and todos below
    const todoProject = todos.filter(todo => todo.project === project);
    todoProject.forEach(one => {
      const newTodo = document.createElement("div");
      newTodo.classList = "card";

      const newTodoTask = document.createElement("p");
      newTodoTask.classList = "card-text";

      const newTodoChangeComplete = document.createElement("button");
      newTodoChangeComplete.classList = "btn btn-warning";
      newTodoChangeComplete.textContent = todo.isCompleted ? "Undo" : "Do";

      const newDelTodo = document.createElement("button");
      newDelTodo.classList = "btn btn-danger";
      newDelTodo.textContent = "x";

      newTodo.append(newTodoChangeComplete, newTodoTask, newDelTodo);
      newTodoPlace.append(newTodo);
    })

    newInput.append(newTodoInput, newInlineInput);
    newProjectCard.append(newTitle, newInput, newTodoPlace);
    newProjectRow.append(newProjectCard)
    newProjectCol.append(newProjectRow);
    outputArea.append(newProjectCol);
  })
}

function createTodo(e) {
  e.preventDefault();
  console.log(this.parentElement.previousSibling.value.trim())
  const inputTask = this.parentElement.previousSibling;
  const newTask = inputTask.value.trim()
  const project = inputTask.dataset.project;
  console.log({ task: newTask, project: project })

  if (newTask && project) {
    $.ajax("/api/todo/addTodo", { method: "POST", data: { task: newTask, project: project } })
      .then(result => {
        console.log(result);
        getProjects();
      })
      .catch(err => {
        console.log(err);
      })
  }
}

getProjects();