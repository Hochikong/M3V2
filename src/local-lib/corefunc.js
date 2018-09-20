/*
 * Copyright 2018 Hochikong
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const uuidv1 = require('uuid/v1');

function sameYearMonth(meta) {
  const current = getCurrent();
  return meta.recordYear === current.year && meta.recordMonth === current.month;
}

function sameYearMonthDay(meta) {
  const current = getCurrent();
  return meta.recordYear === current.year && meta.recordMonth === current.month && meta.recordDay === current.day;
}

function generateID() {
  return uuidv1();
}

function userAssetsFactory() {
  const ua = { assets: [] };
  ua.appendAsset = function (assetData) {
    this.assets.push(assetData);
  };
  ua.findAssetByID = function (id) {
    for (const index in this.assets) {
      if (this.assets[index].id === id) {
        return this.assets[index];
      }
    }
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
  ua.hasBudget = function () {
    return this.findAssetByID('budget');
  };
  return ua;
}

function userUEFactory() {
  const ue = { ueItems: [] };
  ue.appendUEItem = function (ueData) {
    this.ueItems.push(ueData);
  };
  ue.findUEItemByID = function (id) {
    for (const index in this.ueItems) {
      if (this.ueItems[index].id === id) {
        return this.ueItems[index];
      }
    }
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
  ue.cleanOutofDateUE = function () {
    for (const index in this.ueItems) {
      if (this.ueItems[index].remain <= 0) {
        if (this.ueItems[index].amortize) {
          if (!sameYearMonth(this.ueItems[index].amortize.meta)) {
            this.removeUEByID(this.ueItems[index].id);
          }
        }
      }
    }
  };
  ue.calSameYMAmortizeTotal = function () {
    let sum = 0;
    for (const index in this.ueItems) {
      if (this.ueItems[index].amortize) {
        if (sameYearMonth(this.ueItems[index].amortize.meta)) {
          sum += this.ueItems[index].amortize.amount;
        }
      }
    }
    return sum;
  };
  return ue;
}

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


/**
 * @return {boolean}
 */
function UEExists(ue) {
  return ue.length > 0;
}

function remainDaysThisMonthContainToday(current) {
  const todayObj = new Date(current.year, current.month, 0);
  return (todayObj.getDate() - current.day) + 1;
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

function generateBudgetBody(amount, deposit) {
  const tmp = {};
  tmp.id = 'budget';
  tmp.name = '月度预算';
  tmp.amount = amount;
  tmp.deposit = deposit;
  tmp.remain = tmp.amount - tmp.deposit;
  tmp.dayCost = 0;
  tmp.dayAverage = 0;
  tmp.type = 'budget';
  return tmp;
}

function generateAssetBody(name, remain, type) {
  const tmp = {};
  tmp.id = generateID();
  tmp.name = name;
  tmp.remain = remain;
  tmp.type = type;
  return tmp;
}

function generateUEBody(name, remain) {
  const tmp = {};
  tmp.id = generateID();
  tmp.name = name;
  tmp.remain = remain;
  return tmp;
}

function queryAllID(data) {
  const result = [];
  for (const index in data) {
    result.push(data[index].id);
  }
  return result;
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

function notNumericType(values) {
  return !isNumericType(values);
}

function dataRequireCheckPass(vuedata, rules) {
  // vuedata是vueData， rules是一个包含单个键值对的array的array
  // rules e.g. : [['budgetTotal',0]]，用于排除
  let count = 0;
  for (const index in rules) {
    const key = rules[index][0];
    const value = rules[index][1];
    if (typeof value === 'object') {
      if (vuedata[key].length !== value.length) {
        count += 1;
      }
    } else if (vuedata[key] !== value && vuedata[key] !== '') {
      count += 1;
    }
  }
  return count === rules.length;
}
