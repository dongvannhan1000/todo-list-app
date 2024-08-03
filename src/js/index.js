// index.js
import '../css/styles.css';
import { LocalStorage } from './storage.js';
import { ProjectManager, TodoManager } from './controller.js';
import { DOMRenderer, DOMHandler } from './dom.js';

// Initialize storage
const storage = new LocalStorage();

// Initialize managers
const projectManager = new ProjectManager(storage);
const todoManager = new TodoManager(projectManager);

// Initialize DOM handler
const domHandler = new DOMHandler(projectManager, todoManager);

// Load initial data
projectManager.init();

// Render initial projects
const projectContainer = document.getElementById('projects');
DOMRenderer.renderProjects(projectManager.projects, projectContainer);

// Bind events
domHandler.bindProjectEvents(projectContainer, (projectId) => {
    const project = projectManager.getProject(projectId);
    const todoContainer = document.getElementById('todos');
    DOMRenderer.renderTodos(project.getAllTodos(), todoContainer);
});

const todoContainer = document.getElementById('todos');
domHandler.bindTodoEvents(todoContainer,
  (projectId, todoId) => {
      const project = projectManager.getProject(projectId);
      const todo = project.getTodo(todoId);
      todo.toggleComplete();
      projectManager.saveProjects();
      DOMRenderer.renderTodos(project.getAllTodos(), todoContainer);
  },
  (projectId, todoId) => {
      // Implement edit functionality
      console.log('Edit todo:', todoId, 'in project:', projectId);
      // Hiển thị form chỉnh sửa với dữ liệu hiện tại của todo
      // Sau khi chỉnh sửa, cập nhật todo và render lại
  },
  (projectId, todoId) => {
      // Implement delete functionality
      const project = projectManager.getProject(projectId);
      project.removeTodo(todoId);
      projectManager.saveProjects();
      DOMRenderer.renderTodos(project.getAllTodos(), todoContainer);
  }
);

// Bind form events
const newProjectForm = document.getElementById('new-project-form');
const projectNameInput = document.getElementById('project-name');
domHandler.bindNewProjectForm(newProjectForm, projectNameInput);

const newTodoForm = document.getElementById('new-todo-form');
const todoTitleInput = document.getElementById('todo-title');
const todoDescriptionInput = document.getElementById('todo-description');
const todoDueDateInput = document.getElementById('todo-due-date');
const todoPriorityInput = document.getElementById('todo-priority');
domHandler.bindNewTodoForm(newTodoForm, todoTitleInput, todoDescriptionInput, todoDueDateInput, todoPriorityInput);

// Initial render
if (projectManager.projects.length > 0) {
    const firstProject = projectManager.projects[0];
    domHandler.currentProjectId = firstProject.id;
    DOMRenderer.renderTodos(firstProject.getAllTodos(), todoContainer);
}