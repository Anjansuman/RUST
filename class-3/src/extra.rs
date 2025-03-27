// this is showing that it will not work as str2 dies before getting imported to result

// pub fn extra() {
//     let str1 = String::from("Anjani");
//     let result;
//     {
//         let str2 = String::from("Suman");
//         result = longest(str1.as_str(), str2.as_str());
//     }

//     println!("{}", result);
// }

// fn longest(str1: &str, str2: &str) -> &str {
//     if str1.len() > str2.len() {
//         return str1;
//     } else {
//         return str2;
//     }
// }

