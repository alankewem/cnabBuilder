'use strict'

import { groupSegmentsByDebtorsNames, searchBillsByDebtorName } from "./utils.mjs"
import { messageToSegmentArgumentOutput, messageToDebtorArgumentOutput } from "./messageBuilder.mjs"

const log = console.log

export function handleSegmentSearch(cnabBody, segment, from, to) {
  const groupedSegments = groupSegmentsByDebtorsNames(cnabBody)

  switch (String(segment).toLocaleLowerCase()) {
    case 'p':
      groupedSegments.forEach((segments, debtorName) => {
        segments.P.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "P", from, to, debtorName));
        });
      });
      break;
    case 'q':
      groupedSegments.forEach((segments, debtorName) => {
        segments.Q.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "Q", from, to, debtorName));
        });
      });
      break;
    case 'r':
      groupedSegments.forEach((segments, debtorName) => {
        segments.R.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "R", from, to, debtorName));
        });
      });
      break;
    default:
      log('Segmento inválido. Utilize "p", "q" ou "r".');
  }
}

export function handleDebtorSearch(cnabBody, debtorName) {
  const groupedSegments = groupSegmentsByDebtorsNames(cnabBody)
  const matchedBills = searchBillsByDebtorName(groupedSegments, debtorName);

  matchedBills.forEach(({ name, bill }) => {
    log(messageToDebtorArgumentOutput(name, bill))
  })
}