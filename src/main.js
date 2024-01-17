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
    antialias: false
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

const player = new Player(2, 0.05, 0.05, [0, 255, 0], 0.29);

player.start();

// Add object to scene.
scene.add(player.mesh);

camera.position.z = 5;

// A buffer to store and track all ArkaObjects in our scene.
// Can only be a max of 26 ArkaObjects since there are 24 bricks +
// player and ball. index 0 is always the player, 1 is the ball, rest are just bricks.
const arkaObjBuffer = new Array(26);

// The primary entry point of the app where
// pretty much everything must go through.
function gameLoop() {
    requestAnimationFrame(gameLoop);

    renderEngine.render(scene, camera);
}

gameLoop();