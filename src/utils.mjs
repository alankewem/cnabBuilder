'use strict'

export function groupSegmentsByDebtorsNames(cnabArray) {
  const groupedBills = new Map();

  // Processa as linhas do CNAB de 3 em 3 (cada conjunto P, Q, R)
  for (let i = 0; i < cnabArray.length; i += 3) {
    const segmentP = cnabArray[i];
    const segmentQ = cnabArray[i + 1];
    const segmentR = cnabArray[i + 2];

    const debtorName = segmentQ.substring(33, 73).trim();

    if (!groupedBills.has(debtorName)) {
      groupedBills.set(debtorName, { P: [], Q: [], R: [] });
    }

    const segments = groupedBills.get(debtorName);
    segments.P.push({ content: segmentP, line: i + 3 });
    segments.Q.push({ content: segmentQ, line: i + 4 });
    segments.R.push({ content: segmentR, line: i + 5 });
  }

  return groupedBills
}

export function searchBillsByDebtorName(groupedSegments, debtorName) {
  const matchedBills = [];

  for (const [debtor, segment] of groupedSegments.entries()) {
    const nameMatch = String(debtor).toLowerCase().includes(String(debtorName).toLowerCase());

    if (nameMatch) {
      segment.P.forEach((_, index) => {
        matchedBills.push({ name: debtor, bill: [segment.P[index], segment.Q[index], segment.R[index]] });
      });
    }
  }
  return matchedBills;
}

export function sliceArrayPosition(arr, ...positions) {
  return [...arr].slice(...positions)
}