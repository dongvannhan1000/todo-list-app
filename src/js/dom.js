// dom.js
class DOMRenderer {
  static renderProjects(projects, container) {
      container.innerHTML = '';
      projects.forEach(project => {
          const projectElement = document.createElement('div');
          projectElement.textContent = project.name;
          projectElement.dataset.projectId = project.id;
          projectElement.classList.add('project-item');
          container.appendChild(projectElement);
      });
  }

  static renderTodos(todos, container) {
      container.innerHTML = '';
      todos.forEach(todo => {
          const todoElement = document.createElement('div');
          todoElement.classList.add('todo-item');
          todoElement.dataset.todoId = todo.id;
          
          const title = document.createElement('h3');
          title.textContent = todo.title;
          
          const description = document.createElement('p');
          description.textContent = todo.description;
          
          const dueDate = document.createElement('p');
          dueDate.textContent = `Due: ${todo.dueDate || 'Not set'}`;
          
          const priority = document.createElement('p');
          priority.textContent = `Priority: ${todo.priority}`;
          priority.classList.add(`priority-${todo.priority}`);
          
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = todo.completed;
          
          todoElement.append(checkbox, title, description, dueDate, priority);
          container.appendChild(todoElement);
      });
  }
}

class DOMHandler {
  constructor(projectManager, todoManager) {
      this.projectManager = projectManager;
      this.todoManager = todoManager;
      this.currentProjectId = null;
  }

  bindProjectEvents(container, selectHandler) {
      container.addEventListener('click', (e) => {
          const projectItem = e.target.closest('.project-item');
          if (projectItem) {
              this.currentProjectId = projectItem.dataset.projectId;
              selectHandler(this.currentProjectId);
              
              // Highlight selected project
              container.querySelectorAll('.project-item').forEach(item => {
                  item.classList.remove('selected');
              });
              projectItem.classList.add('selected');
          }
      });
  }

  bindTodoEvents(container, toggleHandler, editHandler) {
      container.addEventListener('change', (e) => {
          if (e.target.type === 'checkbox') {
              const todoItem = e.target.closest('.todo-item');
              const todoId = todoItem.dataset.todoId;
              toggleHandler(this.currentProjectId, todoId);
          }
      });

      container.addEventListener('click', (e) => {
          if (e.target.classList.contains('edit-todo')) {
              const todoItem = e.target.closest('.todo-item');
              const todoId = todoItem.dataset.todoId;
              editHandler(this.currentProjectId, todoId);
          }
      });
  }

  bindNewProjectForm(form, nameInput) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          const projectName = nameInput.value;
          this.projectManager.createProject(projectName);
          DOMRenderer.renderProjects(this.projectManager.projects, document.getElementById('projects'));
          nameInput.value = '';
      });
  }

  bindNewTodoForm(form, titleInput, descriptionInput, dueDateInput, priorityInput) {
      form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (!this.currentProjectId) {
              alert('Please select a project first');
              return;
          }
          const todoData = {
              title: titleInput.value,
              description: descriptionInput.value,
              dueDate: dueDateInput.value,
              priority: priorityInput.value
          };
          this.todoManager.createTodo(this.currentProjectId, todoData);
          const currentProject = this.projectManager.getProject(this.currentProjectId);
          DOMRenderer.renderTodos(currentProject.getAllTodos(), document.getElementById('todos'));
          form.reset();
      });
  }

  getCurrentProjectId() {
      // This method should be implemented to return the id of the currently selected project
      // For example, you could store it in a data attribute on a container element
      return document.querySelector('.current-project').dataset.projectId;
  }
}

export { DOMRenderer, DOMHandler };