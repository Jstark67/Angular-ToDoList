// Model for an user
export interface User {
  id: number
  username: string
}

// Model for an user's todoitem
export interface TodoItem {
  id: number
  ItemName: string
  owner: string
  completed: boolean
  dueDate: Date;
  // status: 'due-soon' | 'overdue' | 'normal';
}

// A random ID generator based on the creat time
export function generateTimeStampId() {
  const now = Date.now(); 
  const randomSuffix = Math.floor(Math.random() * 100); 
  return Number(`${now}${randomSuffix}`);
}