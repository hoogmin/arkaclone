import {
    BoxGeometry,
    MeshStandardMaterial,
    Mesh
} from "three";

export default class ArkaObject {
    constructor(width, height, depth, color) {
        if (this.constructor === ArkaObject) {
            throw new Error("Abstract class cannot be instantiated.");
        }

        // Manipulating these properties will be handled by subclasses.
        this.box = new BoxGeometry(width, height, depth);
        this.matColor = color;
        this.material = new MeshStandardMaterial({ color: color });
        this.mesh = new Mesh(this.box, this.material);
    }

    start(state) {
        throw new Error("Method 'start' must be implemented by subclass.");
    }

    update(state) {
        throw new Error("Method 'update' must be implemented by subclass.");
    }

    destroy(state) {
        throw new Error("Method 'destroy' must be implemented by subclass.");
    }
}