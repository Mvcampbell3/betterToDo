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
    console.log(project.name, project.hide)
    const newProjectCol = document.createElement("div");
    newProjectCol.classList = "col-lg-4 col-md-6 col-sm-12 newProject p-4 mb-2";

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
    newProjectCard.classList = "col-sm-10 m-auto card p-3"

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
      newTodoTask.classList = "card-text";
      newTodoTask.textContent = todo.task;

      const newTodoChangeComplete = document.createElement("button");
      newTodoChangeComplete.classList = "changeCompleteBtn";
      newTodoChangeComplete.innerHTML = todo.isCompleted ? "&#8592" : "&#10003";
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

function removeTodo() {
  const todoID = this.dataset.todo_id;
  $.ajax(`/api/todo/delete/${todoID}`, { method: "DELETE" })
    .then(result => {
      console.log(result);
      setTimeout(() => {
        getProjects();
      }, 250)
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
      console.log(result);
    })
    .catch(err => {
      console.log(err)
    })
}

function deleteProject() {
  console.log(this.dataset.project)
}

getProjects();