/*
    Arkaclone

    Author: Javier Martinez
    SPDX-License-Identifier: MIT

    See license for details.
*/

import * as THREE from "three";
import Player from "./player";
import Ball from "./ball";
import Brick from "./brick";
import {
    PLAYER_IDX,
    BALL_IDX,
    ARKAOBJ_BUFFER_MAXSIZE,
    CAMERA_MOVEMENT_SPEED,
    CAMERA_INITIAL_POSITION_X,
    CAMERA_INITIAL_POSITION_Y,
    CAMERA_INITIAL_POSITION_Z,
    BRICK_WIDTH,
    BRICK_HEIGHT,
    BRICK_DEPTH,
    arkaUtilRange,
    randomHexColor
} from "./arkacutil";


// Initial threejs setup.
const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderEngine = new THREE.WebGLRenderer({
    antialias: true
});

renderEngine.setSize(window.innerWidth, window.innerHeight);
renderEngine.setClearColor(0x0);

document.body.appendChild(renderEngine.domElement);

// Draw cube
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// material.color = new THREE.Color(0xff0000);
// cube.scale.y += 1;

const player = new Player(2, 0.05, 0.2, 0x00ff00, 0.29);
const ball = new Ball(0.25, 0.25, 0.1, 0xb30528, 0.01);

const light = new THREE.AmbientLight(0xffffff, 2);

// Set up skybox
const skybox = new THREE.CubeTextureLoader().load([
    "/ulukai/corona_rt.png",
    "/ulukai/corona_lf.png",
    "/ulukai/corona_up.png",
    "/ulukai/corona_dn.png",
    "/ulukai/corona_bk.png",
    "/ulukai/corona_ft.png"
]);

scene.background = skybox;

// Add object to scene.
scene.add(player.mesh);
scene.add(ball.mesh);
scene.add(light);

camera.position.z = CAMERA_INITIAL_POSITION_Z;

// Calculate extents of the screen on both
// the x and y axis. These values are useful
// for several objects, such as player position clamping.
// Found based on camera's FOV (Field-of-view, assumes perspective camera).
// @returns values in CSS order (top, right, bottom, left)
function calculateScreenExtents() {
    const halfFOV = camera.fov * 0.5 * (Math.PI / 180);

    // Viewport dimensions
    const height = 2 * Math.tan(halfFOV) * camera.position.z;
    const width = height * camera.aspect;

    // Positions of extents
    const right = width * 0.5;
    const left = -right;
    const top = height * 0.5;
    const bottom = -top;

    return [top, right, bottom, left];
}

// A buffer to store and track all ArkaObjects in our scene.
// Can only be a max of 26 ArkaObjects since there are 24 bricks +
// player and ball. index 0 is always the player, 1 is the ball, rest are just bricks.
const screenExtents = calculateScreenExtents();
const arkaObjBuffer = new Array(ARKAOBJ_BUFFER_MAXSIZE);
arkaObjBuffer.fill(null);

const state = {
    scene,
    aspectRatio,
    camera,
    arkaObjBuffer,
    score: 0,
    screenExtents
};

