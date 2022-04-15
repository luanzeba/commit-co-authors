import { List, environment} from '@raycast/api'
import { useState } from "react";
import fs from "fs";

import { User, avatarUrl, loadUsers } from './users';
import { SelectedCoauthorActions, UnselectedCoauthorActions } from './actions';


export default function Command() {
  const [coauthors, setCoauthors] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>(loadUsers());

  const removeCoauthor = (user: User) => {
    setCoauthors(coauthors.filter(u => u !== user));
    setUsers(users.concat(user));
  }

  const addCoauthor = (user: User) => {
    setCoauthors(coauthors.concat(user));
    setUsers(users.filter(u => u !== user));
  }

  return (
    <List>
      <List.Section title="Co-authors">
        {coauthors.map((coauthor) => (
          <List.Item
            key={coauthor.name}
            title={coauthor.name}
            subtitle={coauthor.email}
            icon={avatarUrl(coauthor)}
            actions={<SelectedCoauthorActions coauthors={coauthors} user={coauthor} userAction={removeCoauthor} />}
          />
        ))}
      </List.Section>
      <List.Section title="Possible co-authors">
        {users.map((user) => (
          <List.Item
            key={user.name}
            title={user.name}
            subtitle={user.email}
            icon={avatarUrl(user)}
            actions={<UnselectedCoauthorActions coauthors={coauthors} user={user} userAction={addCoauthor} />}
          />
        ))}
      </List.Section>
    </List>
  );
}
