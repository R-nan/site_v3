import Vector from "./Vector";

export const random = (min, max) => {
  let rand;
  rand = Math.random();

  if (typeof min === 'undefined') {
    return rand;
  } else if (typeof max === 'undefined') {
    if (min instanceof Array) {
      return min[Math.floor(rand * min.length)];
    } else {
      return rand * min;
    }
  } else {
    if (min > max) {
      const tmp = min;
      min = max;
      max = tmp;
    }

    return rand * (max - min) + min;
  }
};

export const randomInArray = (array) => {
  const randomIndex = random(0, array.length - 1);

  return {
    value:array[Math.floor(randomIndex)],
    index: Math.floor(randomIndex)
  };
};

export const randomVectorsPositions = (width, height, count) => {
  let positions = [];
  for (let i = 0; i < count; i++) {
    positions.push(new Vector(Math.random() * width, Math.random() * height));
  }

  return positions;
}

export default random;
