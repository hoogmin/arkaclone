/*
    Arkaclone

    Author: Javier Martinez
    SPDX-License-Identifier: MIT

    See license for details.
*/

import * as THREE from "three";
import Player from "./player";


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

const player = new Player(2, 0.05, 0.05, 0x00ff00, 0.29);

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
scene.add(light);

camera.position.z = 5;

// Calculate extents of the screen on both
// the x and y axis. These values are useful
// for several objects, such as player position clamping.
// Found based on camera's FOV (Field-of-view).
// @returns values in CSS order (top, right, bottom, left)
function calculateScreenExtents() {
    const near = camera.near;
    const far = camera.far;

    const fov = camera.fov * (Math.PI / 180); // Convert FOV to radians.
    const height = 2 * Math.tan(fov / 2) * near;
    const width = height * camera.aspect;

    const right = width / 2;
    const left = -right;
    const top = height / 2;
    const bottom = -top;

    return [top, right, bottom, left];
}

// A buffer to store and track all ArkaObjects in our scene.
// Can only be a max of 26 ArkaObjects since there are 24 bricks +
// player and ball. index 0 is always the player, 1 is the ball, rest are just bricks.
// const arkaObjBuffer = new Array(26);
const screenExtents = calculateScreenExtents();
const arkaObjBuffer = new Array(26);
arkaObjBuffer.fill(null);

const state = {
    scene,
    aspectRatio,
    camera,
    arkaObjBuffer,
    score: 0,
    screenExtents
};

state.arkaObjBuffer[0] = player;

// Set up and prepare for the game loop. This can be initializing
// buffers and game objects within our scene.
function gameInitialize() {
    state.arkaObjBuffer[0] = player;
    state.score = 0;
    
    for (const o of state.arkaObjBuffer) {
        if (o === null || o === undefined) {
            // A null object slot does not have an object to be
            // initialized.
            continue;
        }

        o.start(state);
    }
}

gameInitialize();

// The primary entry point of the app where
// pretty much everything must go through.
function gameLoop() {
    requestAnimationFrame(gameLoop);

    for (const o of state.arkaObjBuffer) {
        if (o === null || o === undefined) {
            // A null object slot does not have an object to be
            // initialized.
            continue;
        }
        
        o.update(state);
    }

    renderEngine.render(scene, camera);
}

gameLoop();