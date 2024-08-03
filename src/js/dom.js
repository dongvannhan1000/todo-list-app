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
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.classList.add('todo-checkbox');
        
        const title = document.createElement('span');
        title.textContent = todo.title;
        title.classList.add('todo-title');
        
        const description = document.createElement('span');
        description.textContent = todo.description;
        description.classList.add('todo-description');
        
        const dueDate = document.createElement('span');
        dueDate.textContent = todo.dueDate || 'Not set';
        dueDate.classList.add('todo-due-date');
        
        const priority = document.createElement('span');
        priority.textContent = todo.priority.toUpperCase();
        priority.classList.add('todo-priority', `priority-${todo.priority}`);
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-todo');
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-todo');
        
        todoElement.append(checkbox, title, description, dueDate, priority, editButton, deleteButton);
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

  bindTodoEvents(container, toggleHandler, editHandler, deleteHandler) {
    container.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            const todoItem = e.target.closest('.todo-item');
            const todoId = todoItem.dataset.todoId;
            toggleHandler(this.currentProjectId, todoId);
        }
    });

    container.addEventListener('click', (e) => {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = todoItem.dataset.todoId;
        
        if (e.target.classList.contains('edit-todo')) {
            editHandler(this.currentProjectId, todoId);
        } else if (e.target.classList.contains('delete-todo')) {
            deleteHandler(this.currentProjectId, todoId);
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