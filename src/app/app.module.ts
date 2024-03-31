import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from './user.service';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoStatusDirective } from './todo-status.directive';


@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    TodoListComponent,
    TodoItemComponent,
    TodoStatusDirective,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgFor,
    FormsModule
  ],
  providers: [
    provideClientHydration(),
    UserService,
    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
