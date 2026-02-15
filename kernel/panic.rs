pub fn handle(info: &core::panic::PanicInfo<'_>) -> ! {
    crate::kernel::printk::info_fmt(format_args!("[panic] {}", info));
    loop {}
}
