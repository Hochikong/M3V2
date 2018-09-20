const uuidv1 = require('uuid/v1');

function generateID() {
  return uuidv1();
}

function getCurrent() {
  const current = new Date();
  return {
    min: current.getMinutes(),
    hour: current.getHours(),
    day: current.getDate(),
    month: current.getMonth() + 1,
    year: current.getFullYear(),
  };
}

function remainDaysThisMonthContainToday(today) {
  const todayObj = new Date(today.year, today.month, 0);
  return (todayObj.getDate() - today.day) + 1;
}

function dayAverageCal(remainCredit, remainDays) {
  return (remainCredit / remainDays).toFixed(2);
}

function autoDayCostCal(newAmount, oldAmount) {
  // 当新的总额大于旧总额则0为支出
  const delta = oldAmount - newAmount;
  if (delta >= 0) {
    return delta;
  }
  return 0;
}

function isNumericType(values) {
  if (typeof values === 'string') {
    if (parseFloat(values)
      .toString() !== values) {
      return false;
    }
    return typeof parseFloat(values) === 'number' && !isNaN(parseFloat(values));
  }
  return typeof values === 'number' && !isNaN(values);
}


// Assert
console.log(generateID());

console.log(getCurrent());

const today = getCurrent();
if (remainDaysThisMonthContainToday(today) === 17) {
  console.log(`remain ${remainDaysThisMonthContainToday(today)} days`);
}

console.log(dayAverageCal(1000, 17));

console.log(`cost is ${autoDayCostCal(60, 170)}`);

let values = ['sa', '12', '13.aa', '傻逼'];
let numnum = 1;
let notnum = 3;
let tmp = 0;
let tmp1 = 0;
for (const index in values) {
  if (isNumericType(values[index])) {
    tmp += 1;
  } else {
    tmp1 += 1;
  }
}
if (numnum === tmp && notnum === tmp1) {
  console.log('numeric pass');
}
