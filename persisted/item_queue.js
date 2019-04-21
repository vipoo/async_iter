"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pushItem = pushItem;
exports.popItem = popItem;
exports.restoreUnprocessedItems = restoreUnprocessedItems;
exports.isEmpty = isEmpty;

var _uuid = require("../lib/uuid");

var _path = require("path");

var _fs2 = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = _fs2.default.promises;

const delay = period => new Promise(res => setTimeout(res, period));

async function pushItem(readDirectory, writingDirectory, data) {
  const name = `${process.hrtime.bigint()}-${(0, _uuid.uuidv4)()}`;
  const filename = (0, _path.join)(writingDirectory, name);
  await fs.writeFile(filename, data);
  await fs.rename(filename, (0, _path.join)(readDirectory, name));
}

async function popItem(readDirectory, processingDirectory) {
  let x;

  do {
    x = await fs.readdir(readDirectory);
    if (x.length === 0) delay(100);
  } while (x.length === 0);

  const name = x.sort()[0];
  const filename = (0, _path.join)(processingDirectory, name);
  await fs.rename((0, _path.join)(readDirectory, name), filename);
  return filename;
}

async function restoreUnprocessedItems(readDirectory, processingDirectory) {
  const x = await fs.readdir(processingDirectory);

  for (const f of x) await fs.rename((0, _path.join)(processingDirectory, f), (0, _path.join)(readDirectory, f));
}

async function isEmpty(readDirectory) {
  return await fs.readdir(readDirectory).then(x => x.length === 0).catch(() => true);
}