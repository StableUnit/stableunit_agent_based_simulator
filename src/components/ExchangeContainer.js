//@flow

import React from 'react';
import { connect } from 'react-redux';
import { ContentSwitcher, Switch } from 'carbon-components-react';

import type { Markets, FullState } from '../types';

import MarketContainer from './MarketContainer';


type Props = {
  markets: Markets,
};

type State = {
  selectedMarketIndex: number
};

class ExchangeContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { selectedMarketIndex: 0 }
  }

  handleMarketSwitch = (data) => {
    this.setState({ selectedMarketIndex: data.index })
  }
  render() {
    const { markets } = this.props;
    const { selectedMarketIndex } = this.state;
    const market = markets.get(selectedMarketIndex);

    return ( 
      <div>
        <ContentSwitcher onChange={this.handleMarketSwitch} selectedIndex={selectedMarketIndex}>
          {markets.map(market => <Switch key={market.name} name={market.name} text={market.name} />)}
        </ContentSwitcher>

        {market && <MarketContainer market={market} />}
      </div>
     )
  }
}


const mapState = (state: FullState) => ({
  markets: state.simulation.markets
});

export default connect(mapState)(ExchangeContainer);
