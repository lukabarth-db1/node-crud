const OXR_BASE_URL = 'https://openexchangerates.org/api/latest.json';
const FIVE_MINUTES_MS = 5 * 60 * 1000;
const CACHE_TTL_MS = FIVE_MINUTES_MS;

interface RatesCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: RatesCache | null = null;
let inFlightRatesPromise: Promise<Record<string, number>> | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const parseRatesResponse = (payload: unknown): Record<string, number> => {
  if (!isRecord(payload)) {
    throw new Error('Open Exchange Rates API returned an invalid payload');
  }

  if (payload.error === true) {
    const message = typeof payload.description === 'string'
      ? payload.description
      : typeof payload.message === 'string'
        ? payload.message
        : 'Unknown API error';
    throw new Error(`Open Exchange Rates API error: ${message}`);
  }

  if (!isRecord(payload.rates)) {
    throw new Error('Open Exchange Rates API returned payload without valid rates');
  }

  const validatedRates: Record<string, number> = {};
  for (const [currency, rate] of Object.entries(payload.rates)) {
    if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
      throw new Error(`Open Exchange Rates API returned invalid rate for currency: ${currency}`);
    }

    validatedRates[currency] = rate;
  }

  return validatedRates;
};

const fetchRates = async (): Promise<Record<string, number>> => {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
  if (!appId) {
    throw new Error('OPEN_EXCHANGE_RATES_APP_ID is not defined in environment variables');
  }

  const response = await fetch(`${OXR_BASE_URL}?app_id=${appId}`);

  if (!response.ok) {
    throw new Error(`Open Exchange Rates API error: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();
  return parseRatesResponse(data);
};

const getRates = async (): Promise<Record<string, number>> => {
  const now = Date.now();

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.rates;
  }

  if (inFlightRatesPromise) {
    return inFlightRatesPromise;
  }

  inFlightRatesPromise = fetchRates()
    .then((rates) => {
      cache = { rates, fetchedAt: Date.now() };
      return rates;
    })
    .finally(() => {
      inFlightRatesPromise = null;
    });

  return inFlightRatesPromise;
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
