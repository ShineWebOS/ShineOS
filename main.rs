#![no_std]
#![no_main]
#![feature(alloc_error_handler)]

extern crate alloc;
use alloc::string::String;
use alloc::boxed::Box;
use core::panic::PanicInfo;

pub mod arch;
pub mod drivers;
pub mod fs;

#[global_allocator]
static ALLOCATOR: linked_list_allocator::LockedHeap = linked_list_allocator::LockedHeap::empty();

pub fn kernel_main(dtb: String) {
    arch::wasm32::console_log("\r\n[  \x1B[1;32mOK\x1B[0m  ] YADRO STAGE 1 LOADED\r\n");
    arch::wasm32::console_log("[  \x1B[1;32mOK\x1B[0m  ] YADRO STAGE 2 LOADED.\r\n");

    arch::wasm32::console_log("ZAPUSK DRAIVEROV FILE SYSTEM");
    fs::mount("/root", Box::new(drivers::block::fsa_api::FsaStorage));
    arch::wasm32::console_log("done.\r\n");

    arch::wasm32::console_log("\x1B[1;33mYADRO ZAPUSTILOS\x1B[0m\r\n");

    match fs::read("/root/hello.txt") {
        Ok(data) => arch::wasm32::console_log(&alloc::format!("[FS] Found hello.txt: {} bytes", data.len())),
        Err(_) => arch::wasm32::console_log("[FS] System disk ready."),
    }
}

#[panic_handler]
fn panic(info: &PanicInfo) -> ! {
    arch::wasm32::console_log(&alloc::format!("\x1B[1;31m[PANIC] {}\x1B[0m", info));
    loop {}
}

#[alloc_error_handler]
fn alloc_error_handler(_layout: core::alloc::Layout) -> ! {
    loop {}
}