"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.open = open;

var _path = require("path");

var _mkdirpPromise = _interopRequireDefault(require("mkdirp-promise"));

var _fs2 = _interopRequireDefault(require("fs"));

var _rmfr = _interopRequireDefault(require("rmfr"));

var _item_queue = require("./item_queue");

var _stop_flaging = require("./stop_flaging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fs = _fs2.default.promises;

function dirs(storeDirectory) {
  storeDirectory = (0, _path.resolve)(storeDirectory);
  const readDirectory = (0, _path.join)(storeDirectory, 'reading');
  const processingDirectory = (0, _path.join)(storeDirectory, 'processing');
  const writingDirectory = (0, _path.join)(storeDirectory, 'writing');
  return {
    readDirectory,
    processingDirectory,
    writingDirectory
  };
}

async function writeStopMarker(storeDirectory, readDirectory, writingDirectory) {
  await (0, _item_queue.pushItem)(readDirectory, writingDirectory, '');
  await (0, _stop_flaging.flagAsStop)(storeDirectory);
}

async function push(readDirectory, writingDirectory, data) {
  return (0, _item_queue.pushItem)(readDirectory, writingDirectory, data);
}

async function* items(readDirectory, processingDirectory, consumerStopped) {
  await (0, _item_queue.restoreUnprocessedItems)(readDirectory, processingDirectory);

  try {
    while (true) {
      const filename = await (0, _item_queue.popItem)(readDirectory, processingDirectory);
      const item = await fs.readFile(filename);

      if (item.length === 0) {
        fs.unlink(filename);
        break;
      }

      yield {
        value: item,
        completed: () => fs.unlink(filename)
      };
    }
  } finally {
    consumerStopped();
  }
}

async function open(storeDirectory) {
  var _readDirectory, _writingDirectory, _push, _storeDirectory, _readDirectory2, _writingDirectory2, _writeStopMarker;

  const {
    readDirectory,
    processingDirectory,
    writingDirectory
  } = dirs(storeDirectory);
  let _consumerHasStopped = false;

  const consumerHasStopped = () => _consumerHasStopped;

  const consumerStopped = () => {
    _consumerHasStopped = true;
  };

  if (await (0, _stop_flaging.hasStoppedFlag)(storeDirectory)) {
    if (!(await (0, _item_queue.isEmpty)(readDirectory))) throw new Error('Attempt to restart when a previous stopped non-empty iteration exists');
    await (0, _rmfr.default)(storeDirectory);
  }

  await Promise.all([(0, _mkdirpPromise.default)(readDirectory), (0, _mkdirpPromise.default)(processingDirectory), (0, _mkdirpPromise.default)(writingDirectory)]);
  return {
    push: (_push = push, _readDirectory = readDirectory, _writingDirectory = writingDirectory, function push(_argPlaceholder) {
      return _push(_readDirectory, _writingDirectory, _argPlaceholder);
    }),
    stop: (_writeStopMarker = writeStopMarker, _storeDirectory = storeDirectory, _readDirectory2 = readDirectory, _writingDirectory2 = writingDirectory, function writeStopMarker(_argPlaceholder2) {
      return _writeStopMarker(_storeDirectory, _readDirectory2, _writingDirectory2, _argPlaceholder2);
    }),
    consumerHasStopped,
    items: items(readDirectory, processingDirectory, consumerStopped)
  };
}