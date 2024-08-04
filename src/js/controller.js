// controller.js
import Project from './project';
import Todo from './todo';

class ProjectManager {
    constructor(storage) {
        this.storage = storage;
        this.projects = [];
    }

    init() {
        this.loadProjects();
    }

    createProject(name) {
        const id = Date.now().toString();
        const project = new Project(id, name);
        this.projects.push(project);
        this.saveProjects();
        return project;
    }

    getProject(id) {
        return this.projects.find(project => project.id === id);
    }

    loadProjects() {
        const projectsData = this.storage.getData('projects');
        if (projectsData) {
            this.projects = projectsData.map(data => {
                const project = new Project(data.id, data.name);
                project.todos = data.todos.map(todoData => new Todo(todoData.id, todoData.title, todoData.description, todoData.dueDate, todoData.priority, todoData.completed));
                return project;
            });
        }
    }

    saveProjects() {
        this.storage.saveData('projects', this.projects);
    }

    renameProject(projectId, newName) {
      const project = this.getProject(projectId);
      if (project) {
          project.name = newName;
          this.saveProjects();
      }
    }

    deleteProject(projectId) {
        this.projects = this.projects.filter(project => project.id !== projectId);
        this.saveProjects();
    }
}

class TodoManager {
    constructor(projectManager) {
        this.projectManager = projectManager;
    }

    createTodo(projectId, todoData) {
        const project = this.projectManager.getProject(projectId);
        if (project) {
            const id = Date.now().toString();
            const todo = new Todo(id, todoData.title, todoData.description, todoData.dueDate, todoData.priority);
            project.addTodo(todo);
            this.projectManager.saveProjects();
            return todo;
        }
        return null;
    }

    updateTodo(projectId, todoId, newData) {
        const project = this.projectManager.getProject(projectId);
        if (project) {
            const todo = project.getTodo(todoId);
            if (todo) {
                todo.update(newData);
                this.projectManager.saveProjects();
                return todo;
            }
        }
        return null;
    }

    deleteTodo(projectId, todoId) {
        const project = this.projectManager.getProject(projectId);
        if (project) {
            project.removeTodo(todoId);
            this.projectManager.saveProjects();
            return true;
        }
        return false;
    }
}

export { ProjectManager, TodoManager };