const fs = require('fs');

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

function generateMeta() {
  const current = getCurrent();
  return {
    recordDay: current.day,
    recordMonth: current.month,
    recordYear: current.year,
  };
}

function fileExists(name) {
  return fs.existsSync(name);
}

function sameYearMonth(meta) {
  const current = getCurrent();
  return meta.recordYear === current.year && meta.recordMonth === current.month;
}

function UEExists(ue) {
  return ue.length > 0;
}



// Assert

const ut = 4;
let sumup = 0;

if (generateMeta().recordYear === getCurrent().year) {
  if (generateMeta().recordMonth === getCurrent().month) {
    if (generateMeta().recordDay === getCurrent().day) {
      sumup += 1;
      console.log('time equals');
      console.log(generateMeta());
    }
  }
}

if (fileExists('xx.txt')) {
  sumup += 1;
  console.log(fileExists('xx.txt'));
}

if (sameYearMonth({ recordYear: 2018, recordMonth: 9 })) {
  sumup += 1;
  console.log('same month and year');
}

const ue = [{ id: 1, name: 'ABC', expend: 8000, amortizeCM: 0 }, { id: 2, name: 'efg' }];
if (UEExists(ue)) {
  sumup += 1;
  console.log('ue exists');
}

// Result

if (ut === sumup) {
  console.log('\nAll unit tests passed');
}
