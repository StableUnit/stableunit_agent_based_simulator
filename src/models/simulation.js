export default {
  state: 0,
  reducers: {
    increment: state => state + 1
  },
  effects: {
    // handle state changes with impure functions.
    // use async/await for async actions
    async start(_, rootState) {
      while (true) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.increment();
      }
    }
  }
};
