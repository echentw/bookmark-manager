interface Identifiable {
  id: string;
}

// Returns a copy of the input array, with the item replaced.
// If the item is not found in the array, then a copy of the original array is returned.
export function withItemReplaced<T extends Identifiable>(items: T[], newItem: T): T[] {
  const newItems = items.map((item: T) => {
    if (item.id === newItem.id) {
      return newItem;
    } else {
      return item;
    }
  });
  return newItems;
}

// Returns a copy of the input array, with the item deleted.
// If the item is not found in the array, then a copy of the original array is returned.
export function withItemDeleted<T extends Identifiable>(items: T[], itemToDelete: T): T[] {
  const newItems = items.filter((item: T) => {
    return item.id !== itemToDelete.id;
  });
  return newItems;
}

// Returns a random id.
export function randomId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let id = '';
  for (let i = 0; i < 8; ++i) {
    const index = Math.floor(Math.random() * chars.length);
    id += chars[index];
  }
  return id;
}
