// todo.js
class Todo {
  constructor(id, title, description = '', dueDate = null, priority = 'normal', completed = false) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.dueDate = dueDate;
      this.priority = priority;
      this.completed = completed;
  }

  toggleComplete() {
      this.completed = !this.completed;
  }

  update(newData) {
      Object.assign(this, newData);
  }
}

export default Todo;