import { Directive, ElementRef, Input, OnInit, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { TodoItem } from './model';
@Directive({
  selector: '[appTodoStatus]'
})

// An attribute directive used to render different colors for todo items based 
// on their completion and due date status
export class TodoStatusDirective implements OnInit, OnChanges {
  @Input() appTodoStatus!: TodoItem;
  @Input() dueDate!: Date;
  @Input() completed!: boolean;

  // Initializes required builtin services
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  handleRender(): void {
    const curr = new Date()
    const ddl = new Date(this.dueDate)
    const diffTime = ddl.getTime() - curr.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (this.completed) {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "lightgreen")
    } else if (diffDays >= 5) {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "white")
    } else if (diffDays >= 0) {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "orange")
    } else {
      this.renderer.setStyle(this.el.nativeElement, "backgroundColor", "red")
    }
  }
  // Sets the background color of the html element when conditions are met
  ngOnInit(): void {
   this.handleRender()
  }

  ngOnChanges(): void {
    this.handleRender()
  }
}

  

