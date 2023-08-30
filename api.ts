import { generateKeyMonthYear } from "./utils";

interface Response {
  data: [string, number][];
}

const firstDateAvailable = "2017-01-01";
const inflationUrl = `https://apis.datos.gob.ar/series/api/series/?ids=145.3_INGNACUAL_DICI_M_38&collapse=month&start_date=${firstDateAvailable}&format=json`;

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

    console.log({ dateStr, month, year });

    const key = generateKeyMonthYear(month, year);

    acc[key] = value;
    return acc;
  }, {} as Record<string, number>);

  return inflationPerMonth;
};

const api = {
  inflationPerMonth: {
    get: getInflationPerMonth,
  },
};

export default api;
