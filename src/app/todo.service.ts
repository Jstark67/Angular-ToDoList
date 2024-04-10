import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { TodoItem } from './model';



// Dependency Injection that every component within the root module can employ
@Injectable({
  providedIn: 'root'
})


export class TodoService {

  // a behavior subject that stores the array of Todos of a single user 
  // as its current value
  private todoListSubject = new BehaviorSubject<TodoItem[]>([]);
  public todos$ = this.todoListSubject.asObservable()
  private currUser: string = '';

  // loadUserTodos takes a username and retrieves the current set
  // of todos of that user from local storage
  loadUserTodos(username: string): void{
    this.currUser = username
    const todosJson = localStorage.getItem(username);
    let todos;
    if (todosJson) {
      todos = JSON.parse(todosJson);
    } else {
      todos = [];
    }

    // Update the stream after sorting by date
    this.sortTodosByDueDate(todos)
    this.todoListSubject.next(todos)
  }

  // addTodos takes in a todoItem and adds the item into the current 
  // stream if the name is valid and does not already exist
  addTodos(newTodo: TodoItem) {
    // Avoid empty todo name
    if (!newTodo.ItemName.trim() ) {
      alert('Please enter some content for the todo.');
      return
    } 
    
    // Avoid overdue items
    const dateDiff = this.dueDateDiff(newTodo.dueDate)
    if (dateDiff < 0) {
      alert('This due date has passed, please enter a valid due date');
      return
    }
    

    // Avoid duplicate item; duplication evaluated by item name, owner and
    // due date
    
    const todos = this.todoListSubject.getValue()
    const isDupItem = todos.some(item =>
      newTodo.ItemName === item.ItemName &&
      newTodo.owner === item.owner &&
      new Date(item.dueDate).getDate() === new Date(item.dueDate).getDate())
    
    // Update the current stream
    if (!isDupItem) {
      todos.push(newTodo)
      this.sortTodosByDueDate(todos);
      this.todoListSubject.next([...todos])
      this.saveTodos(todos, this.currUser)
    } else {
      console.log("no add")
      alert(`Todo Item "${newTodo.ItemName}" is already assigned and not finished.`);
    }
    
  }

  // dueDateDiff is a private helper method that takes in a due date and returns the 
  // number of days till that due date
  private dueDateDiff(dueDate: Date): number {
    const nowDate = new Date()
    
    // Set for consistent measure
    nowDate.setHours(0,0,0,0)
    const newDate = new Date(dueDate)
    const diffTime = newDate.getTime() - nowDate.getTime()
    const dateDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return dateDiff
  }

  // saveTodos is a private method that takes in a todo item and the owner's username, 
  // and stores it in local storage
  private saveTodos(todos: TodoItem[], username: string): void {
    const usersJson = JSON.stringify(todos);
    localStorage.setItem(username, usersJson);
  }

  // deleteTodos takes in a todoitem and deletes it from the strea,
  deleteTodos(Item: TodoItem) {
    const todos = this.todoListSubject.getValue()
    const newTodos = todos.filter(todos => todos !== Item);

    // Updates the current stream
    this.todoListSubject.next(newTodos)
    this.saveTodos(newTodos, this.currUser)
  }

  // updateTodos takes in a todoitem and updates the item based on 
  // todoId; this method is mainly used for toggle status
  updateTodos(updatedItem: TodoItem) {
    const todos = this.todoListSubject.value
    const index = todos.findIndex(todo => todo.id == updatedItem.id)

    // If the item exists, update the stream
    if (index !== -1) {
      todos[index] = updatedItem
      this.todoListSubject.next(todos)
      this.saveTodos(todos, this.currUser)
    }
  }

  // sortTodosByDueDate is a private helper method that takes in a todo item
  // array and sort it in place in a non-decreasing order based on due dates
  private sortTodosByDueDate(todos: TodoItem[]): void {
    todos.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB; 
    });
  }
  
  

  
}