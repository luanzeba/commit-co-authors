import { ActionPanel, clearSearchBar, List } from "@raycast/api";
import { useState } from "react";

import { User, avatarUrl, loadUsers } from "./users";
import { CoauthorActionPanel, UserActionPanel, CreateUserAction } from "./user_list_actions";

export default () => {
  const [coauthors, setCoauthors] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>(loadUsers());

  const removeCoauthor = async (user: User) => {
    setCoauthors(coauthors.filter((u) => u !== user));
    setUsers(users.concat(user));
    await clearSearchBar();
  };

  const addCoauthor = async (user: User) => {
    setCoauthors(coauthors.concat(user));
    setUsers(users.filter((u) => u !== user));
    await clearSearchBar();
  };

  const onDelete = (user: User) => {
    setCoauthors(coauthors.filter((u) => u !== user));
    setUsers(users.filter((u) => u !== user));
  };

  return (
    <List
      actions={
        <ActionPanel>
          <CreateUserAction />
        </ActionPanel>
      }
    >
      <List.Section title="Co-authors">
        {coauthors.map((coauthor) => (
          <List.Item
            key={coauthor.name}
            title={coauthor.name}
            subtitle={coauthor.email}
            icon={avatarUrl(coauthor)}
            actions={
              <CoauthorActionPanel
                coauthors={coauthors}
                onDelete={onDelete}
                user={coauthor}
                userAction={removeCoauthor}
              />
            }
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
            actions={<UserActionPanel coauthors={coauthors} onDelete={onDelete} user={user} userAction={addCoauthor} />}
          />
        ))}
      </List.Section>
    </List>
  );
};
