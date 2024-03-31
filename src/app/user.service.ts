import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { User } from './model';
import { generateTimeStampId } from './model'

// Local Storage Key for Users
const USERS_STORAGE_KEY = 'users';

@Injectable({
  providedIn: 'root'
})


export class UserService {

  // a behavior subject that stores the array of Users as its current value
  private userListSubject = new BehaviorSubject<User[]>(this.loadInitialUsers());
  public users$ = this.userListSubject.asObservable()
  
  // loadInitialUsers is a private method that retrieves the current set
  // of users from local storage
  private loadInitialUsers(): User[] {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    if (usersJson) {
      try {
        return JSON.parse(usersJson);
      } catch (e) {
        console.error('Error parsing users JSON:', e);
        return [];
      }
    }
    return [];
  }

  // saveUsers is a private method that takes in a user array and stores
  // it (or replaces) in local storage
  private saveUsers(users: User[]): void {
    const usersJson = JSON.stringify(users);
    localStorage.setItem(USERS_STORAGE_KEY, usersJson);
  }

  // addUser takes in a username string and adds the user into the current 
  // stream if the name is valid and does not already exist
  addUser(name: string) {
    // Avoid empty username
    const trimmedName = name.trim();
    if (!trimmedName) {
      alert(`Username cannot be empty`);
      return;
    }
    
    // Checks whether the username is a duplicate
    const isDupName = this.userListSubject.value.find(
                           user => user.username.toLowerCase() 
                           === trimmedName.toLowerCase())
    
    // Updates the current stream
    if (!isDupName) {
      const newUser: User = { id: generateTimeStampId(), username: name}
      this.userListSubject.next([...this.userListSubject.value, newUser])
      this.saveUsers([...this.userListSubject.value])
    } else {
      alert(`Username "${trimmedName}" is already taken.`);
    }
    
  }

  // deleteUser takes in a username string and deletes this user from the 
  // stream if it exists
  deleteUser(name: string) {
    const trimmedName = name.trim();
    const currentUsers = this.userListSubject.value;
    
    // Removes the user through filter
    const updatedUsers = currentUsers.filter(user => 
                                            user.username.toLowerCase() 
                                            !== trimmedName.toLowerCase());
    
    // Update the current Stream
    this.userListSubject.next(updatedUsers);
    this.saveUsers(updatedUsers)

    // Removes this user's todo list
    localStorage.removeItem(name)
  }

  // updateUser takes in an old username string and a new username string, 
  // and updates the user with the old username using the new username
  updateUser(oldName: string, newName: string) {
    // Avoid trivial update
    if (oldName == newName) {
      alert(`You cannot update a user using an identical username`)
      return
    }
    
    // Avoid empty username
    const oldtrimmedName = oldName.trim();
    const newtrimmedName = newName.trim();
    if (!newtrimmedName) {
      alert(`You cannot update a user using an empty username`)
      return
    }

    // Avoid duplicate update
    const currentUsers = this.userListSubject.value;
    const checkExist = currentUsers.find(user => user.username.toLowerCase()
                                        === newtrimmedName.toLowerCase())
    if (checkExist) {
      alert(`You cannot update a user using an existing username`)
      return
    }
    
    // Update the current stream
    const targetUser = currentUsers.find(user => user.username.toLowerCase()
                                         === oldtrimmedName.toLowerCase())
    if (targetUser) {
      const indexofT = currentUsers.indexOf(targetUser)
      currentUsers[indexofT].username = newtrimmedName
      this.saveUsers(currentUsers)
    } else {
      // This is technically not needed for this situation since the update 
      // operation is guranteed to have a valid old username as input
      alert(`Username "${oldName}" does not exist.`);
    }
    
    // Transfer the todolist of the old user to the new user
    const data = localStorage.getItem(oldName);
    if (data !== null) {
      localStorage.setItem(newName, data);
      localStorage.removeItem(oldName);
    }

  }
  
}