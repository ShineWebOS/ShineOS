pub mod entry;

pub fn console_log(s: &str) {
    use core::fmt::Write;
    let mut writer = entry::DebugOut;
    let _ = writer.write_str(s);
    let _ = writer.write_char('\n');
}