// try catch is handled by enums in RUST


// this is in-built thing
enum Result<T, E> {
    Ok(T),
    Err(E)
}


// RUST doesn't have the concept of null values
// so they have made a enum that handles the empty values,

// this enum has a generic type and returns none and some (this is the desired output), we can do further checks using
// pattern matching which will check if the fn returns none that means it found null value or no value
enum Option<T> {
    None,
    Some(T)
}