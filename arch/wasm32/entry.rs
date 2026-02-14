use crate::kernel_main;
use crate::ALLOCATOR;

unsafe extern "C" {
    fn host_console_log(ptr: *const u8, len: usize);
}

pub struct DebugOut;
impl core::fmt::Write for DebugOut {
    fn write_str(&mut self, s: &str) -> core::fmt::Result {
        for byte in s.bytes() {
            unsafe { host_tty_write(byte); }
        }
        Ok(())
    }
}

unsafe extern "C" {
    fn host_tty_write(byte: u8);
}

#[unsafe(no_mangle)]
pub extern "C" fn kernel_entry(dtb_ptr: *const u8, dtb_len: usize) {
    let heap_start = 0x100000 as *mut u8;
    let heap_size = 64 * 1024 * 1024;
    unsafe { ALLOCATOR.lock().init(heap_start, heap_size); }

    let dtb_slice = unsafe { core::slice::from_raw_parts(dtb_ptr, dtb_len) };
    let dtb = alloc::string::String::from_utf8_lossy(dtb_slice).into_owned();

    kernel_main(dtb);
}

#[unsafe(no_mangle)]
pub extern "C" fn kernel_handle_input(_byte: u8) {
}