let outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 20;
  const [testSet, trainSet] = splitDataset(normalize(outputs, 3), testSetSize);

  _.range(1, 15).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(
        testObj => knn(trainSet, _.initial(testObj), k) === _.last(testObj)
      )
      .size()
      .divide(testSetSize)
      .value();
    console.log("k: ", k, "Accuracy: ", accuracy);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map(row => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy(row => row[0])
    .slice(0, k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function normalize(data, featureCount) {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);
    const min = _.min(column);
    const max = _.max(column);
    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }
  return clonedData;
}

const distance = (pointA, pointB) => {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
};

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainSet = _.slice(shuffled, testCount);

  return [testSet, trainSet];
};
