const chest = require('./chest')
const floor = require('./floor')
const locations = require('./locations')

function choose(items) {
  if (items.length == 0) {
    return null;
  }
  const x = Math.random();
  var accumulator = 0;
  for (var i = 0; i < items.length; i++) {
    const item = items[i];
    accumulator = accumulator + item.chance;
    if (accumulator > x) {
      return item;
    }
  }
}

function openLoot(loot) {
  const category = choose(loot)
  const items = category.children.map(choose)
  return items.filter(x => x).map((item) => item.name)
}

function simulateLooting(numberOfChests, numberOfFloors) {
  var items = [];
  for (var i = 0; i < numberOfChests; i++) {
    if (Math.random() < .5) {
      items.push(...openLoot(chest))
    }
  }
  for (var i = 0; i < numberOfFloors; i++) {
    items.push(...openLoot(floor))
  }
  return items;
}

function lootLocation(locationName) {
  const location = locations[locationName];
  return simulateLooting(location.chest, location.floor);
}

const shotguns = {
  'Tactical Shotgun (Common)': 0,
  'Tactical Shotgun (Uncommon)': 1,
  'Tactical Shotgun (Rare)': 2,
  'Pump Shotgun (Uncommon)': 3,
  'Pump Shotgun (Rare)': 4,
  'Heavy Shotgun (Epic)': 5,
  'Heavy Shotgun (Legendary)': 6,
  'Double Barrel Shotgun (Epic)': 7,
  'Double Barrel Shotgun (Legendary)': 8
}

const ars = {
  'Assault Rifle (Burst) (Common)': 0,
  'Assault Rifle (Burst) (Uncommon)': 1,
  'Assault Rifle (Burst) (Rare)': 2,
  'Assault Rifle (Burst Rare) (Epic)': 3,
  'Assault Rifle (Burst Rare) (Legendary)': 4,
  'Assault Rifle (M4) (Common)': 5,
  'Assault Rifle (M4) (Uncommon)': 6,
  'Assault Rifle (M4) (Rare)': 7,
  'Assault Rifle (SCAR) (Epic)': 8,
  'Assault Rifle (SCAR) (Legendary)': 9,
  'Suppressed Assault Rifle (Epic)': 10,
  'Suppressed Assault Rifle (Legendary)': 11
}

const smgs = {
  'Submachine Gun (Common)': 0,
  'Submachine Gun (Uncommon)': 1,
  'Submachine Gun (Rare)': 2,
  'Compact Gun (Epic)': 3,
  'Compact Gun (Legendary)': 4
}

const mini = "Small Shield Potion";
const big = 'Shield Potion';
const slurp = "Slurp Juice";

function carryableShield(shield, amount) {
  if (shield == mini) {
    return Math.min(amount, 10) * 25;
  } else if (shield == big) {
    return Math.min(amount, 3) * 50;
  } else {
    return Math.min(amount, 2) * 75;
  }
}

const shieldValue = {}
shieldValue[mini] = {'stack': 10, 'value': 25};
shieldValue[big] = {'stack': 3, 'value': 50};
shieldValue[slurp] = {'stack': 2, 'value': 75};

