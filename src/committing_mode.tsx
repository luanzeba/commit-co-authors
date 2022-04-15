import { Action, ActionPanel, clearSearchBar, Icon, List, showToast, Toast } from '@raycast/api'
import { ReactElement, useState } from "react";

import { User, avatarUrl, loadUsers } from './users';
import { SelectedCoauthorActions, UnselectedCoauthorActions } from './committing_actions';

interface Props {
  switchMode: () => void;
}

export default ({switchMode} : Props) => {
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
    <List actions={<SwitchModeAction switchMode={switchMode} />}>
      <List.Section title="Co-authors">
        {coauthors.map((coauthor) => (
          <List.Item
            key={coauthor.name}
            title={coauthor.name}
            subtitle={coauthor.email}
            icon={avatarUrl(coauthor)}
            actions={
              <SelectedCoauthorActions
                coauthors={coauthors}
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
              <UnselectedCoauthorActions
                coauthors={coauthors}
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

// TODO: Extract this elsewhere
const SwitchModeAction = ({switchMode}: Props): ReactElement => (
  <ActionPanel>
    <Action
      title={"Switch to editing mode"}
      onAction={async () => {
        await showToast(Toast.Style.Success, "Switched to editing mode.");
        switchMode();
        await clearSearchBar();
      }}
      icon={{ source: Icon.Pencil }}
      shortcut={{ key: "s", modifiers: ["cmd"] }}
    />
  </ActionPanel>
);

