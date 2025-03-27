use chrono::{Utc, Local};
// for single import from a lib we have to remove the braces
// for all imports from the lib we have do something like use chrono::prelude::*;

pub fn time() {
    let utc = Utc::now();
    let local = Local::now();

    println!("current utc time: {}", utc);
    println!("current local time: {}", local);
}