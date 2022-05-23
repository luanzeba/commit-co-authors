import { Action, ActionPanel, clearSearchBar, Form, Icon, showToast, Toast, useNavigation } from "@raycast/api";
import { ReactElement } from "react";

import UserList from './user_list';
import { createUser, editUser, User } from "./users";

interface PanelProps {
  animatedText: string;
  successText: string;
  errorText: string;
  submitText: string;
  submitAction: (user: User) => User;
}

const UserFormActionPanel = ({animatedText, successText, errorText, submitText, submitAction}: PanelProps): ReactElement => {
  const { pop, push } = useNavigation();

  async function handleSubmit(values: User) {
    if (!values.name || !values.handle || !values.email) {
      showToast({
        style: Toast.Style.Failure,
        title: "Missing required fields",
      });
      return;
    }

    const toast = await showToast({
      style: Toast.Style.Animated,
      title: animatedText,
    });

    try {
      submitAction(values);

      toast.style = Toast.Style.Success;
      toast.title = successText;
      // hack to force the user list to update 😢
      pop();
      push(<UserList />);
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = errorText;
      toast.message = String(error);
    }
  }

  return (
    <ActionPanel>
      <Action.SubmitForm
        icon={Icon.Upload}
        title={submitText}
        onSubmit={handleSubmit}
      />
      <Action
        title={"Go to user list"}
        onAction={async () => {
          push(<UserList />);
          await clearSearchBar();
        }}
        icon={{ source: Icon.Person }}
        shortcut={{ key: "l", modifiers: ["cmd"] }}
      />
    </ActionPanel>
  );
}

export const CreateUserActionPanel = (): ReactElement => (
    <UserFormActionPanel
      animatedText="Adding user..."
      successText="User added"
      errorText="Failed to add user"
      submitText="Add user"
      submitAction={createUser}
    />
);

export const EditUserActionPanel = (props: { oldHandle: string }): ReactElement => {
  const { oldHandle } = props;

  return (
    <UserFormActionPanel
      animatedText="Updating user..."
      successText="User updated"
      errorText="Failed to update user"
      submitText="Update user"
      submitAction={(values) => editUser(values, oldHandle)}
    />
  )
};

