import ArkaObject from "./arkaobject";
import {
    Color,
    Box3
} from "three";
import {
    RIGHT_EXTENT_IDX,
    BALL_IDX
} from "./arkacutil"

export default class Player extends ArkaObject {
    constructor(width, height, depth, color, speed) {
        super(width, height, depth, color);

        this.movementSpeed = speed;
    }

    start(state) {
        // Player's starting position
        this.mesh.position.x = 0;
        this.mesh.position.y = -3.5;

        // Set up material for player.
        this.material.color = new Color(this.matColor);

        // Get the keyboard controls going.
        this._initControls();
    }

    update(state) {
        // Clamp the player's position according to the horizontal extents
        // of the screen. Extents must be adjusted based on the player mesh width.
        const padding = 0.1; // So the player doesn't directly hit the screen extent.
        const playerHalfWidth = this.mesh.geometry.parameters.width * 0.5;
        const playerRightmost = state.screenExtents[RIGHT_EXTENT_IDX] - (playerHalfWidth + padding);
        const playerLeftmost = -playerRightmost;

        if (this.mesh.position.x > playerRightmost) {
            this.mesh.position.x = playerRightmost;
        }

        if (this.mesh.position.x < playerLeftmost) {
            this.mesh.position.x = playerLeftmost;
        }

        if (this._isBallHit(state.arkaObjBuffer[BALL_IDX])) {
            state.arkaObjBuffer[BALL_IDX].setDy(1);
        }
    }

    destroy(state) {
        // Remove object from scene and free corresponding resources.
        state.scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
        this.markedForFree = true;
    }

    _isBallHit(ballObj) {
        // Get Bounding boxes for both player and ball.
        const playerBox = new Box3().setFromObject(this.mesh);
        const ballBox = new Box3().setFromObject(ballObj.mesh);

        // Check for intersection
        const isIntersecting = playerBox.intersectsBox(ballBox);

        if (isIntersecting) {
            return true;
        }

        return false;
    }

    _moveRight() {
        this.mesh.position.x += this.movementSpeed;
    }

    _moveLeft() {
        this.mesh.position.x -= this.movementSpeed;
    }

    _initControls() {
        // We need to initialize controls for the player by setting up
        // event listeners for keystrokes.
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft" || e.key === "a") {
                this._moveLeft();
            }

            if (e.key === "ArrowRight" || e.key === "d") {
                this._moveRight();
            }
        });

        // document.addEventListener("keyup", (e) => {
        //     // TODO: reset player speed or something.
        //     console.log(`Key released: ${e.key}`);
        // });
    }
}