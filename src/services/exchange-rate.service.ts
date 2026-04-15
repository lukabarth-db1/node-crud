const OXR_BASE_URL = 'https://openexchangerates.org/api/latest.json';
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const CACHE_TTL_MS = FIVE_MINUTES_MS;

interface RatesCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: RatesCache | null = null;

const fetchRates = async (): Promise<Record<string, number>> => {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
  if (!appId) {
    throw new Error('OPEN_EXCHANGE_RATES_APP_ID is not defined in environment variables');
  }

  const response = await fetch(`${OXR_BASE_URL}?app_id=${appId}`);

  if (!response.ok) {
    throw new Error(`Open Exchange Rates API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as { rates: Record<string, number> };
  return data.rates;
};

const getRates = async (): Promise<Record<string, number>> => {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rates;
  }

  const rates = await fetchRates();
  cache = { rates, fetchedAt: now };
  return rates;
};

const convert = async (amount: number, toCurrency: string): Promise<number> => {
  const rates = await getRates();
  const rate = rates[toCurrency.toUpperCase()];

  if (rate === undefined) {
    throw new Error(`Unsupported currency: ${toCurrency.toUpperCase()}`);
  }

  return parseFloat((amount * rate).toFixed(2));
};

export default { convert };
