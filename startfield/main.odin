package main

import "core:fmt"
import "core:math"
import "core:math/rand"
import rl "vendor:raylib"

Star :: struct {
	x:  f64,
	y:  f64,
	z:  f64,
	pz: f64,
}

WIDTH :: 800
HEIGHT :: 600
NUM_STARS :: 5000
speed: f64 = 10.0
stars: [NUM_STARS]Star
camera := rl.Camera2D {
	offset = rl.Vector2{WIDTH / 2.0, HEIGHT / 2.0},
	target = rl.Vector2{0.0, 0.0},
	rotation = 0.0,
	zoom = 1.0,
}

main :: proc() {
	// Init stars
	for i in 0 ..< NUM_STARS {
		x := rand.float64_range(-WIDTH, WIDTH)
		y := rand.float64_range(-HEIGHT, HEIGHT)
		z := rand.float64_range(0.0, WIDTH)
		stars[i] = Star{x, y, z, z}
	}

	rl.InitWindow(i32(WIDTH), i32(HEIGHT), "Starfield")
	defer rl.CloseWindow()
	rl.SetTargetFPS(60)

	for !rl.WindowShouldClose() {
		// Update speed
		mouse_y := clamp(rl.GetMousePosition().y, 0, HEIGHT)
		speed = map_range(f64(mouse_y), 0.0, HEIGHT, 50.0, 1.0)

		// Update stars
		for &star in stars {
			star.pz = star.z
			star.z -= speed

			if star.z < 1.0 {
				star.x = rand.float64_range(-WIDTH, WIDTH)
				star.y = rand.float64_range(-HEIGHT, HEIGHT)
				star.z = WIDTH
				star.pz = star.z
			}
		}

		rl.BeginDrawing()
		rl.ClearBackground(rl.BLACK)
		rl.BeginMode2D(camera)
		for &star in stars {
			// Current position
			sx := map_range(star.x / star.z, -1.0, 1.0, -WIDTH, WIDTH)
			sy := map_range(star.y / star.z, -1.0, 1.0, -HEIGHT, HEIGHT)
			s := rl.Vector2{f32(sx), f32(sy)}

			// Previous position
			px := map_range(star.x / star.pz, -1.0, 1.0, -WIDTH, WIDTH)
			py := map_range(star.y / star.pz, -1.0, 1.0, -HEIGHT, HEIGHT)
			p := rl.Vector2{f32(px), f32(py)}

			r := f32(map_range(star.z, 0.0, WIDTH, 4.0, 0.0))

			// Calculate movement vector
			dx := sx - px
			dy := sy - py
			distance := math.sqrt(dx * dx + dy * dy)

			// Minimum line length
			min_length: f64 = 3.0 // Adjust as needed

			if distance < min_length {
				if distance == 0.0 {
					// If distance is zero, assign a default direction to prevent division by zero
					dx = 0.0
					dy = -1.0
					distance = 1.0
				}
				// Normalize the movement vector
				nx := dx / distance
				ny := dy / distance

				// Extend the line to the minimum length
				ex := px + nx * min_length
				ey := py + ny * min_length

				// Draw the line with extended length
				rl.DrawLineEx(
					rl.Vector2{f32(px), f32(py)},
					rl.Vector2{f32(ex), f32(ey)},
					f32(r),
					rl.WHITE,
				)
			} else {
				// Draw the line as usual
				rl.DrawLineEx(
					rl.Vector2{f32(px), f32(py)},
					rl.Vector2{f32(sx), f32(sy)},
					f32(r),
					rl.WHITE,
				)
			}
		}
		rl.EndMode2D()
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
