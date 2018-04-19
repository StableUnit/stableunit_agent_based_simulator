import { List, OrderedMap } from 'immutable';
import nanoid from 'nanoid';
import faker from 'faker';

import { makeHistoryEntry } from '../models/exchange';
import { makePortfolio, makeTrader } from '../models/traders';
import { randomizeByDeviation } from './helpers';

import type {
  Traders,
  OrderList,
  Order,
  HistoryEntry,
  Portfolio,
  History
} from '../types';

const INITIAL_PRICE = 1;

export function makeRandomBuyOrders(traders: Traders): OrderList {
  const traderIds: List<string> = traders.keySeq().toList();
  return List(Array(50).fill()).map((entry): Order => {
    const randomTraderId =
      traderIds.get(Math.floor(Math.random() * traderIds.size)) || nanoid();

    return {
      datetime: Date.now() - Math.floor(Math.random() * 10000),
      price: Math.random(),
      quantity: Math.random(),
      traderId: randomTraderId
    };
  });
}

export function makeRandomSellOrders(traders: Traders): OrderList {
  const traderIds: List<string> = traders.keySeq().toList();
  return List(Array(50).fill()).map((entry): Order => {
    const randomTraderId =
      traderIds.get(Math.floor(Math.random() * traderIds.size)) || nanoid();

    return {
      datetime: Date.now() - Math.floor(Math.random() * 10000),
      price: Math.random() + INITIAL_PRICE,
      quantity: Math.random(),
      traderId: randomTraderId
    };
  });
}

export function randomizeLastHistoryEntry(
  history: History,
  datetime: number
): HistoryEntry {
  const deviation = 0.05;
  const randomFallback = makeHistoryEntry({
    datetime: datetime,
    price: 0.5 + Math.random(),
    quantity: Math.random()
  });
  const lastHistoryItem = history.last() || randomFallback;
  const newHistoryItem = makeHistoryEntry({
    datetime: datetime,
    price: randomizeByDeviation(lastHistoryItem.price, deviation),
    quantity: Math.random()
  });
  return newHistoryItem;
}

export function randomIdentity(): { name: string, emoji: string } {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const identities = [
    { emoji: '🤖', name: `${firstName} Bot` },
    { emoji: '😎', name: `${firstName} Cool` },
    { emoji: '🤓', name: `${firstName} Nerd` },
    { emoji: '😠', name: `Angry ${firstName}` },
    { emoji: '😰', name: `Week Hand ${firstName}` },
    { emoji: '🤑', name: `Richie ${lastName}` },
    { emoji: '😵', name: `${firstName} Panic` },
    { emoji: '😳', name: `Rookie ${firstName}` },
    { emoji: '😜', name: `Unpredictable ${firstName}` },
    { emoji: '🤥', name: `Sneaky ${firstName}` }
  ];
  return identities[Math.floor(Math.random() * identities.length)];
}

export function makeRandomTraders(): Traders {
  return OrderedMap(
    Array(10)
      .fill()
      .map((entry, index) => {
        const id: string = nanoid();

        let identity = randomIdentity();

        if (index === 0) {
          identity = { emoji: '😎', name: 'You' };
        } else if (index === 1) {
          identity = { emoji: '🤖', name: 'Stable Unit Piggy' };
        }

        const traderId = index <= 1 ? String(index) : id;
        return [
          traderId,
          makeTrader({
            id: traderId,
            name: identity.name,
            portfolio: makeRandomPortfolio(index),
            emoji: identity.emoji
          })
        ];
      })
  );
}

// These helper functions allow to create data parammetrically
export function makeRandomPortfolio(index: number): Portfolio {
  // TODO: Add custom portfolio sizes for you and SU piggy
  // 70% chance for trader to have some of the coins
  return makePortfolio({
    su: Math.random() > 0.3 ? Math.random() * 1000 : 0,
    eth: Math.random() > 0.3 ? Math.random() * 1000 : 0
  });
}
