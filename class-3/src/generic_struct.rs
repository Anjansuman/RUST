use std::ops::Mul;

pub struct Rect<T> {
    pub height: T,
    pub width: T
}

/*
    impl<T> => means the implementation is defined on this generic type, and we add this <T> only if there is a generic type
    and after that Rect<T> => means the actual struct
*/

impl<T: Mul<Output = T> + Copy> Rect<T> {
    pub fn area(&self) -> T {
        return self.height * self.width;
    }
}