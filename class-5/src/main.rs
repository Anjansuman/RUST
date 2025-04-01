use using_serde::using_serde;
use basic_borsh::basic_borsh;
use life_times::life_times;
use pointer_struct::pointer_struct;

pub mod pointer_struct;
pub mod life_times;
pub mod basic_borsh;
pub mod using_serde;


fn main() {
    using_serde();
    basic_borsh();
    life_times();
    pointer_struct();
}
