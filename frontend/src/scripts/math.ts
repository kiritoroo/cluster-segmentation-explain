Math.clamp = (value: number, min: number, max: number): number => {
  if (value < min) {
    return min
  } else if (value > max) {
    return max;
  }

  return value;
}

Math.lerp = (start: number, end: number, amt: number): number => {
  return (1 - amt) * start + amt * end;
}


Math.median = (arr: Array<number>): number => {
  arr = arr.filter(val => val !== undefined);
  arr.sort(function(a, b) {
    return a - b;
  });

  let mid = Math.floor(arr.length / 2);

  if (arr.length % 2 === 0) {
    return (arr[mid - 1] + arr[mid]) / 2;
  } else {
    return arr[mid];
  }
}

Math.mularr = (arr1: Array<number>, arr2: Array<number>): Array<number> => {
  if (arr1.length !== arr2.length) {
    throw new Error('Arrays must have same length');
  }

  const result = [];

  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] * arr2[i]);
  }

  return result;
}

Math.minMaxScale = (value: number, min: number, max: number, new_min: number, new_max: number): number => {
  return (value - min) / (max - min) * (new_max - new_min) + new_min
}

Math.randSample = (list: Array<any>, count: number) => {
  const shuffled = list.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export {};