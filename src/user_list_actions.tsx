import { Action, ActionPanel, clearSearchBar, Clipboard, Color, Icon, popToRoot, showHUD, showToast, Toast, useNavigation } from '@raycast/api';
import { ReactElement } from 'react';

import { deleteUser, User } from './users';
import CreateUserForm from './create_user_form';
import EditUserForm from './edit_user_form';

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

export const CreateUserAction = (): ReactElement => {
  const { push } = useNavigation();

  return (
    <Action
      title={"Create new user"}
      onAction={async () => {
        push(<CreateUserForm />);
        await clearSearchBar();
      }}
      icon={{ source: Icon.Plus }}
      shortcut={{ key: "i", modifiers: ["cmd"] }}
    />
  );
};

export const EditUserAction = (props: { user: User }): ReactElement => {
  const { push } = useNavigation();

  return (
    <Action
      title={"Edit user"}
      onAction={async () => {
        push(<EditUserForm user={props.user} />);
        await clearSearchBar();
      }}
      icon={{ source: Icon.Pencil }}
      shortcut={{ key: "e", modifiers: ["cmd"] }}
    />
  );
};

interface ActionsProps {
  coauthors: User[];
  onDelete: (user: User) => void;
  user: User;
  userAction: (coauthor: User) => void;
}

export const CoauthorActionPanel = ({coauthors, onDelete, user, userAction}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <ActionPanel.Section title="Copy">
        <Action
          title="Remove from coauthor list"
          icon={{ source: Icon.Trash, tintColor: Color.Red }}
          onAction={() => userAction(user)}
          shortcut={{ modifiers: ["cmd"], key: "d" }}
        />
        <CopyAuthorsAction coauthors={coauthors} />
        <CopyUserAction user={user} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Edit">
        <DeleteUserAction user={user} onDelete={onDelete} />
        <CreateUserAction />
        <EditUserAction user={user} />
      </ActionPanel.Section>
    </ActionPanel>
  )
}

export const UserActionPanel = ({coauthors, onDelete, user, userAction}: ActionsProps): ReactElement => {
  return (
    <ActionPanel>
      <ActionPanel.Section title="Copy">
        <Action
          title="Add to coauthor list"
          icon={{ source: Icon.Plus, tintColor: Color.Green }}
          onAction={() => userAction(user)}
          shortcut={{ modifiers: ["cmd"], key: "a" }}
        />
        <CopyAuthorsAction coauthors={coauthors} />
        <CopyUserAction user={user} />
      </ActionPanel.Section>
      <ActionPanel.Section title="Edit">
        <DeleteUserAction user={user} onDelete={onDelete} />
        <CreateUserAction />
        <EditUserAction user={user} />
      </ActionPanel.Section>
    </ActionPanel>
  )
}

