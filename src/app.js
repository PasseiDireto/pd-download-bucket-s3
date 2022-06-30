#!/usr/bin/env node
import { listAllObjects, getObject } from './services/aws.js';
import { getDatesInRange, numberTwoDigits, filterObjectsByDay, getFileName, saveFile, formatDate } from './utils.js';
import { Command } from 'commander';

import 'dotenv/config';
import chalk from 'chalk';

const program = new Command();
const sevenDaysAgo = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));

program
  .option('-e, --environment <env>', 'environment that wants to download the data (dev or prod)', 'prod')
  .option('-sd, --startDate <date>', 'date you want to start downloads. Format: YYYY/MM/DD', formatDate(sevenDaysAgo))
  .option('-ed, --endDate <date>', 'date you want to finish downloads. Format: YYYY/MM/DD', formatDate(new Date()))
  .parse();

const { environment, startDate, endDate } = program.opts();
const allowedEnvironments = ['dev', 'prod'];

if (!allowedEnvironments.includes(environment)) {
  throw new Error(`O environment ${environment} não existe. Escolha uma das seguintes opções: ${allowedEnvironments.join(', ')}`)
}

const BUCKETS = {
  dev: process.env.BUCKET_DEV,
  prod: process.env.BUCKET_PROD
};

const chosenBucket = BUCKETS[environment];

console.log(chalk.grey(`Iniciando processamento às ${new Date()}`));
console.log(chalk.underline.grey('Buscando todos os objetos...'));

const dateRangeByYearAndMonth = getDatesInRange(new Date(startDate), new Date(endDate));
const allObjects = await Promise.all(
  Object.keys(dateRangeByYearAndMonth).map(date => {
    const [year, month] = date.split('-');
    return listAllObjects({ Bucket: chosenBucket, Prefix: `${year}/${month}` })
  })
);

const objectsContent = allObjects.flatMap(element => element.Contents);

const formattedDays = Object.values(dateRangeByYearAndMonth).flatMap((daysOfMonth) =>
  daysOfMonth.map(({ year, month, day }) => `${numberTwoDigits(day)}_${numberTwoDigits(month)}_${year}`))

const objectsToDownload = filterObjectsByDay(objectsContent, formattedDays);
console.log(chalk.bold.grey('Iniciando download dos arquivos encontrados...'));

const filesWithError = [];
for (const { Key } of objectsToDownload) {
  try {
    const objectBuffer = await getObject({
      Bucket: chosenBucket,
      Key
    });

    const filename = getFileName(chosenBucket, Key);
    saveFile(filename, objectBuffer.Body);
  } catch (error) {
    filesWithError.push(`Bucket: ${chosenBucket} | Arquivo: ${Key}`);
    console.error(`Erro no Bucket: ${chosenBucket} | Arquivo: ${Key}. Error:`, error);
  }
}

console.log(chalk.green(`Processo de download finalizado às ${new Date()}.`));
console.log(`${filesWithError.length} erros encontrados.`);
if (filesWithError.length) {
  console.log(chalk.red(`Arquivos com erro:\n${filesWithError.join('\n')}`));
}
