import AsyncStorage from '@react-native-async-storage/async-storage';

import { StorageService } from '../StorageService';

describe('StorageService', () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockReset();
    AsyncStorage.getAllKeys.mockReset();
    AsyncStorage.multiGet.mockReset();
    AsyncStorage.setItem.mockReset();
  });

  it('should get an item from storage', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify({ key: 'value' }));

    const item = await StorageService.get('key');

    expect(AsyncStorage.getItem).toHaveBeenCalledWith('key');
    expect(item).toEqual({ key: 'value' });
  });

  it('should get all items from storage', async () => {
    const mockKeys = ['key1', 'key2'];
    const mockItems = [
      ['key1', JSON.stringify({ item1: 'value1' })],
      ['key2', JSON.stringify({ item2: 'value2' })],
    ];

    AsyncStorage.getAllKeys.mockResolvedValue(mockKeys);
    AsyncStorage.multiGet.mockResolvedValue(mockItems);

    const items = await StorageService.getAll();

    expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
    expect(AsyncStorage.multiGet).toHaveBeenCalledWith(mockKeys);
    expect(items).toEqual({
      key1: { item1: 'value1' },
      key2: { item2: 'value2' },
    });
  });

  it('should set an item in storage', async () => {
    const itemToSet = { someKey: 'someValue' };

    await StorageService.set('someKey', itemToSet);

    expect(AsyncStorage.setItem).toHaveBeenCalledWith('someKey', JSON.stringify(itemToSet));
  });
});
