import { ActionPanel, clearSearchBar, Icon, List, showToast, Toast } from '@raycast/api';
import { useState } from "react";

import { User, avatarUrl, loadUsers } from './users';
import { CoauthorActions, UserActions, SwitchToEditingModeAction } from './committing_actions';

interface Props {
  switchMode: () => void;
}

export default ({switchMode} : Props) => {
  const [coauthors, setCoauthors] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>(loadUsers());

  const removeCoauthor = async (user: User) => {
    setCoauthors(coauthors.filter(u => u !== user));
    setUsers(users.concat(user));
    await clearSearchBar();
  }

  const addCoauthor = async (user: User) => {
    setCoauthors(coauthors.concat(user));
    setUsers(users.filter(u => u !== user));
    await clearSearchBar();
  }

  const onDelete = (user: User) => {
    setCoauthors(coauthors.filter(u => u !== user));
    setUsers(users.filter(u => u !== user));
  }

  return (
    <List actions={<ActionPanel><SwitchToEditingModeAction switchMode={switchMode} /></ActionPanel>}>
      <List.Section title="Co-authors">
        {coauthors.map((coauthor) => (
          <List.Item
            key={coauthor.name}
            title={coauthor.name}
            subtitle={coauthor.email}
            icon={avatarUrl(coauthor)}
            actions={
              <CoauthorActions
                coauthors={coauthors}
                onDelete={onDelete}
                user={coauthor}
                userAction={removeCoauthor}
                switchMode={switchMode}
              />}
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
            actions={
              <UserActions
                coauthors={coauthors}
                onDelete={onDelete}
                user={user}
                userAction={addCoauthor}
                switchMode={switchMode}
              />}
          />
        ))}
      </List.Section>
    </List>
  );
}
