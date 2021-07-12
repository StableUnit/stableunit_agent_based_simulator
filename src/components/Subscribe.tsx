import React, { Component } from "react";
import { TextInput, Button } from "carbon-components-react";
import styled from "styled-components";
type Props = {};
const Wrap = styled.div`
  display: flex;
`;
const Label = styled.div`
  margin-bottom: 0.3em;
`;
const Input = styled(TextInput)`
  min-width: 15rem;
`;

class Subscribe extends Component<Props> {
  render() {
    return <div>
        <Label>Subscribe to keep in touch</Label>
        <Wrap>
          <Input id="subscribe-email" labelText="" onChange={() => {}} placeholder="Please enter an email" type="email" />
          <Button>Subscribe</Button>
        </Wrap>
      </div>;
  }

}

export default Subscribe;