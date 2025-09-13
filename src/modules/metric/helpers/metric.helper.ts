/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-implied-eval */

export interface UnitConversionData {
  conversionToBase: string;
  conversionFromBase: string;
  metricTypeId: number;
}

export function convertUnitValue(
  value: number,
  fromUnit: UnitConversionData,
  toUnit: UnitConversionData,
): number {
  if (fromUnit.metricTypeId !== toUnit.metricTypeId) {
    throw new Error('Cannot convert between different metric types');
  }

  const convertToBase = new Function(
    'x',
    `return ${fromUnit.conversionToBase}`,
  );
  const baseValue = convertToBase(value);

  const convertFromBase = new Function(
    'x',
    `return ${toUnit.conversionFromBase}`,
  );
  const finalValue = convertFromBase(baseValue);

  return finalValue;
}
