/*
This module contains reused values for readability throughout
the game's source. 
*/

// Constants for fetching screen extents.
export const TOP_EXTENT_IDX = 0;
export const RIGHT_EXTENT_IDX = 1;
export const BOTTOM_EXTENT_IDX = 2;
export const LEFT_EXTENT_IDX = 3;

// Constants related to the arka object buffer.
export const ARKAOBJ_BUFFER_MAXSIZE = 26;

// Constants for special game objects in the arka object buffer array.
export const PLAYER_IDX = 0;
export const BALL_IDX = 1;

// Constants for axis readability
export const AXIS_X = 0;
export const AXIS_Y = 1;
export const NO_AXIS = null;

// Constants for camera
export const CAMERA_MOVEMENT_SPEED = 0.4;
export const CAMERA_INITIAL_POSITION_X = 0;
export const CAMERA_INITIAL_POSITION_Y = 0;
export const CAMERA_INITIAL_POSITION_Z = 5;
export const CAMERA_MAX_POSITION_Z = 100;

// Constants for bricks
export const BRICK_WIDTH = 1.5;
export const BRICK_HEIGHT = 0.5;
export const BRICK_DEPTH = 0.2;

// Constants for ball
export const BALL_INITIAL_X = 0;
export const BALL_INITIAL_Y = -2.7;
export const BALL_MAX_EXTENT_OFFSET_X = 10;
export const BALL_MAX_EXTENT_OFFSET_Y = 10;

// Constants related to score keeping
export const MAX_SCORE = 999;

// General utilies that are useful

// Generator that creates an iterable of the range [start, end) (end exclusive) incremented by step.
export function* arkaUtilRange(start, end, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

// Get a random hex color! Returned as decimal but will interpreted as hex.
export const randomHexColor = () => {
    const randomDecimal = Math.floor(Math.random() * 16777216);

    return randomDecimal;
};