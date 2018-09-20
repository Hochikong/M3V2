function userUEFactory() {
  const ue = { ueItems: [] };
  ue.appendUEItem = function (ueData) {
    this.ueItems.push(ueData);
  };
  ue.updateUEItemByID = function (id, updateContent) {
    for (const index in this.ueItems) {
      if (this.ueItems[index].id === id) {
        const tmpAsset = this.ueItems[index];
        const allUpdateKeys = Object.keys(updateContent);
        for (const keyIndex in allUpdateKeys) {
          tmpAsset[allUpdateKeys[keyIndex]] = updateContent[allUpdateKeys[keyIndex]];
        }
      }
    }
  };
  ue.removeAllUE = function () {
    this.ueItems = [];
  };
  ue.removeUEByID = function (id) {
    for (const index in this.ueItems) {
      if (this.ueItems[index].id === id) {
        this.ueItems.splice(index, 1);
      }
    }
  };
  return ue;
}

const ue = userUEFactory();

// Assert
const ut = 4;
let sumup = 0;

ue.appendUEItem({ id: 1, name: 'ABC', expend: 8000, amortizeCM: 0 });
ue.appendUEItem({ id: 2, name: 'efg' });

if (ue.ueItems.length === 2) {
  sumup += 1;
  console.log('length === 2');
}

ue.updateUEItemByID(1, { name: 'CNM', expend: 6000 });
const tmp = ue.ueItems[0];
if (tmp.id === 1) {
  if (tmp.name === 'CNM') {
    if (tmp.expend === 6000) {
      if (tmp.amortizeCM === 0) {
        sumup += 1;
        console.log('update done');
      }
    }
  }
}

ue.removeUEByID(2);
if (ue.ueItems.length === 1) {
  if (ue.ueItems[0].id === 1) {
    sumup += 1;
    console.log('remove by id done');
  }
}

ue.removeAllUE();
if (ue.ueItems.length === 0) {
  sumup += 1;
  console.log('remove all done');
}

if (sumup === ut) {
  console.log('\nAll unit test passed');
}
