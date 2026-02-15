pub fn info(message: &str) {
    crate::arch::console_write(message);
}

pub fn info_fmt(args: core::fmt::Arguments<'_>) {
    use core::fmt::Write;

    let mut writer = crate::arch::console::Console;
    let _ = writer.write_fmt(args);
    let _ = writer.write_char('\n');
}
