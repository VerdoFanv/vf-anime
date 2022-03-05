const fs = require('fs');
const path = require('path');

class UploadsService {
    constructor(folder) {
        this._folder = folder;

        fs.stat(folder, () => {
            fs.mkdirSync(folder, { recursive: true });
            fs.stat(`${folder}/default.png`, (secError) => {
                if (secError) {
                    fs.copyFile(path.resolve('./src/public/img/js_icon.png'), `${folder}/default.png`, (thirdError) => {
                        if (thirdError) throw thirdError;
                    });
                }
            });
        });
    }

    uploadFile(file, meta) {
        const filename = meta;
        const directory = `${this._folder}/${filename}`;

        file.mv(directory, (error) => {
            if (error) {
                throw new Error('Gagal mengupload file');
            }

            console.log(`Upload file ${filename} berhasil`);
        });
    }

    deleteFile(filename) {
        if (filename !== 'default.png') {
            const directory = `${this._folder}/${filename}`;
            fs.rm(directory, (e) => {
                if (e) {
                    console.log(e.message);
                }

                console.log(`Berhasil menghapus file ${filename}`);
            });
        }
    }
}

module.exports = UploadsService;
