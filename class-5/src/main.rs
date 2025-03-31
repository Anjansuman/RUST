use using_serde::using_serde;
use basic_borsh::basic_borsh;

pub mod basic_borsh;
pub mod using_serde;


fn main() {
    using_serde();
    basic_borsh();
}
