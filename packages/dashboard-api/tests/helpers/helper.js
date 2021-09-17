// Define function to help compare 2 object by structure
const helperCompareObject = {
  hasEqualStructure: (obj1, obj2) => {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    } else {
      return Object.keys(obj1).every((key) => {
        if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
        else return true;
      });
    }
  },
};

//define function to help compare 2 array object by structure
const helperCompareArray = {
  hasEqualArrayStructure: (arr1, arr2) => {
    let checked = false;
    for (let i = 0; i < arr1.length; i++) {
      if (!helperCompareObject.hasEqualStructure(arr1[i], arr2[i])) {
        checked = false;
        break;
      } else if (helperCompareObject.hasEqualStructure(arr1[i], arr2[i])) {
        checked = true;
      }
    }
    return checked;
  },
};
module.exports = {
  helperCompareObject,
  helperCompareArray,
};
