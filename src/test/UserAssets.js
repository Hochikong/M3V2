function userAssetsFactory() {
  const ua = { assets: [] };
  ua.appendAsset = function (assetData) {
    this.assets.push(assetData);
  };
  ua.updateAssetByID = function (id, updateContent) {
    for (const index in this.assets) {
      if (this.assets[index].id === id) {
        const tmpAsset = this.assets[index];
        const allUpdateKeys = Object.keys(updateContent);
        for (const keyIndex in allUpdateKeys) {
          tmpAsset[allUpdateKeys[keyIndex]] = updateContent[allUpdateKeys[keyIndex]];
        }
      }
    }
  };
  ua.removeAllAssets = function () {
    this.assets = [];
  };
  ua.removeAssetByID = function (id) {
    for (const index in this.assets) {
      if (this.assets[index].id === id) {
        this.assets.splice(index, 1);
      }
    }
  };
  return ua;
}

// ------------------------------------------

const ua = userAssetsFactory();
ua.appendAsset({ id: 1, name: 'Jack', age: 12 });
ua.appendAsset({ id: 2, name: 'cnm' });
ua.updateAssetByID(1, { name: 'Mike', age: 15 });

const unit = 5;
let sumup = 0;

function passhere(info) {
  console.log(info);
}

// Assert
if (ua.assets[0].id === 1) {
  sumup += 1;
  passhere('id');
}

if (ua.assets[0].name === 'Mike') {
  sumup += 1;
  passhere('name');
}

if (ua.assets[0].age === 15) {
  sumup += 1;
  passhere('age');
}

ua.removeAssetByID(2);
if (ua.assets.length === 1) {
  if (ua.assets[0].id === 1) {
    sumup += 1;
    passhere('remove by id');
  }
}

ua.removeAllAssets();
if (ua.assets.length === 0) {
  sumup += 1;
  passhere('length');
}

if (sumup === unit) {
  console.log('\nAll unit tests passed');
}
