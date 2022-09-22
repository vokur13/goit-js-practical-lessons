import transactions from '../json/transactions.json';

console.log(transactions[0]);

const key = Object.keys(transactions[0]);

console.log(key);

console.log(transactions[0][key]);
