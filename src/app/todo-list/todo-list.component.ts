import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoService } from '../todo.service';
import { Subscription } from 'rxjs';
import { TodoItem } from '../model';
import { ActivatedRoute, Router } from '@angular/router';
import { generateTimeStampId } from '../model';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit, OnDestroy{
  
    // Constructor innitializes all the required services

  constructor(private TodoService: TodoService, private Route: ActivatedRoute,
              private homeRoute: Router) {}
  
  // Owner of the list
  username: string = '';

  // An array of todo items
  todos: TodoItem[] = [];

  // Subscriptions for the activated route (from user-list) and the 
  // todo list behavior subject from the service layer
  private todoSub: Subscription = new Subscription();
  private routeSub: Subscription = new Subscription();
  
  // Variables for two way binding
  newTodoName: string = '';
  newDueDate: Date = new Date();
  showInProgressOnly = false;
  
  // Initialization steps
  ngOnInit(): void {
    // Subscribe to the router parameters and fetch user information
    this.routeSub = this.Route.params.subscribe(params => {
      this.username = params['username'];
      this.TodoService.loadUserTodos(this.username);
    })

    // Subscribe to the service layer to fetch todo items
    this.todoSub = this.TodoService.todos$.subscribe
    (todos => { 
      this.todos = todos;
    });
  }

  // termination steps
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.todoSub.unsubscribe();
  }

  
  // Wrapper function that generates a todo item based on two way binding 
  // and uses the addTodo method from the service layer
  addTodo(): void {
    const newTodo: TodoItem = {
      id: generateTimeStampId(), 
      ItemName: this.newTodoName,
      owner: this.username,
      completed: false,
      dueDate: this.newDueDate,
      status: 'normal'
    };

    this.TodoService.addTodos(newTodo);
    this.newDueDate = new Date()
    this.newTodoName = ''
  }

  // Wrapper function that deletes a todo item using the deleteTodos
  // method from the service layer
  deleteTodo(curTodo: TodoItem): void {
    
    this.TodoService.deleteTodos(curTodo);
  }
  
  // Wrapper function that updates a todo item using the updateTodos
  // method from the service layer
  updateTodo(updatedItem: TodoItem): void {
    this.TodoService.updateTodos(updatedItem)
  }

  // Navigate back to the home route, currently not needed in this project
  // as html provides similar functionalities
  gotoToUsers() {
    this.homeRoute.navigate(['/users'])
  }

  // Changes the display mode based on the user choice
  toggleInProgressFilter(): void {
    this.showInProgressOnly = !this.showInProgressOnly;
  }

  // A getter method that accesses the list of todos based on the display setting
  get filteredTodos(): TodoItem[] {
    // return the filtered todo if the in progress setting is on, and return everything 
    // otherwise
    return this.showInProgressOnly ? this.todos.filter(todo => !todo.completed) : this.todos;
  }

}
