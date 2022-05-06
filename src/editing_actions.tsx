import { Action, ActionPanel, clearSearchBar, Form, Icon, showToast, Toast } from "@raycast/api";
import { MutableRefObject, ReactElement } from "react";

import { createUser, User } from "./users";

interface ActionProps {
  refs: MutableRefObject<Form.TextField>[];
  switchMode: () => void;
}

export const AddUserActions = ({refs, switchMode}: ActionProps): ReactElement => {
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
      title: "Adding user...",
    });

    try {
      createUser(values);

      toast.style = Toast.Style.Success;
      toast.title = "User added";
      refs.forEach((ref) => ref.current?.reset());
      refs.at(0)?.current?.focus();
    } catch (error) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to add user";
      toast.message = String(error);
    }
  }

  return (
    <ActionPanel>
      <Action.SubmitForm
        icon={Icon.Upload}
        title="Add user"
        onSubmit={handleSubmit}
      />
      <Action
        title={"Switch to committing mode"}
        onAction={async () => {
          await showToast(Toast.Style.Success, "Switched to committing mode.");
          switchMode();
          await clearSearchBar();
        }}
        icon={{ source: Icon.Person }}
        shortcut={{ key: "s", modifiers: ["cmd"] }}
      />
    </ActionPanel>
  );
}

