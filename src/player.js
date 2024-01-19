import ArkaObject from "./arkaobject";
import {
    Color
} from "three";
import {
    RIGHT_EXTENT_IDX,
    LEFT_EXTENT_IDX
} from "./arkacutil"

export default class Player extends ArkaObject {
    constructor(width, height, depth, color, speed) {
        super(width, height, depth, color);

        this.movementSpeed = speed;
    }

    start(state) {
        console.log("Player initialized."); // TODO: Remove.
        // Player's starting position
        this.mesh.position.x = 0;
        this.mesh.position.y = -3.5;

        // Set up the player's dimensions.
        // this.box.scale.x = this.width;
        // this.box.scale.y = this.height;
        // this.box.scale.z = this.depth;

        // Set up material for player.
        this.material.color = new Color(this.matColor);

        // Get the keyboard controls going.
        this._initControls();
    }

    update(state) {
        // Clamp the player's position according to the horizontal extents
        // of the screen. Extents must be adjusted based on the player mesh width.
        const playerHalfWidth = this.mesh.scale.x;
        const playerRightmost = state.screenExtents[RIGHT_EXTENT_IDX] - playerHalfWidth;
        const playerLeftmost = -playerRightmost;

        if ((this.mesh.position.x + playerHalfWidth) > playerRightmost) {
            console.log(`Player is past right: ${playerRightmost}`); // TODO: Remove.
            this.mesh.position.x = playerRightmost - playerHalfWidth;
        }

        if ((this.mesh.position.x - playerHalfWidth) < playerLeftmost) {
            console.log(`Player is past left: ${playerLeftmost}`); // TODO: Remove.
            this.mesh.position.x = playerLeftmost + playerHalfWidth;
        }
    }

    destroy(state) {
        // Remove object from scene and free corresponding resources.
        state.scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
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