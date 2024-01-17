import ArkaObject from "./arkaobject";
import {
    Color
} from "three";

export default class Player extends ArkaObject {
    constructor(width, height, depth, color, speed) {
        super(width, height, depth, color);

        this.movementSpeed = speed;
    }

    start() {
        // Player's starting position
        this.mesh.position.x = 0;
        this.mesh.position.y = -3.5;

        // Set up the player's dimensions.
        this.box.scale.x = this.width;
        this.box.scale.y = this.height;
        this.box.scale.z = this.depth;

        // Set up material for player.
        this.material.color.set(this.color); // TODO: Might need to pass as string.

        // Get the keyboard controls going.
        this._initControls();
    }

    update() {
        // Anything player specific to occur each frame.
    }

    destroy(scene) {
        // Remove object from scene and free corresponding resources.
        scene.remove(this.mesh);
        this.material.dispose();
        this.box.dispose();
    }

    _moveRight() {
        if (this.mesh.position.x < window.innerWidth - this.mesh.position.x) {
            this.mesh.position.x += this.movementSpeed;
        }
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