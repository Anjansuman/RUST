// struct in RUST
// pub means public and these can be used by different files

pub struct Rect {
    pub height: f32,
    pub width: f32
}

// implementing Rect struct
impl Rect {

    // these functions can take more inputs as required

    // this can be called by name.area();
    // this is a function that can access the variables of the struct due to &self
    pub fn area(&self) -> f32 {
        return self.width * self.height;
    }

    // but for this we have to use Rect::hello();
    // this function cannot access the variables of the struct as it doesn't have &self
    pub fn hello() {
        println!("Hello");
    }

}