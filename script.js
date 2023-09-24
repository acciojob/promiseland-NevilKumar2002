// complete the js code
// class CustomPromise {
//   // write your code here
// }
class CustomPromise {
  constructor() {
    this.state = 'pending';
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.onFinallyCallbacks = [];
  }

  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled';
      this.value = value;
      this.onFulfilledCallbacks.forEach(callback => callback(this.value));
      this.onFinallyCallbacks.forEach(callback => callback());
    }
  }

  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected';
      this.reason = reason;
      this.onRejectedCallbacks.forEach(callback => callback(this.reason));
      this.onFinallyCallbacks.forEach(callback => callback());
    }
  }

  then(onFulfilled, onRejected) {
    const newPromise = new CustomPromise();

    const fulfilledHandler = value => {
      try {
        if (typeof onFulfilled === 'function') {
          const result = onFulfilled(value);
          if (result instanceof CustomPromise) {
            result.then(newPromise.resolve.bind(newPromise), newPromise.reject.bind(newPromise));
          } else {
            newPromise.resolve(result);
          }
        } else {
          newPromise.resolve(value);
        }
      } catch (error) {
        newPromise.reject(error);
      }
    };

    const rejectedHandler = reason => {
      try {
        if (typeof onRejected === 'function') {
          const result = onRejected(reason);
          if (result instanceof CustomPromise) {
            result.then(newPromise.resolve.bind(newPromise), newPromise.reject.bind(newPromise));
          } else {
            newPromise.resolve(result);
          }
        } else {
          newPromise.reject(reason);
        }
      } catch (error) {
        newPromise.reject(error);
      }
    };

    if (this.state === 'fulfilled') {
      setTimeout(() => fulfilledHandler(this.value), 0);
    } else if (this.state === 'rejected') {
      setTimeout(() => rejectedHandler(this.reason), 0);
    } else {
      this.onFulfilledCallbacks.push(fulfilledHandler);
      this.onRejectedCallbacks.push(rejectedHandler);
    }

    return newPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    if (typeof onFinally === 'function') {
      this.onFinallyCallbacks.push(onFinally);
    }
    return this;
  }
}

// Example usage:
const promise = new CustomPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success");
    // reject("Error");
  }, 1000);
});

promise
  .then(result => {
    console.log("Fulfilled:", result);
    return "New Value";
  })
  .catch(error => {
    console.error("Rejected:", error);
    throw new Error("New Error");
  })
  .finally(() => {
    console.log("Finally callback");
  });


window.CustomPromise = CustomPromise;
