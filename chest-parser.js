var data = [];

function parseChance(chanceString) {
  return parseFloat(chanceString.match(/\d+\.\d+/g)[0]) / 100
}

$("#app > div").each((_, weaponClass) => {
  const className = $(weaponClass).find(".trn-card__header-title").text();
  const classChance = $(weaponClass).find(".trn-card__header-subline").text()
  var children = []
  $(weaponClass).find("tbody").each((_, dropType) => {
    const type =  $(dropType).children(".trn-table__row").map((_, item) => {
      var weaponName = $(item).find("td:nth-child(2) > a").text()
      if (weaponName === "") {
        weaponName = $(item).find("td:nth-child(2)").text()
      }
      const weaponChance = $(item).find("td:last-child").text()
      return {'name': weaponName, 'chance': parseChance(weaponChance)}
    }).toArray()
    children.push(type);
  })
  data.push({
    'label': className,
    'chance': parseChance(classChance),
    'children': children
  })
})
console.log(data)