// Set up and prepare for the game loop. This can be initializing
// buffers and game objects within our scene.
function gameInitialize() {
    state.score = 0;
    state.arkaObjBuffer[PLAYER_IDX] = player;
    state.arkaObjBuffer[BALL_IDX] = ball;
    // state.arkaObjBuffer[2] = new Brick(1.5, 0.5, 0.2, 0xf5f507, -6, 2.5); // Initial offset for grid
    // state.arkaObjBuffer[3] = new Brick(1.5, 0.5, 0.2, 0x00ff00, -6 + 1.9, 2.5); // X offset
    // state.arkaObjBuffer[4] = new Brick(1.5, 0.5, 0.2, 0x0000ff, -6, 2.5 - 0.75); // Y offset
    
    // Create grid of bricks. 6 x 4
    const initialX = -4.7;
    const initialY = 2.5;
    const offsetX = 1.9;
    const offsetY = -0.75;
    state.arkaObjBuffer[2] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX, initialY);
    state.arkaObjBuffer[3] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + offsetX, initialY);
    state.arkaObjBuffer[4] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 2), initialY);
    state.arkaObjBuffer[5] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 3), initialY);
    state.arkaObjBuffer[6] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 4), initialY);
    state.arkaObjBuffer[7] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 5), initialY);

    state.arkaObjBuffer[8] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX, initialY + offsetY);
    state.arkaObjBuffer[9] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + offsetX, initialY + offsetY);
    state.arkaObjBuffer[10] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 2), initialY + offsetY);
    state.arkaObjBuffer[11] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 3), initialY + offsetY);
    state.arkaObjBuffer[12] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 4), initialY + offsetY);
    state.arkaObjBuffer[13] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 5), initialY + offsetY);

    state.arkaObjBuffer[14] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX, initialY + (offsetY * 2));
    state.arkaObjBuffer[15] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + offsetX, initialY + (offsetY * 2));
    state.arkaObjBuffer[16] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 2), initialY + (offsetY * 2));
    state.arkaObjBuffer[17] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 3), initialY + (offsetY * 2));
    state.arkaObjBuffer[18] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 4), initialY + (offsetY * 2));
    state.arkaObjBuffer[19] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 5), initialY + (offsetY * 2));

    state.arkaObjBuffer[20] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX, initialY + (offsetY * 3));
    state.arkaObjBuffer[21] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + offsetX, initialY + (offsetY * 3));
    state.arkaObjBuffer[22] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 2), initialY + (offsetY * 3));
    state.arkaObjBuffer[23] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 3), initialY + (offsetY * 3));
    state.arkaObjBuffer[24] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 4), initialY + (offsetY * 3));
    state.arkaObjBuffer[25] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), initialX + (offsetX * 5), initialY + (offsetY * 3));

    // for (const brickNum of arkaUtilRange(2, ARKAOBJ_BUFFER_MAXSIZE)) {

    //     for (const brickRow of arkaUtilRange(1, 5)) {
    //         state.arkaObjBuffer[brickNum] = new Brick(BRICK_WIDTH, BRICK_HEIGHT, BRICK_DEPTH, randomHexColor(), currentX, currentY);
    //     }
    // }
    
    for (const o of state.arkaObjBuffer) {
        if (o === null || o === undefined) {
            // A null object slot does not have an object to be
            // initialized.
            continue;
        }

        o.start(state);
    }

    // Initialize camera controls
    document.addEventListener("keydown", (e) => {
        // Zoom out
        if (e.key === 'z') {
            if (state.camera.position.z >= 0) {
                state.camera.rotation.y = 0;
            }

            state.camera.position.z += CAMERA_MOVEMENT_SPEED;
        }

        // Zoom in
        if (e.key === 'Z') {
            if (state.camera.position.z <= 0) {
                state.camera.rotation.y = Math.PI;
            }

            state.camera.position.z -= CAMERA_MOVEMENT_SPEED;
        }

        // Reset camera
        if (e.key === 'r' || e.key === 'R') {
            state.camera.position.x = CAMERA_INITIAL_POSITION_X;
            state.camera.position.y = CAMERA_INITIAL_POSITION_Y;
            state.camera.position.z = CAMERA_INITIAL_POSITION_Z;
            state.camera.rotation.y = 0;
        }
    });
}

gameInitialize();

// The primary entry point of the app where
// pretty much everything must go through.
function gameLoop() {
    requestAnimationFrame(gameLoop);

    for (const [i, o] of state.arkaObjBuffer.entries()) {
        if (o === null || o === undefined) {
            // Skip null slots.
            continue;
        }

        if (o.markedForFree) {
            // Object's resources were disposed but object itself must be freed from the game's arkaObjBuffer.
            // This iteration is skipped as the slot would be null after this operation.
            state.arkaObjBuffer[i] = null;
            console.log(`Freed object at slot: ${i}`); // TODO: Remove this
            continue;
        }
        
        o.update(state);
    }

    renderEngine.render(scene, camera);
}

gameLoop();