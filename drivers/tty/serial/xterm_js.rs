unsafe extern "C" {
    fn host_tty_write(byte: u8);
}

pub fn init() {
    crate::arch::console_write("[driver] xterm_js initialized");
}

pub fn write_byte(byte: u8) {
    unsafe { host_tty_write(byte) }
}
