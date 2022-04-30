import { Action, ActionPanel, clearSearchBar, Clipboard, Color, Icon, popToRoot, showHUD, showToast, Toast } from '@raycast/api';
import { ReactElement } from 'react';

import { User } from './users';

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

const SwitchToEditingMode = (props: { switchMode: () => void }): ReactElement => {
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
      <CopyAuthorsAction coauthors={coauthors} />
      <CopyUserAction user={user} />
      <SwitchToEditingMode switchMode={switchMode} />
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
      <CopyAuthorsAction coauthors={coauthors} />
      <CopyUserAction user={user} />
      <SwitchToEditingMode switchMode={switchMode} />
    </ActionPanel>
  )
}

