import transactions from '../json/transactions.json';

transactions.forEach(item => {
  const data = Object.entries(item);
  const keyArr = [];
  data.forEach(([key, value]) => {
    if (key !== 'id' && !keyArr.includes(key)) {
      keyArr.push(key);
    }
  });
  console.log(keyArr);
  for (let index = 0; index < keyArr.length; index++) {
    const element = keyArr[index];
    console.log(element);
  }
});
