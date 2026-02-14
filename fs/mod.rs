use alloc::string::String;
use alloc::vec::Vec;
use alloc::boxed::Box;
use alloc::collections::BTreeMap;
use spin::RwLock;

#[derive(Debug)]
pub enum FsError {
    NotFound,
    IOError,
    NotSupported, 
}

pub trait FileSystem: Send + Sync {
    fn read_file(&self, path: &str) -> Result<Vec<u8>, FsError>;
    fn write_file(&self, path: &str, data: &[u8]) -> Result<(), FsError>; 
}

struct Vfs {
    mounts: BTreeMap<String, Box<dyn FileSystem>>,
}

static STATE: RwLock<Vfs> = RwLock::new(Vfs { mounts: BTreeMap::new() });

pub fn mount(path: &str, fs: Box<dyn FileSystem>) {
    STATE.write().mounts.insert(String::from(path), fs);
}

pub fn read(path: &str) -> Result<Vec<u8>, FsError> {
    let state = STATE.read();
    for (point, fs) in state.mounts.iter().rev() {
        if path.starts_with(point) {
            let relative = path.trim_start_matches(point).trim_start_matches('/');
            return fs.read_file(relative);
        }
    }
    Err(FsError::NotFound)
}