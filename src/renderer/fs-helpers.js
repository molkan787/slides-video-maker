import fs from 'fs';

export function prepareFolder(path) {
    return new Promise((resolve, reject) => {
        fs.mkdir(path, function(err) {
            if (err) {
                if (err.code == 'EEXIST') resolve(); // ignore the error if the folder already exists
                else reject(err); // something else went wrong
            } else resolve(); // successfully created folder
        });
    })
}

export function deleteFile(filename){
    return new Promise((resolve, reject) => {
        fs.unlink(filename, err => {
            if(err) reject(err);
            else resolve();
        })
    });
}

export function readDir(path){
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, files) => {
            if(err) reject(err);
            else resolve(files);
        });
    })
}

export function readTextFile(filename){
    return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', function(err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    })
}

export function writeFile(filename, data){
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => {
            if(err) reject(err);
            else resolve(true);
        })
    })
}