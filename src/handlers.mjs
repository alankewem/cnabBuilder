'use strict'

import { writeFile } from 'fs/promises'

import { groupSegmentsByPayersNames, searchBillsByPayerName } from "./utils.mjs"
import { messageToSegmentArgumentOutput, messageToPayerArgumentOutput, messageToFileExportationOutput } from "./messageBuilder.mjs"
import { extractSegmentP, extractSegmentQ } from "./constants/cnab240.mjs"
import { randomUUID } from 'crypto'

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

export async function handleExportation(cnabBody) {
  const bills = []

  for (let i = 0; i < cnabBody.length; i += 3) {
    const segmentP = cnabBody[i]
    const segmentQ = cnabBody[i + 1]

    const bill = {
      ...extractSegmentP(segmentP, i + 3),
      ...extractSegmentQ(segmentQ, i + 4),

    }

    bills.push(bill)
  }

  const fileName = `${randomUUID()}.json`
  await writeFile(fileName, JSON.stringify(bills, null, 2), "utf8")
  log(messageToFileExportationOutput(fileName))
}