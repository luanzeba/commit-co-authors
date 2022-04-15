import { Form } from "@raycast/api";

import { AddUserActions } from "./editing_actions";

interface Props {
  switchMode: () => void;
}

export default ({switchMode} : Props) => {
  return (
    <Form actions={<AddUserActions switchMode={switchMode} />} >
      <Form.TextField id="name" title="name" defaultValue="" />
      <Form.TextField id="handle" title="handle" defaultValue="" />
      <Form.TextField id="email" title="email" defaultValue="" />
    </Form>
  );
}
