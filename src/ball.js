import ArkaObject from "./arkaobject";
import {
    RIGHT_EXTENT_IDX,
    LEFT_EXTENT_IDX,
    TOP_EXTENT_IDX,
    BOTTOM_EXTENT_IDX
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
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;

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
        }

        this.mesh.position.x += this.movementSpeed * this.dx;
        this.mesh.position.y += this.movementSpeed * this.dy;
    }

    destroy(state) {
        state.scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
    }
}