const usdToEur = 0.92;
const usdToEgp = 50;

const convertPrice = (price, currency) => {
  if(currency === 'USD') return price;
  if(currency === 'EUR') return (price * usdToEur).toFixed(2);
  if(currency === 'EGP') return (price * usdToEgp).toFixed(2);
  return price;
}

const convertToUSD = (price, currency) => {
  if(currency === 'USD') return price;
  if(currency === 'EUR') return (price / usdToEur).toFixed(2);
  if(currency === 'EGP') return (price / usdToEgp).toFixed(2);
  return price;
}

module.exports = { convertPrice, convertToUSD }