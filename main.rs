#![no_std]
#![no_main]
#![feature(alloc_error_handler)]

extern crate alloc;

pub mod arch;
pub mod drivers;
pub mod fs;
pub mod init;
pub mod kernel;
pub mod mm;

#[panic_handler]
fn panic(info: &core::panic::PanicInfo) -> ! {
    kernel::panic::handle(info)
}

#[alloc_error_handler]
fn alloc_error_handler(_layout: core::alloc::Layout) -> ! {
    loop {}
}
