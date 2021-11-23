import moment from 'moment';

export function parseEvents(inputEvents) {
  let Events_output = inputEvents.map(parseEvent);
  return Events_output;
}

export function parseEvent(inputEvent) {
  let event = inputEvent.toObject();
    let fromDate = moment(event.startDate).format('ddd D MMM YYYY, hh:mm A');
    let toDate = moment(event.endDate).format('hh:mm A');
    event.durationString = `${fromDate} to ${toDate}`;
    return event;
}