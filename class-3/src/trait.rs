use std::f32::consts::PI;

// trait is made for defining a generic boudn line std::ops::Add does, also used for many more things

// I think it's like interface in Typescript
trait Shape {
    fn area(&self) -> f32;
}

struct Rect {
    height: f32,
    width: f32
}

struct Circle {
    radius: f32
}

impl Shape for Rect {
    fn area(&self) -> f32 {
        return self.height * self.width;
    }
}

impl Shape for Circle {
    fn area(&self) -> f32 {
        return PI * self.radius * self.radius;
    }
}

fn area_of_shape<T: Shape>(shape: T) {
    return shape.area();
}