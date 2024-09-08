'use strict'

import { SEGMENT_Q } from "./constants/cnab240.mjs";

export function groupSegmentsByPayersNames(cnabArray) {
  const groupedBills = new Map();

  // Processa as linhas do CNAB de 3 em 3 (cada conjunto P, Q, R)
  for (let i = 0; i < cnabArray.length; i += 3) {
    const segmentP = cnabArray[i];
    const segmentQ = cnabArray[i + 1];
    const segmentR = cnabArray[i + 2];

    const payerName = segmentQ.substring(SEGMENT_Q.PAYER_NAME.position[0] - 1, SEGMENT_Q.PAYER_NAME.position[1]).trim();

    if (!groupedBills.has(payerName)) {
      groupedBills.set(payerName, { P: [], Q: [], R: [] });
    }

    const segments = groupedBills.get(payerName);
    segments.P.push({ content: segmentP, line: i + 3 });
    segments.Q.push({ content: segmentQ, line: i + 4 });
    segments.R.push({ content: segmentR, line: i + 5 });
  }

  return groupedBills
}

export function searchBillsByPayerName(groupedSegments, payerName) {
  const matchedBills = [];

  for (const [payer, segment] of groupedSegments.entries()) {
    const nameMatch = String(payer).toLowerCase().includes(String(payerName).toLowerCase());

    if (nameMatch) {
      segment.P.forEach((_, index) => {
        matchedBills.push({ name: payer, bill: [segment.P[index], segment.Q[index], segment.R[index]] });
      });
    }
  }
  return matchedBills;
}

export function sliceArrayPosition(arr, ...positions) {
  return [...arr].slice(...positions)
}

export function formatDateCNAB(dateCNAB) {
  if (dateCNAB.length !== 8) {
    throw new Error('Formato de data inválido. Deve ser no formato ddmmaa.');
  }

  const day = dateCNAB.substring(0, 2);
  const month = dateCNAB.substring(2, 4);
  const year = dateCNAB.substring(4, 8);


  return `${day}/${month}/${year}`;
}