import { Form } from "@raycast/api";
import { useState } from "react";

import { User } from "./users";
import { EditUserActionPanel } from "./user_form_actions";

export default (props: { user: User }) => {
  const { user: { name, handle, email }} = props;

  const [nameValue, setNameValue] = useState(name);
  const [handleValue, setHandleValue] = useState(handle);
  const [emailValue, setEmailValue] = useState(email);

  return (
    <Form actions={<EditUserActionPanel oldHandle={handle} />} >
      <Form.TextField id="name" title="Name" value={nameValue} onChange={setNameValue} />
      <Form.TextField id="handle" title="GitHub handle" value={handleValue} onChange={setHandleValue} />
      <Form.TextField id="email" title="Email" value={emailValue} onChange={setEmailValue} />
    </Form>
  );
}
