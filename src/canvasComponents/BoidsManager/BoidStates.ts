import Boid from "./Boid";
import { map } from "../../utils/utils";
import Vector from "../../utils/Vector";

const BoidStates = {
  REST: (boid: Boid, boids: Boid[]) => {},
  RELEASE: (boid: Boid, boids: Boid[]) => {
    const { velocity, position, acceleration, maxSpeed } = boid.options;

    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
  },
  ROOST: (boid: Boid, boids: Boid[]) => {
    const { initialPosition, position, velocity, acceleration, maxSpeed } = boid.options;
    const maxArrivalSpeed = 5;
    const desired = Vector.sub(initialPosition, position);
    const distance = desired.mag();
    let speed = maxArrivalSpeed;
    if (distance < 100) {
      speed = map(distance, 0, 100, 0, maxArrivalSpeed);
    }
    desired.setMag(speed);
    const steer = Vector.sub(desired, velocity);
    steer.limit(this.maxForce);
    acceleration.add(steer);
    velocity.limit(maxSpeed);
    velocity.add(acceleration);
    position.add(velocity);
    acceleration.mult(0, 0, 0);
  }
  // FOLD
}

export default BoidStates;