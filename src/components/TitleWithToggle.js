// @flow

import React from 'react';
import { Toggle } from 'carbon-components-react';

type Props = {
  title: string,
  name: string,
  showAll: bool,
  toggleShowAll: function
};

const TitleWithToggle = (props: Props) => {
  const { title, name, showAll, toggleShowAll } = props;
  const sliceLength = showAll ? 0 : -50;

  return (
    <h3 style={{ position: 'relative'}}>
      {title}
      <div style={{ position: 'absolute', right: '10px', top: '-10px' }}>
        <Toggle
          id={`${name}-toggle`}
          toggled={showAll}
          labelA="last 50"
          labelB="All"
          onToggle={toggleShowAll}
        />
      </div>
    </h3>
  );
}

export default TitleWithToggle;
