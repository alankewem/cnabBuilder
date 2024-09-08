'use strict'

import { groupSegmentsByPayersNames, searchBillsByPayerName } from "./utils.mjs"
import { messageToSegmentArgumentOutput, messageToPayerArgumentOutput } from "./messageBuilder.mjs"

const log = console.log

export function handleSegmentSearch(cnabBody, segment, from, to) {
  const groupedSegments = groupSegmentsByPayersNames(cnabBody)

  switch (String(segment).toLocaleLowerCase()) {
    case 'p':
      groupedSegments.forEach((segments, payerName) => {
        segments.P.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "P", from, to, payerName));
        });
      });
      break;
    case 'q':
      groupedSegments.forEach((segments, payerName) => {
        segments.Q.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "Q", from, to, payerName));
        });
      });
      break;
    case 'r':
      groupedSegments.forEach((segments, payerName) => {
        segments.R.forEach(({ content }) => {
          log(messageToSegmentArgumentOutput(content, "R", from, to, payerName));
        });
      });
      break;
    default:
      log('Segmento inválido. Utilize "p", "q" ou "r".');
  }
}

export function handlePayerSearch(cnabBody, payerName) {
  const groupedSegments = groupSegmentsByPayersNames(cnabBody)
  const matchedBills = searchBillsByPayerName(groupedSegments, payerName);

  matchedBills.forEach(({ name, bill }) => {
    log(messageToPayerArgumentOutput(name, bill))
  })
}