use crate::fs::{FileSystem, FsError};
use alloc::vec::Vec;

pub struct NodeFsStorage;

impl FileSystem for NodeFsStorage {
    fn read_file(&self, _path: &str) -> Result<Vec<u8>, FsError> {
        Ok(Vec::new())
    }

    fn write_file(&self, _path: &str, _data: &[u8]) -> Result<(), FsError> {
        Ok(())
    }
}
