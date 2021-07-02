import React from "react";
import styled from "styled-components";
import { Toggle } from "carbon-components-react";
type Props = {
  title: string;
  name: string;
  showAll: boolean;
  toggleShowAll: (...args: Array<any>) => any;
};
const ToggleContainer = styled.div`
  position: absolute;
  right: 10px;
  top: -10px;
`;
const RelativeHeading = styled.h3`
  position: relative;
`;

const TitleWithToggle = (props: Props) => {
  const {
    title,
    name,
    showAll,
    toggleShowAll
  } = props;
  return <RelativeHeading>
      {title}
      <ToggleContainer>
        <Toggle id={`${name}-toggle`} toggled={showAll} labelA="last 50" labelB="All" onToggle={toggleShowAll} />
      </ToggleContainer>
    </RelativeHeading>;
};

export default TitleWithToggle;