import Boid from "./Boid";

const BoidStates = {
  REST: (boid: Boid) => {},
  // UNFOLD,
  RELEASE: (boid: Boid) => {
    const { velocity, position, acceleration, maxSpeed } = boid.options;

    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
  }
  // RETURN,
  // FOLD
}

export default BoidStates;