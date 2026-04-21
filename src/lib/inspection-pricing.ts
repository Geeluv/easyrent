/** First listing in a bundle is charged at full rate; additional listings get a modest discount. */
export const INSPECTION_FEE_FIRST_NGN = 5000;
export const INSPECTION_FEE_EACH_ADDITIONAL_NGN = 4500;
export const INSPECTION_MAX_PROPERTIES = 10;

export function inspectionFeeTotalNgn(propertyCount: number): number {
  const n = Math.floor(propertyCount);
  if (n < 1 || n > INSPECTION_MAX_PROPERTIES) {
    throw new Error(`Property count must be between 1 and ${INSPECTION_MAX_PROPERTIES}.`);
  }
  if (n === 1) return INSPECTION_FEE_FIRST_NGN;
  return INSPECTION_FEE_FIRST_NGN + (n - 1) * INSPECTION_FEE_EACH_ADDITIONAL_NGN;
}

export function inspectionFeeBreakdownNgn(propertyCount: number): { label: string; amount: number }[] {
  const n = Math.floor(propertyCount);
  if (n < 1 || n > INSPECTION_MAX_PROPERTIES) return [];
  const rows: { label: string; amount: number }[] = [
    { label: "1st property", amount: INSPECTION_FEE_FIRST_NGN },
  ];
  for (let i = 2; i <= n; i++) {
    rows.push({ label: `Property ${i}`, amount: INSPECTION_FEE_EACH_ADDITIONAL_NGN });
  }
  return rows;
}
