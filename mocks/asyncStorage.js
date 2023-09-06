let mockStorage = {};

const mockAsyncStorage = {
  setItem: jest.fn(async (key, value) => {
    mockStorage[key] = value;
  }),
  getItem: jest.fn(async key => {
    return mockStorage[key] || null;
  }),
  removeItem: jest.fn(async key => {
    delete mockStorage[key];
  }),
  clear: jest.fn(async () => {
    mockStorage = {};
  }),
};

export default mockAsyncStorage;
