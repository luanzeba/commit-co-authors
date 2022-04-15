import { Action, ActionPanel, clearSearchBar, Clipboard, Color, Icon, showToast, Toast } from '@raycast/api'
import { ReactElement } from 'react';

import { User } from './users';

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
  switchMode: () => void;
}

export const SelectedCoauthorActions = ({coauthors, user, userAction, switchMode}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <Action
        title="Remove from list"
        icon={{ source: Icon.Trash, tintColor: Color.Red }}
        onAction={() => userAction(user)}
        shortcut={{ modifiers: ["cmd"], key: "d" }}
      />
      <Action
        title="Copy authors to clipboard"
        onAction={() => copy(coauthorshipText(coauthors))}
        icon={{ source: Icon.Clipboard }}
      />
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
  )
}

export const UnselectedCoauthorActions = ({coauthors, user, userAction, switchMode}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <Action
        title="Add to list"
        icon={{ source: Icon.Plus, tintColor: Color.Green }}
        onAction={() => userAction(user)}
        shortcut={{ modifiers: ["cmd"], key: "a" }}
      />
      <Action
        title="Copy authors to clipboard"
        onAction={() => copy(coauthorshipText(coauthors))}
        icon={{ source: Icon.Clipboard }}
      />
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
  )
}

