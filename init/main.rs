use alloc::boxed::Box;
use alloc::string::String;

use crate::drivers;
use crate::fs;
use crate::kernel::printk;

pub fn start(_dtb: String) {
    printk::info("boot: stage 1");
    printk::info("boot: stage 2");

    fs::mount("/root", Box::new(drivers::block::fsa_api::FsaStorage));

    printk::info("SHINEOS KERNEL RUNNING");

    match fs::read("/root/hello.txt") {
        Ok(data) => printk::info_fmt(format_args!("[fs] hello.txt: {} bytes", data.len())),
        Err(_) => printk::info("[fs] system disk ready"),
    }
}
