//@flow

import React from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { colors } from '../theme';

import type { Traders, FullState } from '../types';

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
  emoji: string,
  name: string,
  eth: string,
  su: string,
  percentDiff: Node
};

type Header = {
  key: string,
  header: string
};

const EmojiCell = styled(TableCell)`
  font-size: 200%;
`;
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

function makeDatatableRows(traders: Traders): Array<Row> {
  return traders
    .toList()
    .map(trader => ({
      id: trader.id,
      emoji: trader.emoji,
      name: trader.name,
      eth: trader.portfolio.eth.toFixed(2),
      su: trader.portfolio.su.toFixed(2),
      percentDiff: renderGains((Math.random() - 0.5) * 10)
    }))
    .toArray();
}

function makeDatatableHeaders(): Array<Header> {
  return [
    {
      key: 'emoji',
      header: ''
    },
    {
      key: 'name',
      header: 'Name'
    },
    {
      key: 'eth',
      header: 'Portfolio (ETH)'
    },
    {
      key: 'su',
      header: '(SU)'
    },
    {
      key: 'percentDiff',
      header: 'Gains/Losses'
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
  if (index === 0) {
    return EmojiCell;
  }

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
                            cellIndex === 1 && (
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

const mapState = (state: FullState) => ({
  traders: state.simulation.traders
});

export default connect(mapState)(TradersContainer);
