import ArkaObject from "./arkaobject";
import {
    Color,
    Box3
} from "three";
import {
    BALL_IDX,
    AXIS_X,
    AXIS_Y,
    NO_AXIS
} from "./arkacutil";

export default class Brick extends ArkaObject {
    constructor(width, height, depth, color, positionX, positionY) {
        super(width, height, depth, color);

        this.positionX = positionX;
        this.positionY = positionY;
    }

    start(state) {
        state.scene.add(this.mesh);

        this.mesh.position.x = this.positionX;
        this.mesh.position.y = this.positionY;

        this.material.color = new Color(this.matColor);
    }

    update(state) {
        const [intersecting, hitAxis] = this._handleBallHit(state.arkaObjBuffer[BALL_IDX]);

        if (intersecting) {
            this.destroy(state);
        }
    }

    destroy(state) {
        state.score += 1; // TODO: Will call an update method.
        state.scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
        this.markedForFree = true;
    }

    _handleBallHit(ballObj) {
        // Get Bounding boxes for both brick and ball.
        const brickBox = new Box3().setFromObject(this.mesh);
        const ballBox = new Box3().setFromObject(ballObj.mesh);

        // Check for intersection
        const isIntersecting = brickBox.intersectsBox(ballBox);

        if (isIntersecting) {
            // Calculate the relative positions of the cubes.
            const deltaX = brickBox.max.x - ballBox.min.x;
            const deltaY = brickBox.max.y - ballBox.min.y;

            if (deltaX < deltaY) {
                // Contact on the side (X-axis).
                ballObj.flipDx();
                
                // Adjust ball position to avoid overlap.
                const overlapX = deltaX;
                ballObj.mesh.position.x -= 0.03 * overlapX;
                
                return [true, AXIS_X];
            } else if (deltaY < deltaX) {
                // Contact from the top/bottom (Y-axis).
                ballObj.flipDy();
                
                const overlapY = deltaY;
                ballObj.mesh.position.y -= 0.03 * overlapY;
                
                return [true, AXIS_Y];
            }
        }

        return [false, NO_AXIS];
    }
}