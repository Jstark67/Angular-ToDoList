import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { TodoListComponent } from './todo-list/todo-list.component';

const routes: Routes = [
  // Root route
  { path: 'users', component: UserListComponent },
  // Todo List Route
  { path: 'users/:username/todos', component: TodoListComponent },
  // Return to users route
  { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
