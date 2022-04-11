import { Action, ActionPanel, Clipboard, Color, Icon, List } from '@raycast/api'
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
  const [coauthors, setCoauthors] = useState<User[]>([]);
  const [users, _setusers] = useState<User[]>([
    { name: "Alice", handle: "alice", email: "alice@hi.com" },
    { name: "Bob", handle: "bob", email: "bob@hey.com" },
  ]);

  const removeCoauthor = (user: User) => {
    setCoauthors(coauthors.filter(u => u !== user));
  }

  const addCoauthor = (user: User) => {
    setCoauthors(coauthors.concat(user));
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
            actions={<Actions coauthors={coauthors} user={coauthor} userAction={removeCoauthor} />}
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
            actions={<Actions coauthors={coauthors} user={user} userAction={addCoauthor} />}
          />
        ))}
      </List.Section>
    </List>
  );
}

const copy = async (text: string) => {
  await Clipboard.copy(text);
}

const coauthorshipText = (coauthors: User[]) => {
  return coauthors.map(coauthor => (
    `Co-authored-by: ${coauthor.name} <${coauthor.email}>`
  )).join('\n');
}

interface ActionsProps {
  coauthors: User[];
  user: User;
  userAction: (coauthor: User) => void;
}

function Actions({coauthors, user, userAction}: ActionsProps): ReactElement {
  return (
    <ActionPanel>
      <Action
        title="Copy to clipboard"
        onAction={() => copy(coauthorshipText(coauthors))}
      />
      <Action
        title="Remove from list"
        icon={{ source: Icon.Trash, tintColor: Color.Red }}
        onAction={() => userAction(user)}
        shortcut={{ modifiers: ["cmd"], key: "d" }}
      />
    </ActionPanel>
  )
}

