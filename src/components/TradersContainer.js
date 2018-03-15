//@flow

import React from 'react';
import { connect } from 'react-redux';
import { DataTable } from 'carbon-components-react';

import type { Traders, FullState } from '../types';

const { TableContainer, Table, TableHead, TableHeader, TableRow, TableBody, TableCell } = DataTable;

type Props = {
  traders: Traders
};

type Row = {
  id: string,
  name: string,
  eth: number,
  su: number,
  percentDiff: number
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
      name: trader.name,
      eth: trader.portfolio.eth,
      su: trader.portfolio.su,
      percentDiff: Math.random()
    }))
    .toArray();
}

function makeDatatableHeaders(): Array<Header> {
  return [
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
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}
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
