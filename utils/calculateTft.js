const boostPrices = {
  'Iron IV': 0,
  'Iron III': 3.99,
  'Iron II': 3.99,
  'Iron I': 3.99,
  'Bronze IV': 4.39,
  'Bronze III': 4.99,
  'Bronze II': 4.99,
  'Bronze I': 4.99,
  'Silver IV': 5.99,
  'Silver III': 6.29,
  'Silver II': 6.69,
  'Silver I': 6.99,
  'Gold IV': 9.69,
  'Gold III': 10.49,
  'Gold II': 11.29,
  'Gold I': 13.49,
  'Platinum IV': 14.49,
  'Platinum III': 15.49,
  'Platinum II': 17.79,
  'Platinum I': 19.99,
  'Emerald IV': 25.49,
  'Emerald III': 26.79,
  'Emerald II': 28.29,
  'Emerald I': 30.99,
  'Diamond IV': 32.29,
  'Diamond III': 43.29,
  'Diamond II': 56.49,
  'Diamond I': 77.99,
  Master: 93.49,
};
const boostPerGamePrice = {
  'Iron IV': 0,
  'Iron III': 3.99,
  'Iron II': 3.99,
  'Iron I': 3.99,
  'Bronze IV': 4.39,
  'Bronze III': 4.99,
  'Bronze II': 4.99,
  'Bronze I': 4.99,
  'Silver IV': 5.99,
  'Silver III': 6.29,
  'Silver II': 6.69,
  'Silver I': 6.99,
  'Gold IV': 9.69,
  'Gold III': 10.49,
  'Gold II': 11.29,
  'Gold I': 13.49,
  'Platinum IV': 14.49,
  'Platinum III': 15.49,
  'Platinum II': 17.79,
  'Platinum I': 19.99,
  'Emerald IV': 25.49,
  'Emerald III': 26.79,
  'Emerald II': 28.29,
  'Emerald I': 30.99,
  'Diamond IV': 32.29,
  'Diamond III': 43.29,
  'Diamond II': 56.49,
  'Diamond I': 77.99,
  Master: 93.49,
};
const discountCode = [
  'DISCOUNT10',
  'DISCOUNT20',
  'DISCOUNT30',
  'DISCOUNT40',
  'DISCOUNT50',
];

const calculateTftPrice = (data) => {
  const {
    rankCurrent,
    rankDesired,
    mmrs,
    additionalWin,
    streamed,
    chat,
    priority,
    discount,
  } = data;
  let totalPrice = 0;
  let mmrsFinal;
  let discountFinal;

  const currentToKey = rankCurrent.rank + ' ' + rankCurrent.division;
  const desiredToKey = rankDesired.rank + ' ' + rankDesired.division;
  const indexCurrent = Object.keys(boostPrices).indexOf(currentToKey);
  const indexDesired = Object.keys(boostPrices).indexOf(desiredToKey);

  if (indexCurrent >= 0 && indexDesired >= 0 && indexCurrent <= indexDesired)
    for (let i = indexCurrent; i <= indexDesired; i++) {
      totalPrice += boostPrices[Object.keys(boostPrices)[i]];
    }

  if (additionalWin) {
    totalPrice += 10;
  }
  if (streamed) {
    totalPrice *= 1.1;
  }
  if (chat) {
    totalPrice *= 1.1;
  }
  if (priority) {
    totalPrice *= 1.2;
  }

  if (mmrs.length > 0) {
    mmrsFinal = parseInt(mmrs.slice(0, 2));
  }
  switch (mmrsFinal) {
    case 10:
      totalPrice *= 1.3;
      break;
    case 15:
      totalPrice *= 1.15;
      break;
    case 20:
      totalPrice *= 1.1;
      break;
    case 25:
      totalPrice *= 0.9;
      break;
    default:
      totalPrice *= 0.8;
  }

  if (discount) {
    if (discountCode.includes(discount)) {
      totalPrice *= 0.9;
    }
  }
  const price = 0.8 * totalPrice;

  return {
    price: price.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    discountFinal: (totalPrice - price).toFixed(2),
  };
};

module.exports = calculateTftPrice;