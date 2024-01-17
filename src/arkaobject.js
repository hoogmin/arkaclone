import {
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from "three";

export default class ArkaObject {
    constructor(width, height, depth, color) {
        if (this.constructor === ArkaObject) {
            throw new Error("Abstract class cannot be instantiated.");
        }

        // Manipulating these properties will be handled by subclasses.
        this.box = new BoxGeometry(width, height, depth);
        this.material = new MeshBasicMaterial({ color: color });
        this.mesh = new Mesh(this.box, this.material);
    }

    start() {
        throw new Error("Method 'start' must be implemented by subclass.");
    }

    update() {
        throw new Error("Method 'update' must be implemented by subclass.");
    }

    destroy() {
        throw new Error("Method 'destroy' must be implemented by subclass.");
    }
}