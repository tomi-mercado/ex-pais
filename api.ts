import { generateKeyMonthYear } from "@/lib/utils";

interface Response {
  data: [string, number][];
}

const inflationfirstDateAvailable = "2017-01-01";
const inflationUrl = `https://apis.datos.gob.ar/series/api/series/?ids=145.3_INGNACUAL_DICI_M_38&collapse=month&start_date=${inflationfirstDateAvailable}&format=json`;

const getInflationPerMonth = async () => {
  const response = await fetch(inflationUrl, {
    next: {
      revalidate: 1,
    },
  });
  const { data } = (await response.json()) as Response;

  const inflationPerMonth = data.reduce((acc, [dateStr, value]) => {
    const date = new Date(`${dateStr}:`);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = generateKeyMonthYear(month, year);

    acc[key] = value;
    return acc;
  }, {} as Record<string, number>);

  return inflationPerMonth;
};

const canastaBasicaFirstDateAvailable = "2016-04-01";
const canastaBasicaUrl = `https://apis.datos.gob.ar/series/api/series/?ids=150.1_CSTA_BATAL_0_D_20&format=json&start_date=${canastaBasicaFirstDateAvailable}`;

const getCanastaBasicaPerMonth = async () => {
  const response = await fetch(canastaBasicaUrl, {
    next: {
      revalidate: 1,
    },
  });
  const { data } = (await response.json()) as Response;

  const canastaBasicaPerMonth = data.reduce((acc, [dateStr, value]) => {
    const date = new Date(`${dateStr}:`);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = generateKeyMonthYear(month, year);

    acc[key] = value;
    return acc;
  }, {} as Record<string, number>);

  return canastaBasicaPerMonth;
};

const minimumSalaryFirstDateAvailable = "2016-01-01";
const minimumSalaryUrl = `https://apis.datos.gob.ar/series/api/series/?ids=57.1_SMVMD_0_M_33&start_date=${minimumSalaryFirstDateAvailable}&format=json`;

const getMinimumSalaryPerMonth = async () => {
  const response = await fetch(minimumSalaryUrl, {
    next: {
      revalidate: 1,
    },
  });
  const { data } = (await response.json()) as Response;

  const minimumSalaryPerMonth = data.reduce((acc, [dateStr, value]) => {
    const date = new Date(`${dateStr}:`);

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const key = generateKeyMonthYear(month, year);

    acc[key] = value * 30;
    return acc;
  }, {} as Record<string, number>);

  return minimumSalaryPerMonth;
};

const api = {
  inflationPerMonth: {
    get: getInflationPerMonth,
  },
  canastaBasicaPerMonth: {
    get: getCanastaBasicaPerMonth,
  },
  minimumSalaryPerMonth: {
    get: getMinimumSalaryPerMonth,
  },
};

export default api;
