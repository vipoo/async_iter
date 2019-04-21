"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persisted = persisted;

var _storage = require("./storage");

async function persisted(source, path) {
  const {
    push,
    stop,
    items,
    consumerHasStopped
  } = await (0, _storage.open)(path);
  setTimeout(async () => {
    for await (const item of source) {
      if (consumerHasStopped()) break;
      await push(item);
    }

    await stop();
  }, 0);
  return items;
}