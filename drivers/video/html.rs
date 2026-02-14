unsafe extern "C" {
    fn host_video_render(ptr: *const u8, len: usize);
}

pub fn init() {
    let html = "<div style='color: #0f0;'>[driver] HTML Video Driver Active</div>";
    unsafe { host_video_render(html.as_ptr(), html.len()); }
}