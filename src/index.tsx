import { Action, ActionPanel, Color, Icon, List } from '@raycast/api'
import { useState, ReactElement } from "react";

interface User {
  name: string;
  handle: string;
  email: string;
}

function avatarUrl(user: User) {
  return `https://www.github.com/${user.handle}.png`;
}

export default function Command() {
  const [coauthors, setcoauthors] = useState<User[]>([
    { name: "Alice", handle: "alice", email: "alice@hi.com" },
    { name: "Bob", handle: "bob", email: "bob@hey.com" },
  ]);

  const removeCoauthor = (user: User) => {
    setcoauthors(coauthors.filter(u => u !== user));
  }

  return (
    <List>
      {coauthors.map((user) => (
        <List.Item
          key={user.name}
          title={user.name}
          subtitle={user.email}
          icon={avatarUrl(user)}
          actions={<Actions coauthor={user} removeCoauthor={removeCoauthor} />}
        />
      ))}
    </List>
  );
}

interface ActionsProps {
  coauthor: User;
  removeCoauthor: (coauthor: User) => void;
}

function Actions({coauthor, removeCoauthor}: ActionsProps): ReactElement {
  return (
    <ActionPanel>
      <Action
        title="Remove from list"
        icon={{ source: Icon.Trash, tintColor: Color.Red }}
        onAction={() => removeCoauthor(coauthor)}
        shortcut={{ modifiers: ["cmd"], key: "d" }}
      />
    </ActionPanel>
  )
}