function kitForLoot(loot) {
  var meds = []
  var kit = {
    'Shields': 0,
    'AR': {'item': "nothing", 'rank': -1},
    'Shotgun': {'item': "nothing", 'rank': -1},
    'SMG': {'item': "nothing", 'rank': -1},
    'Med1': 'nothing',
    'Med2': 'nothing'
  }

  loot.forEach((item) => {
    const arRank = ars[item];
    if (arRank) {
      if (kit.AR.rank < arRank) {
        kit.AR = {'item': item, 'rank': arRank};
      }
    } else {
      const shotgunRank = shotguns[item];
      if (kit.Shotgun.rank < shotgunRank) {
        kit.Shotgun = {'item': item, 'rank': shotgunRank};
      } else {
        const smgRank = smgs[item];
        if (kit.SMG.rank < smgRank) {
          kit.SMG = {'item': item, 'rank': smgRank};
        } else {
          if (item == mini || item == big || item == slurp) {
            meds.push(item);
          }
        }
      }
    }
  })
  kit.AR = kit.AR.item
  kit.Shotgun = kit.Shotgun.item
  kit.SMG = kit.SMG.item

  var shields = {}

  meds.forEach((med) => {
    if (med == mini) {
      shields[med] = (shields[med] || 0) + 3
    } else {
      shields[med] = (shields[med] || 0) + 1
    }
  })

  if (shields[slurp] > 0 && shields[mini] > 0) {
    shields[slurp] = shields[slurp] - 1;
    shields[mini] = shields[mini] - 1;
    kit.Shields = 100
  } else if (shields[mini] > 1 && shields[big] > 0) {
    shields[mini] = shields[mini] - 2;
    shields[big] = shields[big] - 1;
    kit.Shields = 100
  } else if (shields[big] > 1) {
    shields[big] = shields[big] - 2;
    kit.Shields = 100
  } else if (shields[big] > 0 && shields[slurp] > 0) {
    shields[slurp] = shields[slurp] - 1;
    shields[big] = shields[big] - 1;
    kit.Shields = 100
  } else if (shields[slurp] > 1) {
    shields[slurp] = shields[slurp] - 2;
    kit.Shields = 100
  } else if (shields[slurp] > 0) {
    shields[slurp] = shields[slurp] - 1;
    kit.Shields = 75
  } else if (shields[big] > 0) {
    shields[big] = shields[big] - 1;
    kit.Shields = 50
  } else if (shields[mini] > 1) {
    shields[mini] = shields[mini] - 2;
    kit.Shields = 50
  }
  var bestMed = null
  var secondBest = null
  Object.keys(shields).forEach((shield) => {
    const count = Math.min(shields[shield], shieldValue[shield].stack)
    if (count > 0) {
      if (bestMed == null) {
        bestMed = {'item': shield, 'count': count};
      } else {
        bestMedValues = shieldValue[bestMed.item];
        bestMedValue = Math.min(bestMedValues.stack, bestMed.count)*bestMedValues.value;
        thisValues = shieldValue[shield]
        thisValue = Math.min(thisValues.stack, count)*thisValues.value;
        if (thisValue > bestMedValue) {
          secondBest = bestMed
          bestMed = {'item': shield, 'count': count};
        } else if (secondBest == null) {
          secondBest = {'item': shield, 'count': count};
        } else {
          secondBestValues = shieldValue[secondBest.item];
          secondBestValue = Math.min(secondBestValues.stack, secondBest.count)*secondBestValues.value;
          if (thisValue > secondBestValue) {
            secondBest = {'item': shield, 'count': count}
          }
        }
      }
    }
  })
  kit.Med1 = bestMed || 'nothing';
  kit.Med2 = secondBest || 'nothing';

  return kit
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function rankLocation(location) {
  const n = 500000.0;
  var arCount = 0;
  var shotgunCount = 0;
  var smgCount = 0;
  var shields0 = 0;
  var shields50 = 0;
  var shields75 = 0;
  var shields100 = 0;
  var shieldsInInventory = 0;
  var kitted = 0;
  for (var i = 0; i < n; i++) {
    const kit = kitForLoot(lootLocation(location));
    const hasAr = kit.AR != 'nothing'
    arCount = arCount + (hasAr ? 1 : 0);
    const hasShotgun = kit.Shotgun != 'nothing'
    shotgunCount = shotgunCount + (hasShotgun ? 1 : 0);
    const hasSmg = kit.SMG != 'nothing'
    smgCount = smgCount + (hasSmg ? 1 : 0);

    const med1Shield = kit.Med1 == 'nothing' ? 0 : shieldValue[kit.Med1.item].value * kit.Med1.count
    const med2Shield = kit.Med2 == 'nothing' ? 0 : shieldValue[kit.Med2.item].value * kit.Med2.count
    const inventoryShields = med1Shield + med2Shield
    shieldsInInventory = shieldsInInventory + inventoryShields

    if (kit.Shields == 0) {
      shields0++;
    }
    if (kit.Shields == 50) {
      shields50++;
    }
    if (kit.Shields == 75) {
      shields75++;
    }
    if (kit.Shields == 100) {
      shields100++;
      if (inventoryShields >= 100 && hasAr && hasShotgun && hasSmg) {
        kitted++
      }
    }
  }

  return {
    'Name': location,
    '0 Shields': round(shields0 / n, 3),
    '50 Shields': round(shields50 / n, 3),
    '75 Shields': round(shields75 / n, 3),
    '100 Shields': round(shields100 / n, 3),
    'AR': round(arCount / n, 3),
    'Shotgun': round(shotgunCount / n, 3),
    'SMG': round(smgCount / n, 3),
    'Shields In Inventory': round(shieldsInInventory / n, 1),
    'Kitted': round(kitted / n, 3)
  }
}

function rankAllLocations() {
  var rankedLocations = Object.keys(locations).map((location) => {
    return rankLocation(location);
  });

  rankedLocations.sort(function(a, b) {
    if (a.Kitted > b.Kitted) {
      return -1
    } else {
      return 1
    }
  })

  return rankedLocations;
}


console.log(JSON.stringify(rankAllLocations(), null, 2))
