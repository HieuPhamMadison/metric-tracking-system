// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.unit.deleteMany();
  await prisma.metricType.deleteMany();

  console.log('Deleted all units and metric types');
  console.log('Creating metric types and units');

  const distance = await prisma.metricType.create({
    data: {
      name: 'Distance',
      units: {
        create: [
          {
            name: 'Meter',
            symbol: 'm',
            conversionToBase: 'x',
            conversionFromBase: 'x',
          },
          {
            name: 'Centimeter',
            symbol: 'cm',
            conversionToBase: 'x / 100',
            conversionFromBase: 'x * 100',
          },
          {
            name: 'Inch',
            symbol: 'in',
            conversionToBase: 'x * 0.0254',
            conversionFromBase: 'x / 0.0254',
          },
          {
            name: 'Feet',
            symbol: 'ft',
            conversionToBase: 'x * 0.3048',
            conversionFromBase: 'x / 0.3048',
          },
          {
            name: 'Yard',
            symbol: 'yd',
            conversionToBase: 'x * 0.9144',
            conversionFromBase: 'x / 0.9144',
          },
        ],
      },
    },
  });

  console.log('Created distance metric type and units');
  console.log('Creating temperature metric type and units');

  const temperature = await prisma.metricType.create({
    data: {
      name: 'Temperature',
      units: {
        create: [
          {
            name: 'Celsius',
            symbol: '°C',
            conversionToBase: 'x',
            conversionFromBase: 'x',
          },
          {
            name: 'Fahrenheit',
            symbol: '°F',
            conversionToBase: '(x - 32) * 5 / 9',
            conversionFromBase: '(x * 9 / 5) + 32',
          },
          {
            name: 'Kelvin',
            symbol: 'K',
            conversionToBase: 'x - 273.15',
            conversionFromBase: 'x + 273.15',
          },
        ],
      },
    },
  });

  console.log('Created temperature metric type and units');
  console.log('Seeding completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
