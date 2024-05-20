mod utils;

use core::num;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, wasm-stringart! by Omar");
}

use stringart::StringRing;
#[wasm_bindgen]
struct StringRingWrapper {
    input_image: Vec<u8>,
    width: i32,
    height: i32,
    num_nails: i32,
    opacity: f64,
    stringring: StringRing,
}
#[wasm_bindgen]
impl StringRingWrapper {
    pub fn new(width: i32, height: i32, num_nails: i32, opacity: f64) -> Self {
        assert_eq!(width, height);
        let input_image = vec![0; (width * height * 4) as usize];
        let stringring = StringRing::new();
        // stringring.set_parameters(
        //     width / 2,
        //     height / 2,
        //     width / 2,
        //     num_nails,
        //     vec![vec![1.0; width as usize]; height as usize],
        //     opacity,
        // );
        Self {
            input_image,
            width,
            height,
            num_nails,
            opacity,
            stringring,
        }
    }
    /// Set the input image using Wasm memory from js
    pub fn input_image_pointer(&self) -> *const u8 {
        self.input_image.as_ptr()
    }
    pub fn update_input_image_to_greyscale(&mut self) {
        let mut image = vec![vec![0.0; self.width as usize]; self.height as usize];
        for i in 0..self.height {
            for j in 0..self.width {
                let index = (i * self.width + j) as usize;
                let r = self.input_image[index * 4] as f64;
                let g = self.input_image[index * 4 + 1] as f64;
                let b = self.input_image[index * 4 + 2] as f64;
                image[i as usize][j as usize] = (r + g + b) / 3.0;
            }
        }
        self.stringring.set_parameters(
            self.width / 2,
            self.height / 2,
            self.width / 2,
            self.num_nails,
            image,
            0.5,
        );
    }
    pub fn update(&mut self) -> i32 {
        self.stringring.update()
    }
    pub fn print_input_image(&self) -> () {
        let message = format!("{:?}", self.input_image);
        alert(&message);
    }
}
