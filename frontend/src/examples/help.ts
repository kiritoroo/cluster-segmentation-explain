type Point = [number, number];

class KMeans {
  private k: number;
  private points: Point[];
  private centroids: Point[];

  constructor(k: number, points: Point[]) {
    this.k = k;
    this.points = points;
    this.centroids = this.initializeCentroids(k, points);
  }

  private initializeCentroids(k: number, points: Point[]): Point[] {
    const centroids: Point[] = [];
    centroids.push(points[Math.floor(Math.random() * points.length)]);

    for (let i = 1; i < k; i++) {
      let sum = 0;
      const distances: number[] = [];
      for (const point of points) {
        let minDistance = Number.MAX_VALUE;
        for (const centroid of centroids) {
          const distance = this.euclideanDistance(point, centroid);
          minDistance = Math.min(minDistance, distance);
        }
        distances.push(minDistance);
        sum += minDistance;
      }

      const threshold = Math.random() * sum;
      sum = 0;
      let j = 0;
      while (sum < threshold && j < points.length) {
        sum += distances[j];
        j++;
      }
      centroids.push(points[j - 1]);
    }

    return centroids;
  }

  private euclideanDistance(point1: Point, point2: Point): number {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  }

  private assignPointsToCentroids(): Map<Point, Point[]> {
    const pointCentroidMap = new Map<Point, Point[]>();

    for (const point of this.points) {
      let minDistance = Number.MAX_VALUE;
      let closestCentroid: Point = this.centroids[0];
      for (const centroid of this.centroids) {
        const distance = this.euclideanDistance(point, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroid = centroid;
        }
      }

      if (pointCentroidMap.has(closestCentroid)) {
        pointCentroidMap.get(closestCentroid)?.push(point);
      } else {
        pointCentroidMap.set(closestCentroid, [point]);
      }
    }

    return pointCentroidMap;
  }

  private calculateNewCentroids(pointCentroidMap: Map<Point, Point[]>): Point[] {
    const newCentroids: Point[] = [];

    for (const [centroid, points] of pointCentroidMap.entries()) {
      const numPoints = points.length;
      let sumX = 0;
      let sumY = 0;
      for (const point of points) {
        const [x, y] = point;
        sumX += x;
        sumY += y;
      }
      newCentroids.push([sumX / numPoints, sumY / numPoints]);
    }

    return newCentroids;
  }

  public run(maxIterations = 100): Point[][] {
    let iteration = 0;
    let hasChanged = true;

    while (iteration < maxIterations && hasChanged) {
      hasChanged = false;

      const pointCentroidMap = this.assignPointsToCentroids();
      const newCentroids = this.calculateNewCentroids(pointCentroidMap);

      for (let i = 0; i < this.k; i++) {
        if (this.euclideanDistance(this.centroids[i], new
