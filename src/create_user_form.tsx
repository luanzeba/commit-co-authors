import { Form } from "@raycast/api";

import { CreateUserActionPanel } from "./user_form_actions";

export default () => {
  return (
    <Form actions={<CreateUserActionPanel />}>
      <Form.TextField id="name" title="Name" />
      <Form.TextField id="handle" title="GitHub handle" />
      <Form.TextField id="email" title="Email" />
    </Form>
  );
};
