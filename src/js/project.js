// project.js
class Project {
  constructor(id, name) {
      this.id = id;
      this.name = name;
      this.todos = [];
  }

  addTodo(todo) {
      this.todos.push(todo);
  }

  removeTodo(todoId) {
      this.todos = this.todos.filter(todo => todo.id !== todoId);
  }

  getTodo(todoId) {
      return this.todos.find(todo => todo.id === todoId);
  }

  getAllTodos() {
      return [...this.todos];
  }
}

export default Project;