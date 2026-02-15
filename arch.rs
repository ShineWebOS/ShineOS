#[cfg(target_arch = "wasm32")]
pub mod wasm32;

#[cfg(target_arch = "wasm32")]
pub use wasm32::console_write;

#[cfg(not(target_arch = "wasm32"))]
pub fn console_write(_s: &str) {}

pub mod console {
    pub struct Console;

    impl core::fmt::Write for Console {
        fn write_str(&mut self, s: &str) -> core::fmt::Result {
            crate::arch::console_write(s);
            Ok(())
        }
    }
}
