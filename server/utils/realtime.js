let ioInstance = null;

export const setRealtimeServer = (io) => {
  ioInstance = io;
};

export const emitChange = (event, payload = {}) => {
  if (!ioInstance) return;
  ioInstance.emit(event, { ...payload, at: new Date().toISOString() });
};
