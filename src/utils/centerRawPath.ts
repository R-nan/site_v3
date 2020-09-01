enum GetMaxType {
  HEIGHT = 'height',
  WIDTH = 'width',
};

const getMax = (rawPath: any, type: GetMaxType) => {
  const xPositions = rawPath.map((item: any) => {
    return item.filter((point: any, pointIndex: any) => pointIndex % 2 === (type === GetMaxType.WIDTH ? 0 : 1));
  });

  const maxInEachArray = xPositions.map((item: any) => Math.max.apply(Math, item));

  return Math.max.apply(null, maxInEachArray);
}

const applyModifier = (rawPath: any, modify: (item: any, index: number) => void) => {
  const paths = 
    rawPath.map((pathArray: any) => 
      pathArray.map((path: any, index: number) => modify(path, index))
    );

  return paths;
}

const centerRawPath = (rawPath: gsap.plugins.RawPath, boundX: number, boundY: number, size: number) => {
  // at the moment only scale to width

  // get width of path
  const pathWidth = getMax(rawPath, GetMaxType.WIDTH);
  // get height of path
  // const pathHeight = getMax(rawPath, GetMaxType.HEIGHT);

  // check canvas bounds to see how much to scale
  // get scale
  const scale = (boundX * size) / pathWidth;

  // apply scale to every value in rawPath
  const scaledRawPath = applyModifier(rawPath, (item) => item * scale)

  // get width of scaled path
  const scaledWidth = getMax(scaledRawPath, GetMaxType.WIDTH);

  // get height of scaled path
  const scaledHeight = getMax(scaledRawPath, GetMaxType.HEIGHT);

  // compare with canvas bounds to see how much we need to offset
  const offsetX = (boundX - scaledWidth) / 2;
  const offsetY = (boundY - scaledHeight) / 2;
  
  // apply offsetX to all even indices
  // apply offsetY to all odd indices

  const centeredRawPath = applyModifier(scaledRawPath, (item: any, index: number) => {
    if (index % 2 === 0) {
      return item + offsetX;
    } else {
      return item + offsetY;
    }
  })

  // return new array
  return centeredRawPath;

}

export default centerRawPath;