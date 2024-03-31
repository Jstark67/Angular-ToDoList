import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TodoItem } from './model';
@Directive({
  selector: '[appTodoStatus]'
})

// An attribute directive used to render different colors for todo items based 
// on their completion and due date status
export class TodoStatusDirective implements OnChanges {
  @Input() appTodoStatus!: TodoItem;
  @Input() status!: 'due-soon' | 'overdue' | 'normal';
  @Input() completed!: boolean;

  // Initializes required builtin services
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  // Sets the background color of the html element when conditions are met
  ngOnChanges(changes: SimpleChanges): void {
    if (this.completed) {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "lightgreen")
    } else if (this.status == 'normal') {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "white")
    } else if (this.status == 'due-soon') {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "orange")
    } else {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "red")
    }
  }
}

  

