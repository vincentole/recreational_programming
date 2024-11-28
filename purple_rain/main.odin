package main

import "core:math/rand"
import rl "vendor:raylib"

WIDTH :: 800
HEIGHT :: 600
TARGET_FPS :: 60
SPEED_MIN :: 4
SPEED_MAX :: 8
Z_MIN :: 0
Z_MAX :: 5
LENGTH_MIN :: 2
LENGTH_MAX :: 10
THICK_MIN :: 1
THICK_MAX :: 5
Raindrop :: struct {
	x, y, z, speed, length, thick: f64,
}
RAIN_COUNT :: 500
rain := [RAIN_COUNT]Raindrop{}

main :: proc() {
	rl.InitWindow(WIDTH, HEIGHT, "Purple Rain")
	rl.SetTargetFPS(TARGET_FPS)

	// Init rain
	for i in 0 ..< RAIN_COUNT {
		z := rand.float64_range(Z_MIN, Z_MAX)
		speed := map_range(z, Z_MIN, Z_MAX, SPEED_MIN, SPEED_MAX)
		length := map_range(speed, SPEED_MIN, SPEED_MAX, LENGTH_MIN, LENGTH_MAX)
		thick := map_range(z, Z_MIN, Z_MAX, THICK_MIN, THICK_MAX)

		rain[i] = Raindrop {
			x      = rand.float64_range(0, WIDTH),
			y      = rand.float64_range(0, HEIGHT),
			z      = z,
			speed  = speed,
			length = length,
			thick  = thick,
		}
	}

	for !rl.WindowShouldClose() {
		for &raindrop in rain {
			raindrop.y += raindrop.speed

			if raindrop.y > HEIGHT {
				z := rand.float64_range(Z_MIN, Z_MAX)
				speed := map_range(z, Z_MIN, Z_MAX, SPEED_MIN, SPEED_MAX)
				length := map_range(speed, SPEED_MIN, SPEED_MAX, LENGTH_MIN, LENGTH_MAX)
				thick := map_range(z, Z_MIN, Z_MAX, THICK_MIN, THICK_MAX)
				raindrop.x = rand.float64_range(0, WIDTH)
				raindrop.y = 0
				raindrop.z = z
				raindrop.speed = speed
				raindrop.length = length
				raindrop.thick = thick
			}
		}


		rl.BeginDrawing()
		rl.ClearBackground(rl.WHITE)
		for raindrop in rain {
			start := rl.Vector2{f32(raindrop.x), f32(raindrop.y)}
			end := rl.Vector2{f32(raindrop.x), f32(raindrop.y + raindrop.length)}
			thick := f32(raindrop.thick)
			rl.DrawLineEx(start, end, thick, rl.PURPLE)

		}
		rl.EndDrawing()
	}

}

map_range :: proc(value: f64, from_min: f64, from_max: f64, to_min: f64, to_max: f64) -> f64 {
	from_span := from_max - from_min
	to_span := to_max - to_min

	if from_span == 0.0 {
		return to_min
	}

	scaled_value := (value - from_min) / from_span
	return to_min + (scaled_value * to_span)
}
