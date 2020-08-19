import Boid from "./Boid";

const BoidStates = {
  REST: (boid: Boid) => {},
  RELEASE: (boid: Boid) => {
    const { velocity, position, acceleration, maxSpeed } = boid.options;

    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
  },
  ROOST: (boid: Boid) => {
    const { initialPosition } = boid.options;

    boid.flyTo(initialPosition);
    // once it arrives to origin point, set boid state to rest, 
    // once all boids are at origin, resolve promise.all and fold boid;
  }
}

export default BoidStates;