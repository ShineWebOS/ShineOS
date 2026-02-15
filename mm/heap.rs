#[global_allocator]
pub static ALLOCATOR: linked_list_allocator::LockedHeap =
    linked_list_allocator::LockedHeap::empty();

pub fn init(heap_start: *mut u8, heap_size: usize) {
    unsafe { ALLOCATOR.lock().init(heap_start, heap_size) }
}
