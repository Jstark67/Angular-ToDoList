import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoItem } from '../model';
import { TodoStatusDirective } from '../todo-status.directive';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  
  // Inputs from the parent component (todo-list)
  @Input() todoItem!: TodoItem;
  @Input() appTodoStatus!: TodoItem; // Used to monitor the status of the current item 
                                     // through the attribute directive


  // Outputs to the parent component (todo-list)
  @Output() delete = new EventEmitter<TodoItem>();
  @Output() update = new EventEmitter<TodoItem>();
  

  onDelete(): void {
    this.delete.emit(this.todoItem)
  }
  
  onStatusChange(): void {
    this.update.emit(this.todoItem)
  }


}
