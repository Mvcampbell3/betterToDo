const addProjectBtn = document.getElementById("addProject");
addProjectBtn.addEventListener("click", addProject)

function addProject() {
  const projectPlace = document.getElementById("project");
  const project = projectPlace.value.trim();

  if (project) {
    $.ajax("/api/todo/addProject", { method: "POST", data: { project: project } })
      .then(result => {
        // Run projects to page
        projectPlace.value = "";
        getProjects();
      })
      .catch(err => {
        console.log(err)
      })
  }
}

function getProjects() {
  $.ajax("/api/todo/gettodos", { method: "GET" })
    .then(result => {
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

  // Create Divs for projects
  projects.forEach(project => {
    const newProjectCol = document.createElement("div");
    newProjectCol.classList = "col-lg-6 col-md-6 col-sm-12 newProject p-4 mb-2";

    const newProjectRow = document.createElement("row");
    newProjectRow.classList = "row";

    const newProjectTop = document.createElement("div");
    newProjectTop.classList = "newProjectTop";

    const newProjectHide = document.createElement("button");
    newProjectHide.classList = "hideBtn";
    newProjectHide.innerHTML = project.hide === "true" ? "&#8744" : "&#8743";
    newProjectHide.setAttribute("data-hidden", project.hide);
    newProjectHide.setAttribute("data-project", project.name);
    newProjectHide.addEventListener("click", toggleHide)

    const newProjectDel = document.createElement("button");
    newProjectDel.classList = "delProjectBtn";
    newProjectDel.innerHTML = "&#215"
    newProjectDel.setAttribute("data-project", project.name);
    newProjectDel.addEventListener("click", deleteProject);

    const newProjectBottom = document.createElement("div");
    newProjectBottom.classList = "newProjectBottom";
    newProjectBottom.style.display = project.hide === "true" ? "none" : "block";

    const newProjectCard = document.createElement("div");
    newProjectCard.classList = "col-sm-10 m-auto card p-3 bg-light"

    const newTitle = document.createElement("h4");
    newTitle.textContent = project.name;
    newTitle.classList = "text-center";

    const newInput = document.createElement("div");
    newInput.classList = "input-group";

    const newTodoInput = document.createElement("input");
    newTodoInput.classList = "form-control";
    newTodoInput.setAttribute("name", "todo")
    newTodoInput.setAttribute("placeholder", "Add Todo...");
    newTodoInput.setAttribute("data-project", project.name)

    const newInlineInput = document.createElement("div");
    newInlineInput.classList = "input-group-append";

    const newTodoSubmit = document.createElement("button");
    newTodoSubmit.classList = "btn btn-info";
    newTodoSubmit.textContent = "+";
    newTodoSubmit.addEventListener("click", createTodo)

    newInlineInput.append(newTodoSubmit);

    const newTodoPlace = document.createElement("div");
    newTodoPlace.classList = "newTodoPlace"


    // Todo div and todos below
    const todoProject = todos.filter(todo => todo.project === project.name);
    todoProject.forEach(todo => {

      const newTodo = document.createElement("div");
      newTodo.classList = "myGrid";

      // Put change btn here
      const newTodoFirst = document.createElement("div");
      newTodoFirst.classList = "first";

      // Put task here
      const newTodoSecond = document.createElement("div");
      newTodoSecond.classList = "second";

      // Put del btn here
      const newTodoThird = document.createElement("div");
      newTodoThird.classList = "third";


      const newTodoTask = document.createElement("p");
      newTodoTask.classList = todo.isCompleted ? "card-text strike-through text-dark" : "card-text text-dark";
      newTodoTask.textContent = todo.task;

      const newTodoChangeComplete = document.createElement("button");
      newTodoChangeComplete.classList = todo.isCompleted ? "changeCompleteBtn complete" : "changeCompleteBtn notComplete";
      newTodoChangeComplete.innerHTML = todo.isCompleted ? "&laquo" : "&#10003";
      newTodoChangeComplete.setAttribute("data-todo_id", todo._id);
      newTodoChangeComplete.setAttribute("data-completed", todo.isCompleted);
      newTodoChangeComplete.addEventListener("click", updateCompleted)
      // Update todo completed based on click

      const newDelTodo = document.createElement("button");
      newDelTodo.classList = "taskDelBtn";
      newDelTodo.innerHTML = "&times";
      newDelTodo.setAttribute("data-todo_id", todo._id);
      newDelTodo.addEventListener("click", removeTodo)
      // Delete todo on click

      newTodoFirst.append(newTodoChangeComplete);
      newTodoSecond.append(newTodoTask);
      newTodoThird.append(newDelTodo);

      newTodo.append(newTodoFirst, newTodoSecond, newTodoThird);
      newTodoPlace.append(newTodo);
    })

    newInput.append(newTodoInput, newInlineInput);
    newProjectTop.append(newProjectHide, newTitle, newProjectDel);
    newProjectBottom.append(newInput, newTodoPlace);
    newProjectCard.append(newProjectTop, newProjectBottom);

    newProjectRow.append(newProjectCard)
    newProjectCol.append(newProjectRow);
    outputArea.append(newProjectCol);
  })
}

function createTodo(e) {
  e.preventDefault();
  const inputTask = this.parentElement.previousSibling;
  const newTask = inputTask.value.trim()
  const project = inputTask.dataset.project;

  if (newTask && project) {
    $.ajax("/api/todo/addTodo", { method: "POST", data: { task: newTask, project: project } })
      .then(result => {
        getProjects();
      })
      .catch(err => {
        console.log(err);
      })
  }
}

function removeTodo() {
  const todoID = this.dataset.todo_id;
  $.ajax(`/api/todo/delete/${todoID}`, { method: "DELETE" })
    .then(result => {
      getProjects();
    })
    .catch(err => {
      console.log(err);
    })
}

function toggleHide() {
  if (this.dataset.hidden === "false") {
    $(this.parentElement.nextSibling).slideUp();
    this.innerHTML = "&#8744"
    this.dataset.hidden = "true"
    updateHideDB(this.dataset.project, true)
  } else {
    $(this.parentElement.nextSibling).slideDown();
    this.innerHTML = "&#8743";
    this.dataset.hidden = "false";
    updateHideDB(this.dataset.project, false)
  }
}

function updateHideDB(projectName, hide) {
  $.ajax("/api/user/hideproject", { method: "PUT", data: { projectName, hide } })
    .then(result => {
    })
    .catch(err => {
      console.log(err)
    })
}

function deleteProject() {
  const projectName = this.dataset.project;
  this.parentElement.parentElement.animate([
    { opacity: "1" },
    { opacity: "0" }
  ], {
    duration: 2000,
    fill: "forwards"
  })
  $.ajax("/api/user/deleteproject", { method: "PUT", data: { projectName } })
    .then(result => {
      getProjects();
    })
    .catch(err => console.log(err))
}

function updateCompleted() {
  const todoID = this.dataset.todo_id;
  const completed = this.dataset.completed;

  $.ajax("/api/todo/updatecompleted", { method: "PUT", data: { todoID, completed } })
    .then(result => {
      getProjects();
    })
    .catch(err => console.log(err));
}

getProjects();