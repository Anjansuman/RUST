use chrono_lib::time;
use env_lib::using_env;
use generics::sum;
use generic_struct::Rect;
// use extra::extra;

pub mod chrono_lib;
pub mod env_lib;
pub mod generics;
pub mod generic_struct;
// pub mod extra;

fn main() {

    // using chrono
    time();

    // using dotenv
    using_env();

    // generics
    println!("{}", sum(1, 2));
    
    // generic struct
    let r = Rect {
        width: 20,
        height: 10
    };

    println!("{}", r.area());

    // extra();

}

