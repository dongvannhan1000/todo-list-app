// dom.js
class DOMRenderer {
  static renderProjects(projects, container, selectedProjectId) {
    container.innerHTML = '';
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.textContent = project.name;
        projectElement.dataset.projectId = project.id;
        projectElement.classList.add('project-item');
        if (project.id === selectedProjectId) {
            projectElement.classList.add('selected');
        }
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
      this.editTodoModal = document.getElementById('edit-todo-modal');
			this.editTodoForm = document.getElementById('edit-todo-form');
			this.editTodoTitle = document.getElementById('edit-todo-title');
			this.editTodoDescription = document.getElementById('edit-todo-description');
			this.editTodoDueDate = document.getElementById('edit-todo-due-date');
			this.editTodoPriority = document.getElementById('edit-todo-priority');
  }

  bindProjectEvents(container, selectHandler) {
    container.addEventListener('click', (e) => {
        const projectItem = e.target.closest('.project-item');
        if (projectItem) {
            this.currentProjectId = projectItem.dataset.projectId;
            
            // Remove 'selected' class from all projects
            container.querySelectorAll('.project-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add 'selected' class to the clicked project
            projectItem.classList.add('selected');
            
            selectHandler(this.currentProjectId);
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
				const project = this.projectManager.getProject(this.currentProjectId);
				const todo = project.getTodo(todoId);
				this.showEditTodoModal(todo);
				this.bindEditTodoForm((updatedTodo) => {
					editHandler(this.currentProjectId, todoId, updatedTodo);
				});
			} else if (e.target.classList.contains('delete-todo')) {
				deleteHandler(this.currentProjectId, todoId);
			}
		});
  }

  bindNewProjectForm(form, nameInput) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const projectName = nameInput.value;
        const newProject = this.projectManager.createProject(projectName);
        this.currentProjectId = newProject.id;
        DOMRenderer.renderProjects(this.projectManager.projects, document.getElementById('projects'), this.currentProjectId);
        nameInput.value = '';
        
        // Render todos of the new project (which will be empty)
        const todoContainer = document.getElementById('todos');
        DOMRenderer.renderTodos(newProject.getAllTodos(), todoContainer);
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

	showEditTodoModal(todo) {
    this.editTodoTitle.value = todo.title;
    this.editTodoDescription.value = todo.description;
    this.editTodoDueDate.value = todo.dueDate || '';
    this.editTodoPriority.value = todo.priority;
    this.editTodoModal.style.display = 'block';
  }

  hideEditTodoModal() {
    this.editTodoModal.style.display = 'none';
  }

  bindEditTodoForm(submitHandler) {
    this.editTodoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedTodo = {
        title: this.editTodoTitle.value,
        description: this.editTodoDescription.value,
        dueDate: this.editTodoDueDate.value,
        priority: this.editTodoPriority.value
      };
      submitHandler(updatedTodo);
      this.hideEditTodoModal();
    });

    const closeBtn = this.editTodoModal.querySelector('.close');
    closeBtn.addEventListener('click', () => this.hideEditTodoModal());
  }
}

export { DOMRenderer, DOMHandler };