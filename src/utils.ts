interface WithId {
  id: string;
}

// Returns a copy of the input array, with the item replaced.
// If the item is not found in the array, then a copy of the original array is returned.
export function withItemReplaced<T extends WithId>(items: T[], newItem: T): T[] {
  const newItems = items.slice(0); // copies the array
  const index = items.findIndex((item: T) => {
    return item.id === newItem.id;
  });
  if (index !== -1) {
    newItems[index] = newItem;
  }
  return newItems;
}

// Returns a copy of the input array, with the item deleted.
// If the item is not found in the array, then a copy of the original array is returned.
export function withItemDeleted<T extends WithId>(items: T[], itemToDelete: T): T[] {
  const newItems = items.slice(0); // copies the array
  const index = items.findIndex((item: T) => {
    return item.id === itemToDelete.id;
  });
  if (index !== -1) {
    newItems.splice(index, 1);
  }
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
