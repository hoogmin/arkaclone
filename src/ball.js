import ArkaObject from "./arkaobject";
import {
    RIGHT_EXTENT_IDX,
    LEFT_EXTENT_IDX,
    TOP_EXTENT_IDX,
    BOTTOM_EXTENT_IDX,
    BALL_MAX_EXTENT_OFFSET_X,
    BALL_MAX_EXTENT_OFFSET_Y,
    BALL_INITIAL_X,
    BALL_INITIAL_Y
} from "./arkacutil";
import {
    Color
} from "three";

export default class Ball extends ArkaObject {
    constructor(width, height, depth, color, speed) {
        super(width, height, depth, color);

        this.movementSpeed = speed;

        // Used for maintaining direction, initially toward top-left.
        this.dx = -1;
        this.dy = 1;
    }

    start(state) {
        this.mesh.position.x = BALL_INITIAL_X;
        this.mesh.position.y = BALL_INITIAL_Y;

        this.material.color = new Color(this.matColor);
    }

    update(state) {
        if (this.mesh.position.x > state.screenExtents[RIGHT_EXTENT_IDX]) {
            this.dx = -1;
        }

        if (this.mesh.position.x < state.screenExtents[LEFT_EXTENT_IDX]) {
            this.dx = 1;
        }

        if (this.mesh.position.y > state.screenExtents[TOP_EXTENT_IDX]) {
            this.dy = -1;
        }

        if (this.mesh.position.y < state.screenExtents[BOTTOM_EXTENT_IDX]) {
            this.dy = 1;
            state.resetScore();
            state.updateUI();
        }

        this.mesh.position.x += this.movementSpeed * this.dx * state.deltaTime;
        this.mesh.position.y += this.movementSpeed * this.dy * state.deltaTime;

        // If the ball goes too far out of bounds for whatever buggy reason,
        // reset its position directly.
        if (this.mesh.position.x > (state.screenExtents[RIGHT_EXTENT_IDX] + BALL_MAX_EXTENT_OFFSET_X) || 
            this.mesh.position.x < (state.screenExtents[LEFT_EXTENT_IDX] - BALL_MAX_EXTENT_OFFSET_X)) {
            this.mesh.position.x = BALL_INITIAL_X;
        }

        if (this.mesh.position.y > (state.screenExtents[TOP_EXTENT_IDX] + BALL_MAX_EXTENT_OFFSET_Y) || 
            this.mesh.position.y < (state.screenExtents[BOTTOM_EXTENT_IDX] - BALL_MAX_EXTENT_OFFSET_Y)) {
            this.mesh.position.y = BALL_INITIAL_Y;
        }
    }

    destroy(state) {
        state.scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
        this.markedForFree = true;
    }

    setDx(newDirection) {
        if (newDirection === 1 || newDirection === -1) {
            this.dx = newDirection;
            return;
        }
        
        throw new Error(`[Ball]: property 'dx' must be either 1 or -1. Got ${newDirection}`);
    }

    setDy(newDirection) {
        if (newDirection === 1 || newDirection === -1) {
            this.dy = newDirection;
            return;
        }
        
        throw new Error(`[Ball]: property 'dy' must be either 1 or -1. Got ${newDirection}`);
    }

    flipDx() {
        this.dx = -this.dx;
    }

    flipDy() {
        this.dy = -this.dy;
    }
}