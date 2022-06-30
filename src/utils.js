import path from 'path';
import __dirname from '../dirname.js';
import chalk from 'chalk';

import { writeFileSync, mkdirSync } from 'fs';

const groupBy = (keys, array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = keys.map(key => obj[key]).join('-');
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

export const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime());
  const dates = [];

  while (date <= endDate) {
    let currDate = new Date(date);
    dates.push({ year: currDate.getFullYear(), month: currDate.getMonth() + 1, day: currDate.getDate() });
    date.setDate(date.getDate() + 1);
  }

  return groupBy(['year', 'month'], dates);
}

export const numberTwoDigits = (number) => `${(number < 10 ? '0' : '')}${number}`;

export const getFileName = (bucket, key) => `${bucket}/${key}`;

export const saveFile = (filename, buffer) => {
  const DOWNLOAD_DIRECTORY = './downloads';
  const filePath = path.join(__dirname, `${DOWNLOAD_DIRECTORY}/${filename}`);
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, buffer.toString());
  console.log(chalk.blue(`Arquivo ${filename} salvo com sucesso.`));
}

export const filterObjectsByDay = (objects, dates) =>
  objects.filter(element => dates.some(key => element.Key.includes(key)));
  
export const formatDate = date => {
  let d = new Date(date);
  let month = (d.getMonth() + 1).toString().padStart(2, '0');
  let day = d.getDate().toString().padStart(2, '0');
  let year = d.getFullYear();
  return [year, month, day].join('/');
}
