const express = require('express')
const router = express.Router()
const uploadMiddleware = require('../config/multer')

const shop_controller = require('../controllers/shop_controller')
const shop_upload = require('../controllers/shop_upload')
const shop_search = require('../controllers/shop_search')


//--------Trang chính------------------------------------------------------------------------------------------------------------------------------
router.get('/laptop', shop_search.Random_Laptop)
router.get('/component', shop_search.Random_component)
router.post('/searchlaptop', shop_search.Post_Laptop_Name)
router.get('/searchlaptop', shop_search.Search_Laptop_Name)
router.post('/searchcomponent', shop_search.Post_Component_Name)
router.get('/searchcomponent', shop_search.Search_Component_Name)
router.post('/laptopcomponent', shop_search.Post_Laptop_Component)
router.get('/laptopcomponent', shop_search.Search_Laptop_Component)
router.get('/shop', shop_controller.Search_Shop)
//-------------------------------------------------------------------------------------------------------------------------------------------------
//---------Hiển thị sản phẩm-----------------------------------------------------------------------------------------------------------------------
router.get('/laptopinfo', shop_controller.Info_Laptop)
router.get('/componentinfo', shop_controller.Info_Component)
//-------------------------------------------------------------------------------------------------------------------------------------------------
//---------Đăng nhập-------------------------------------------------------------------------------------------------------------------------------
router.get('/signup', shop_controller.Sign_Up_Form)
router.post('/signup', shop_controller.Sign_Up)
router.get('/login', shop_controller.Login_Form)
router.post('/login', shop_controller.Login)
router.post('/logout', shop_controller.Logout)
//-------------------------------------------------------------------------------------------------------------------------------------------------
//---------Trang admin-----------------------------------------------------------------------------------------------------------------------------
router.get('/adminsite', shop_upload.Admin_Site)
router.get('/uploadshop',  shop_upload.Upload_Shop_Form)
router.post('/uploadshop', shop_upload.Upload_Shop)
router.get('/uploadlaptop',  shop_upload.Upload_Laptop_Form)
router.post('/uploadlaptop', uploadMiddleware.upload_laptop, shop_upload.Upload_Laptop)
router.get('/uploadram',  shop_upload.Upload_Ram_Form)
router.post('/uploadram', uploadMiddleware.upload_ram, shop_upload.Upload_Ram)
router.get('/uploadcpu',  shop_upload.Upload_Cpu_Form)
router.post('/uploadcpu', uploadMiddleware.upload_cpu, shop_upload.Upload_Cpu)
router.get('/uploadgpu', shop_upload.Upload_Gpu_Form)
router.post('/uploadgpu', uploadMiddleware.upload_gpu, shop_upload.Upload_Gpu)
//-------------------------------------------------------------------------------------------------------------------------------------------------
//---------Trang chủ-------------------------------------------------------------------------------------------------------------------------------
router.use('/', shop_controller.Home)



module.exports = router