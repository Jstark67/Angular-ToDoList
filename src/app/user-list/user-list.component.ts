import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';
import { User } from '../model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy{
  
  // Constructor innitializes all the required services
  constructor(private userService: UserService, private router: Router) {}
  
  // Subscription ready to be subscribed to the users behavior subject
  private subscription: Subscription = new Subscription();
  
  // Mutable strings for two way binding
  newUsername: string = '';
  editUsername: string = '';
  editedUsername: string = '';
  
  // An array of users
  users: User[] = [];

  // Initialization steps
  ngOnInit(): void {
    // Subscribe to the users observable in the service layer upon component initiation
    this.subscription.add(
      this.userService.users$.subscribe(users => 
        this.users = users
        ));
  }

  // Termination steps
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Wrapper function to call addUser from the service layer
  addUser() {
    this.userService.addUser(this.newUsername);
    this.newUsername = ''; // Clear the input field
  }

  // Wrapper function to call deleteUser from the service layer
  deleteUser(name: string) {
    this.userService.deleteUser(name);
  }

  // Wrapper function to call updateUser from the service layer
  updateUser(oldName: string, newName: string) {
    this.userService.updateUser(oldName, newName);
    this.editUsername = ''; // Clear the input field
  }

  // Go to a user's todo list page
  gotoTodoList(username: string) {
    this.router.navigate(['/users', username, 'todos'])
  }
}
