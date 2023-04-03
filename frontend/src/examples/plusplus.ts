export class KMeansPlusPlus {
    constructor(private points: number[][], private k: number) {}
  
    public run(): number[][] {
      const centroids: number[][] = [];
      centroids.push(this.points[Math.floor(Math.random() * this.points.length)]);
  
      while (centroids.length < this.k) {
        const distances: number[] = [];
        let totalDistance = 0;
  
        for (const point of this.points) {
          const nearestCentroid = this.getNearestCentroid(point, centroids);
          const distance = this.getDistance(point, nearestCentroid);
          distances.push(distance);
          totalDistance += distance;
        }
  
        let randomValue = Math.random() * totalDistance;
  
        for (let i = 0; i < distances.length; i++) {
          randomValue -= distances[i];
  
          if (randomValue < 0) {
            centroids.push(this.points[i]);
            break;
          }
        }
      }
  
      return centroids;
    }
  
    private getNearestCentroid(point: number[], centroids: number[][]): number[] {
      let nearestCentroid = centroids[0];
      let minDistance = this.getDistance(point, nearestCentroid);
  
      for (const centroid of centroids.slice(1)) {
        const distance = this.getDistance(point, centroid);
  
        if (distance < minDistance) {
          nearestCentroid = centroid;
          minDistance = distance;
        }
      }
  
      return nearestCentroid;
    }
  
    private getDistance(pointA: number[], pointB: number[]): number {
      let distance = 0;
  
      for (let i = 0; i < pointA.length; i++) {
        distance += (pointA[i] - pointB[i]) ** 2;
      }
  
      return Math.sqrt(distance);
    }
  }
  
  // Usage
  const points = [
    [1, 1],
    [1, 2],
    [2, 2],
    [4, 4],
    [4, 5],
    [5, 5],
    [8, 7],
    [9, 8],
    [9, 9],
    [10, 8]
  ];
  const k = 3;
  
  const kMeansPlusPlus = new KMeansPlusPlus(points, k);
  const centroids = kMeansPlusPlus.run();
  console.log(centroids);

  // npm install -g ts-node typescript