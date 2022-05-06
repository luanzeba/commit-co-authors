import { Action, ActionPanel, clearSearchBar, Clipboard, Color, Icon, popToRoot, showHUD, showToast, Toast } from '@raycast/api';
import { ReactElement } from 'react';

import { deleteUser, User } from './users';

const copyAuthorsToClipboard = async (coauthors: User[]) => {
  const text = coauthorshipText(coauthors);
  if (text) {
    await Clipboard.copy(text);
    await popToRoot({ clearSearchBar: true })
    await showHUD("Authors copied");
  } else {
    await showToast(Toast.Style.Failure, "No authors selected");
  }
}

const coauthorshipText = (coauthors: User[]) => {
  return coauthors.map(coauthor => (
    `Co-authored-by: ${coauthor.name} <${coauthor.email}>`
  )).join('\n');
}

const CopyAuthorsAction = (props: { coauthors: User[] }): ReactElement => {
  const { coauthors } = props;

  return (
    <Action
      title="Copy authors to clipboard"
      onAction={() => copyAuthorsToClipboard(coauthors)}
      icon={{ source: Icon.Clipboard }}
    />
  );
}

const CopyUserAction = (props: { user: User }): ReactElement => {
  const { user } = props;

  return (
    <Action
      title="Copy user to clipboard"
      onAction={() => copyAuthorsToClipboard([user])}
      icon={{ source: Icon.Clipboard, tintColor: Color.Magenta}}
      shortcut={{ key: "y", modifiers: ["cmd"] }}
    />
  );
}

const DeleteUserAction = (props: { user: User, onDelete: (user: User) => void }): ReactElement => {
  const { onDelete, user } = props;

  return (
    <Action
      title="Delete user"
      onAction={async () => {
        try {
          deleteUser(user);
          onDelete(user);
          await showToast(Toast.Style.Success, "User deleted");
          await clearSearchBar();
        } catch (e) {
          await showToast(Toast.Style.Failure, "User could not be deleted", String(e));
        }
      }}
      icon={{ source: Icon.Trash }}
      shortcut={{ key: "d", modifiers: ["cmd"] }}
    />
  );
}

const SwitchToEditingModeAction = (props: { switchMode: () => void }): ReactElement => {
  const { switchMode } = props;

  return(
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
  );
};

interface ActionsProps {
  coauthors: User[];
  onDelete: (user: User) => void;
  user: User;
  userAction: (coauthor: User) => void;
  switchMode: () => void;
}

export const SelectedCoauthorActions = ({coauthors, onDelete, user, userAction, switchMode}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <Action
        title="Remove from list"
        icon={{ source: Icon.Trash, tintColor: Color.Red }}
        onAction={() => userAction(user)}
        shortcut={{ modifiers: ["cmd"], key: "d" }}
      />
      <CopyAuthorsAction coauthors={coauthors} />
      <CopyUserAction user={user} />
      <DeleteUserAction user={user} onDelete={onDelete} />
      <SwitchToEditingModeAction switchMode={switchMode} />
    </ActionPanel>
  )
}

export const UnselectedCoauthorActions = ({coauthors, onDelete, user, userAction, switchMode}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <Action
        title="Add to list"
        icon={{ source: Icon.Plus, tintColor: Color.Green }}
        onAction={() => userAction(user)}
        shortcut={{ modifiers: ["cmd"], key: "a" }}
      />
      <CopyAuthorsAction coauthors={coauthors} />
      <CopyUserAction user={user} />
      <DeleteUserAction user={user} onDelete={onDelete} />
      <SwitchToEditingModeAction switchMode={switchMode} />
    </ActionPanel>
  )
}

