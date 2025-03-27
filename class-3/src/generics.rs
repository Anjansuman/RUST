use std::ops::Add;
// std => standard
// ops => operation
// Add => trait

pub fn sum<T: Add<Output = T>>(a: T, b: T) -> T {
    return a + b;
}