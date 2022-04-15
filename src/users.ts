import { environment } from '@raycast/api'
import fs from "fs";

const USERS_FILE = `${environment.supportPath}/coauthors.json`;

export interface User {
  name: string;
  handle: string;
  email: string;
}

export const loadUsers = () : User[] => {
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
