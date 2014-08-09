/*jshint eqnull:true, expr:true*/

var _ = {};

(function() {

  _.identity = function(val) {
    return val;
  };

  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  _.last = function(array, n) {
    if (typeof n === "undefined") {
      return array[array.length-1];
    } else if (n === 0) {
      return [];
    } else {
      return array.slice(-n);
    }
  };

  _.each = function(collection, iterator) {
    if (Object.prototype.toString.call(collection) == "[object Object]") {
      var retval = [];
      for (var key in collection) {
        retval.push(iterator(collection[key], key, collection));
      }
      return retval;
    } else {
      return collection.map(iterator);
    }
  };

  _.indexOf = function(array, target){
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {
    var retval = [];
      for (var i = 0; i < collection.length; i++ ) {
        if (test(collection[i])) {
          retval.push(collection[i]);
        }
      }
  return retval;
  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    return _.filter(collection, function(item){ if (!test(item)) return item });
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {
   var exists = [];
   _.each(array,function(item){
     if (exists.indexOf(item) === -1 ){
       exists.push(item);
     }
   })
   return exists;
  };


  // Return the results of applying an iterator to each element.
  _.map = function(collection, iterator) {
    var arr = [];
    for (var i = 0; i < collection.length; i++) {
      arr.push(iterator(collection[i]));
    }
    return arr;
  };

  _.pluck = function(collection, key) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(collection, function(item){
      return item[key];
    });
  };

  // Calls the method named by functionOrKey on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {
    var arr = [];
    for (var i = 0; i < collection.length; i++)
      if (typeof functionOrKey === 'string'){
        arr.push(collection[i][functionOrKey]());
      } else {
        arr.push(functionOrKey.apply(collection[i],args));
      }
    return arr;
 };

  _.reduce = function(collection, iterator, accumulator) {
    var sum = typeof accumulator != 'undefined' ? accumulator : collection[0];
    for (var i = 0; i < collection.length; i++ ) {
      sum = iterator(sum, collection[i]);
    }
    return sum;
  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    if (Object.prototype.toString.call(collection) == "[object Object]") {
      var wasFound = false;
      for (var x in collection) {
        if (x === target);
          wasFound = true;
      }
      return wasFound;
    } else {
      return _.reduce(collection, function(wasFound, item) {
      if (wasFound) {
        return true;
      }
        return item === target;
      }, false);
    }
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    var callback = typeof iterator != 'undefined' ? iterator : _.identity;
    return _.reduce(collection, function(passed, item) {
      if (passed === false){
        return false;
      } else if (!callback(item)){
        return false;
      } else {
        return true;
      }
    }, true);
  };


  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // it really doesn't seem necessary to reuse reduce here, though it can be done.
    var callback = typeof iterator != 'undefined' ? iterator : _.identity;
    var retval = false;
    _.each(collection, function (item){
      if (callback(item)) {
        retval = true
      }
    })
    return retval;
  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {
    for (var i = 0; i < arguments.length; i++){
      for(var key in arguments[i]) {
        obj[key] = arguments[i][key];
      }
    }
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    for (var i = 0; i < arguments.length; i++){
      for(var key in arguments[i]) {
        if (typeof obj[key] === 'undefined') {
          obj[key] = arguments[i][key];
        }
      }
    }
    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // information from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // _.memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.

_.memoize = function(func) {
    var memo = {};
    return function(){
      var key = _.identity.apply(this, arguments);
      return typeof memo[key] === 'undefined' ? (memo[key] = func.apply(this, arguments)) : memo[key];
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments,2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {
  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {
  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
  };


  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {
  };

}).call(this);
