const EventEmitter = require('events');
const eventDispatcher = new EventEmitter();

const EventType = {
  FindCollectionAttributes: 'find-collection-attributes',
  Refresh: 'refresh',
};

module.exports = {eventDispatcher, EventType};
