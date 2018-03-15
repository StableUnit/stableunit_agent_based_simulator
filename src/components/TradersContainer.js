//@flow

import React from 'react';
import { connect } from 'react-redux';
import { DataTable } from 'carbon-components-react';
import styled from 'styled-components';

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

const EmojiCell = styled(TableCell)`
  font-size: 200%;
`;

type Props = {
  traders: Traders
};

type Row = {
  id: string,
  emoji: string,
  name: string,
  eth: string,
  su: string,
  percentDiff: string
};

type Header = {
  key: string,
  header: string
};

function makeDatatableRows(traders: Traders): Array<Row> {
  return traders
    .toList()
    .map(trader => ({
      id: trader.id,
      emoji: trader.emoji,
      name: trader.name,
      eth: trader.portfolio.eth.toFixed(2),
      su: trader.portfolio.su.toFixed(2),
      percentDiff: Math.random().toFixed(1)
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
          <TableContainer title="Traders">
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell, index) => {
                      return index === 0 ? (
                        <EmojiCell key={cell.id}>{cell.value}</EmojiCell>
                      ) : (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
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
