function opsRecorderFactory() {
  const or = { operations: [] };
  or.appendRecord = function (recordData) {
    this.operations.push(recordData);
  };
  or.exportRecords = function () {
    return this.operations;
  };
  or.removeAllRecords = function () {
    this.operations = [];
  };
  return or;
}


// Assert
const ut = 2;
let sumup = 0;

const or = opsRecorderFactory();

or.appendRecord({ min: 7, hour: 21, day: 9, ops: 'add smsas' });
if (or.operations.length === 1) {
  sumup += 1;
  console.log('append done');
}

console.log(or.exportRecords());

or.removeAllRecords();
if (or.operations.length === 0) {
  sumup += 1;
  console.log('remove all done');
}

if (sumup === ut) {
  console.log('\nAll unit tests passed');
}
