use crate::fs::{FileSystem, FsError};
use alloc::vec;
use alloc::vec::Vec;

unsafe extern "C" {
    fn host_fsa_read(path_ptr: *const u8, path_len: usize, buf_ptr: *mut u8) -> isize;

    #[allow(dead_code)]
    fn host_fsa_write(
        path_ptr: *const u8,
        path_len: usize,
        data_ptr: *const u8,
        data_len: usize,
    ) -> isize;
}

pub struct FsaStorage;

impl FileSystem for FsaStorage {
    fn read_file(&self, path: &str) -> Result<Vec<u8>, FsError> {
        let mut buffer = vec![0u8; 1024 * 1024];
        let res = unsafe { host_fsa_read(path.as_ptr(), path.len(), buffer.as_mut_ptr()) };

        if res < 0 {
            Err(FsError::IOError)
        } else {
            buffer.truncate(res as usize);
            Ok(buffer)
        }
    }

    fn write_file(&self, _path: &str, _data: &[u8]) -> Result<(), FsError> {
        Err(FsError::NotSupported)
    }
}
