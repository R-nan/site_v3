import Boid from "./Boid";
import Predator from "./Predator";

const BoidStates = {
  REST: (boid: Boid) => {},
  RELEASE: (boid: Boid, boids: Array<Boid>, predators: Array<Predator>) => {
    const { velocity, position, acceleration, maxSpeed } = boid.options;
    boid.flock(boids, predators);
    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
  },
  ROOST: (boid: Boid) => {
    const { initialPosition } = boid.options;

    boid.flyTo(initialPosition);
  },
  FLY_SEQUENCE: (boid: Boid) => {
    const { target } = boid.options;

    if (target) boid.flyTo(target);

  }
}

export default BoidStates;