use std::{f32::consts::PI, fs};

use rect::Rect;
use enum_with_value::Shapes;

pub mod enum_with_value;
pub mod rect;



//select all and un-comment to see the functionalities

// // a string can have many immutable references, but can only have one mutable reference.
// fn str() {
    
//     let mut str = String::from("Anjan");
//     let str1 = mut &str;

//     // now this will fail as str1 is mutable until we write a code that uses str1 before this line and don't use 
//     // after writing any immutable reference, then compiler will think that it is not used after immutable str,
//     // so it will let us create the immutable str

//     // let str2 = &str

// }



fn main() {
    
    rectangle();

    let shape = Shapes::Square(10.0);

    // used borrowing here, same as call by reference in C language.
    let area = area(&shape);

    println!("calculating area by function: {}", area);
    println!("calculating area by implementing Shapes enum: {}", shape.area());

    trycatch();

    println!("This is the call for find first a");

    let a = find_first_a(String::from("Anjan"));
    let a1 = find_first_a(String::from("Piyush"));

    match a {
        Option::Some(val) => println!("a found at index: {}", val),
        Option::None => println!("Value doesn't exist")
    }
    match a1 {
        Option::Some(val) => println!("a found at: {}", val),
        Option::None => println!("Value doesn't exist")
    }

}

fn rectangle() {
    let r = Rect{
        height: 10.0,
        width: 10.0
    };

    println!("{}, {}", r.width, r.height);

    println!("{}", r.area());

    Rect::hello();
}


////////////////////// IMPORTANT //////////////////////
// In RUST, if the last line of a function doesn't have any semi-color then it is considered to be a returning value
// if it has a return type
///////////////////////////////////////////////////////


fn area(shape: &Shapes) -> f32 {

    match shape {
        Shapes::Rectangle(width, height) => width * height,
        Shapes::Circle(radius) => PI * radius * radius,
        Shapes::Square(side) => side * side,
        _ => -1.0 // this line of code is un-reachable for this as i have printed all the cases of the Shapes
    }

}

// can also be solved by implementing Shapes
impl Shapes {
    fn area(&self) -> f32{
        return match self {
            Shapes::Rectangle(width, height) => width * height,
            Shapes::Circle(radius) => PI * radius * radius,
            Shapes::Square(side) => side * side,
            _ => -1.0
        };
    }
}

// function that implements patern matching => patern matching is similar to switch-case Java
// lets say this function takes the Direction enum as input
// fn steer(dir: Direction) {
//     match dir {
//         Direction::North => print!("North"),
//         Direction::South => print!("South"),
//         Direction::East => print!("East"),
//         Direction::West => print!("West"),
//         _=> print!("default value") // this catches rest or default values like other switch cases in Java
//     }
// }


// using Try catch in RUST

fn trycatch() {
    let contents = fs::read_to_string("src/a.txt");

    match contents {
        Ok(content) => println!("{}", content),
        Err(e) => print!("Error while reading the file: {}", e)
    }
}


// this returns either a number or null
fn find_first_a(str: String) -> Option<usize> {
    for i in 0..str.len() {
        if str.chars().nth(i) == Some('a') {
            return Some(i);
        }
    }
    None
}