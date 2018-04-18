//@flow

import React from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { colors } from '../theme';
import accounting from 'accounting';

import { Trader } from '../models/es6_simulation';

const HARDCODED_ETH_PRICE_CHANGE_LATER = 600;

const {
  TableContainer,
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell
} = DataTable;

type Props = {
  traders: Traders
};

type Row = {
  id: string,
  name: string,
  eth: string,
  su: string
};

type Header = {
  key: string,
  header: string
};

const NumberCell = styled(TableCell)`
  text-align: right !important;
`;
const NumberHeader = styled(TableHeader)`
  text-align: right !important;
`;
const Positive = styled.div`
  color: ${colors.green};
`;
const Negative = styled.div`
  color: ${colors.red};
`;
const ManualControl = styled.span`
  margin-left: 1em;
  white-space: nowrap;
  button {
    margin-left: 0.5em;
  }
`;

function renderGains(value) {
  return value > 0 ? (
    <Positive>+{value.toFixed(1)}%</Positive>
  ) : (
    <Negative>{value.toFixed(1)}%</Negative>
  );
}

// function getPortfolioWorth(trader: Trader): number {
//   return (
//     trader.portfolio.su +
//     trader.portfolio.eth * HARDCODED_ETH_PRICE_CHANGE_LATER
//   );
// }

function makeDatatableRows(traders: Traders): Array<Row> {
  return Array.from(traders.values()).map((trader, index) => ({
    id: index,
    name: `Trader ${index}`,
    eth: trader.eth_balance.toFixed(2),
    su: trader.su_balance.toFixed(2)
  }));
  // .sort((a, b) => {
  //   if (a.id === '0' || a.id === '1') {
  //     return -1;
  //   }
  //   return b.portfolioWorth - a.portfolioWorth;
  // });
}

function makeDatatableHeaders(): Array<Header> {
  return [
    {
      key: 'controls',
      header: ''
    },
    {
      key: 'portfolioWorthDisplay',
      header: 'Portfolio ($)'
    },
    {
      key: 'eth',
      header: '(ETH)'
    },
    {
      key: 'su',
      header: '(SU)'
    }
  ];
}

function getHeaderComponent(index: number) {
  if (index > 1) {
    return NumberHeader;
  }

  return TableHeader;
}

function getCellComponent(index: number) {
  if (index > 1) {
    return NumberCell;
  }

  return TableCell;
}

const TradersContainer = (props: Props) => {
  const { traders } = props;
  const rows = makeDatatableRows(traders);
  const headers = makeDatatableHeaders();

  return (
    <div>
      <DataTable
        rows={rows}
        headers={headers}
        render={({ rows, headers, getHeaderProps }) => (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header, index) => {
                    const HeaderComponent = getHeaderComponent(index);
                    return (
                      <HeaderComponent key={header.key}>
                        {header.header}
                      </HeaderComponent>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell, cellIndex) => {
                      const CellComponent = getCellComponent(cellIndex);
                      return (
                        <CellComponent key={cell.id}>
                          {cell.value}
                          {rowIndex === 0 &&
                            cellIndex === 0 && (
                              <ManualControl>
                                <Button small>Buy ETH</Button>
                                <Button small disabled>
                                  Sell ETH
                                </Button>
                              </ManualControl>
                            )}
                        </CellComponent>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      />
    </div>
  );
};

const mapState = state => ({
  traders: state.simulation.newTraders
});

export default connect(mapState)(TradersContainer);
