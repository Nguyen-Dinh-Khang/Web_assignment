const multer = require('multer')
const fs = require('fs')
const path = require('path')



const storage_laptop = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'static', 'uploads', 'laptop'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload_laptop = multer({storage: storage_laptop}).single('laptop_img_file')


const storage_ram = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'static', 'uploads', 'ram'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload_ram = multer({storage: storage_ram}).single('ram_img_file')


const storage_cpu = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'static', 'uploads', 'cpu'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload_cpu = multer({storage: storage_cpu}).single('cpu_img_file')


const storage_gpu = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'static', 'uploads', 'gpu'))
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload_gpu = multer({storage: storage_gpu}).single('gpu_img_file')


module.exports = {
    upload_laptop,
    upload_ram,
    upload_cpu,
    upload_gpu,
}


