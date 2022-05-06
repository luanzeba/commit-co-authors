import { Form } from "@raycast/api";
import { useRef } from "react";

import { AddUserActions } from "./editing_actions";

interface Props {
  switchMode: () => void;
}

export default ({switchMode} : Props) => {
  const nameField = useRef<Form.TextField>(null)
  const handleField = useRef<Form.TextField>(null);
  const emailField = useRef<Form.TextField>(null);

  return (
    <Form actions={<AddUserActions switchMode={switchMode} refs={[nameField, handleField, emailField]} />} >
      <Form.TextField id="name" title="Name" ref={nameField} />
      <Form.TextField id="handle" title="GitHub handle" ref={handleField} />
      <Form.TextField id="email" title="Email" ref={emailField} />
    </Form>
  );
}
