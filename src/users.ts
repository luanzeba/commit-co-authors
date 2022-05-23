import { environment } from '@raycast/api'
import fs from "fs";

const USERS_FILE = `${environment.supportPath}/coauthors.json`;

// TODO: Create a User class
export interface User {
  name: string;
  handle: string;
  email: string;
}

const findByHandle = (handle: string): User | undefined => {
  const users = loadUsers();
  return users.find(user => user.handle === handle);
}

export const createUser = (user: User): User => {
  const newUsers = [...loadUsers(), user];
  fs.writeFileSync(USERS_FILE, JSON.stringify(newUsers));
  return user;
}

export const deleteUser = (user: User): User => {
  const newUsers = loadUsers().filter(u => u.handle !== user.handle);
  fs.writeFileSync(USERS_FILE, JSON.stringify(newUsers));
  return user;
}

export const editUser = (user: User, oldHandle: string): User => {
  const oldUser = findByHandle(oldHandle);
  oldUser && deleteUser(oldUser);
  createUser(user);
  return user;
}

export const loadUsers = (): User[] => {
  try {
    const users = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(users);
  } catch (_e) {
    fs.mkdirSync(environment.supportPath, { recursive: true });
    return [];
  }
}

export const avatarUrl = (user: User) => {
  return `https://www.github.com/${user.handle}.png`;
}

