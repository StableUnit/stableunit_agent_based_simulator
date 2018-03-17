//@flow
// Patterns
//
// - Country bans something
// - Major wallet is hacked
// - War start
// -
import type { MediaImpact } from '../types';

type NewsGenerators = Array<() => string>;

function random<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function headline(arr: Array<string>): string {
  return capitalize(arr.join(' '));
}

const patterns = [];

const cryptoProjectTypes = ['ICOs', 'exchanges', 'mining'];
const countries = [
  'Russia',
  'United States',
  'Germany',
  'UK',
  'Japan',
  'South Korea',
  'Venezuela',
  'Canada'
];

const worldLeaders = ['Trump', 'Putin', 'Merkel'];

const actors = ['investors', 'traders'];

const majorCryptos = ['Bitcoin', 'Ethereum', 'Ripple'];

const cryptoCompanies = ['Consensys', 'Polychain Capital', 'Ripple', 'Tether'];

const valleyGiants = ['Google', 'Facebook', 'Twitter', 'Apple', 'Amazon'];

function countryBansProject(): string {
  return headline([random(countries), 'bans', random(cryptoProjectTypes)]);
}
function cryptoCompanyGoesBankrupt(): string {
  return headline([random(cryptoCompanies), 'files bankruptcy']);
}
function cryptoCompanyDDoS(): string {
  return headline([random(cryptoCompanies), 'is under a heavy DDoS attack']);
}
function cryptoCompanyGetsHacked(): string {
  return headline([
    random(cryptoCompanies),
    'gets hacked. Millions of accounts leaked'
  ]);
}
function majorCryptoCrash(): string {
  return headline([random(majorCryptos), 'has crashed over 80%']);
}
function newBullRun(): string {
  return headline([
    random(majorCryptos),
    'has doubled over the past month. The bull trend continues'
  ]);
}
function majorCryptoAllTimeHighs(): string {
  return headline([random(majorCryptos), 'is hitting all time highs']);
}
function countryLegalize(): string {
  return headline([
    random(countries),
    'to legalize',
    random(cryptoProjectTypes)
  ]);
}
function walletsCompromised(): string {
  return headline([
    'The most popular',
    random(majorCryptos),
    'wallet is compromised. Millions of dollars are stolen'
  ]);
}
function warDeclaration(): string {
  return headline([
    random(countries),
    'has declared war to',
    random(countries) + '.',
    random(majorCryptos),
    'on local markets are skyrocketing'
  ]);
}
function valleyInvestsInCrypto(): string {
  return headline([
    random(valleyGiants),
    'is launching an ICO to develop their own blockchain'
  ]);
}
function valleyBan(): string {
  return headline([
    random(valleyGiants),
    'is blocking everything related to crypto'
  ]);
}
function leadersHodling(): string {
  return headline([random(worldLeaders), 'is long on', random(majorCryptos)]);
}
function countryElection(): string {
  return headline([
    random(countries) + 'ʼs',
    'next election is going to be on blockchain'
  ]);
}
function badRidiculous(): string {
  return headline([
    random(['Satoshi Nakamoto is found smoking crack on streets of Vancouver'])
  ]);
}
function positiveSpecialists(): string {
  return headline([
    'Technical analysis predicts the new highs for',
    random(majorCryptos)
  ]);
}
function negativeSpecialists(): string {
  return headline(['Skepticism around', random(majorCryptos), 'is rising']);
}

const badNews: NewsGenerators = [
  cryptoCompanyDDoS,
  countryBansProject,
  valleyBan,
  walletsCompromised,
  negativeSpecialists
];

const goodNews: NewsGenerators = [
  valleyInvestsInCrypto,
  countryLegalize,
  positiveSpecialists
];

const badBlackSwans: NewsGenerators = [
  warDeclaration,
  cryptoCompanyGoesBankrupt,
  majorCryptoCrash
];

const goodBlackSwans: NewsGenerators = [
  majorCryptoAllTimeHighs,
  newBullRun,
  leadersHodling
];

export default function generateHeadline(impact: MediaImpact): string {
  switch (impact) {
    case -2:
      return random(badBlackSwans)();
    case -1:
      return random(badNews)();
    case 1:
      return random(goodNews)();
    case 2:
      return random(goodBlackSwans)();
    default:
      return random(goodNews)();
  }
}
