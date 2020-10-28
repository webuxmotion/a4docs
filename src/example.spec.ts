class List {
  items = [];

  addItem(name) {
    this.items.push(name);
    this.logAction(name);
  }

  logAction(title) {
    global.console.log(`${title} is added!`)
  }

  removeItem(name) {
    const idx = this.items.indexOf(name);

    if (idx === -1) {
      throw new Error('Item not found!');
    }

    this.items.splice(idx, 1);
  }
}

describe('List', () => {
  const name = 'Olexandra';
  let list;

  beforeEach(() => {
    list = new List();
  });

  it('initializes items list', () => {
    expect(list.items.length).toEqual(0);
  });

  it('adds a Item to the list', () => {
    list.addItem(name);

    expect(list.items.length).toEqual(1);
  });

  it('log added action', () => {
    list.logAction = jest.fn();
    
    expect(list.logAction).not.toHaveBeenCalled();

    list.addItem(name);

    expect(list.logAction).toHaveBeenCalled();
    expect(list.logAction).toHaveBeenCalledWith(name);
  });

  describe('removeItem', () => {
    it('remove from list', () => {
      list.addItem(name);
      expect(list.items[0]).toEqual(name);

      list.removeItem(name);
      expect(list.items[0]).toBeUndefined();
    });

    it('throw an error item not exist', () => {
      expect(() => list.removeItem(name)).toThrow();
    });
  })
});