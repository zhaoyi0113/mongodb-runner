const EventEmitter = require('events');
const eventDispatcher = new EventEmitter();

const EventType = {
  FindCollectionAttributes: 'find-collection-attributes',
  Refresh: 'refresh',
  Connect: 'connect',
  Disconnect: 'disconnect',
};

module.exports = {eventDispatcher, EventType};
