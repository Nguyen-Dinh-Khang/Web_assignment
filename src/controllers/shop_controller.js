const prisma = require('../databases/database')
const fs = require('fs')
const {Paginate_Data_List, Range_Page_List} = require('./shop_search')



class shop {
    Home = async (req,res) => {
        res.render('home')
    }

    Admin_Site(req,res){
        res.render('admin_pages/admin_site', { layout: 'admin' })
    }

    Staff_Site = async (req,res) => {
        const { shopid } = req.query
        return res.redirect(`/shopinfo?shopid=${shopid}&page=1&limit=6`)
    }

    // Đăng nhập
    Sign_Up_Form(req,res){
        res.render('auth_pages/sign_up', { layout: false })
    }

    Login_Form(req,res){
        res.render('auth_pages/login', { layout: false })
    }


    Sign_Up = async (req,res) => {
        const { username, password } = req.body

        try{
            const existinguser = await prisma.user.findUnique({ where: {username: username}})
            
            if (existinguser){
                return res.status(409).json({ message: "This username is exist!"})
            }

            const newuser = await prisma.user.create({
                data: {
                    username: username,
                    password: password,
                }})

            req.session.userId = newuser.id
            return res.redirect('/')
        } catch (err) {
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Login = async (req,res) => {
        const { username, password } = req.body

        try{
            const user = await prisma.user.findUnique({ where: {username: username}})

            if (user){
                if ( password != user.password){
                    return res.status(401).json({ message: "Password is not correct!" })
                }
            }
            
            req.session.userId = user.id
            return res.redirect("/")
        } catch (err) {
            return res.status(401).json({ message: "User is not exist!" })
        }
    }

    Logout(req,res){
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Logout fails! Please do it again"})
            }
            res.clearCookie('connect.sid', {path: '/'})
            return res.redirect("/")
        })
    }




    // Hiển thị thông tin
    Info_Laptop = async (req,res) => {
        const {laptopid} = req.query
        const id = parseInt(laptopid,10)

        try{
            const laptop = await prisma.laptop.findUnique({ 
                where: {id},
                include: {shop:true}
            })
            console.log('')
            console.log('')
            console.log(laptop)
            return res.render('display_pages/info_laptop', laptop)

        } catch (err) {
            console.error("Lỗi Server 500 chi tiết:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Info_Component = async (req,res) => {
        const {componentid, type} = req.query
        const id = parseInt(componentid, 10)

        try{
            const component = await prisma[type].findUnique({
                where: {id}
            })
            console.log('')
            console.log('')
            console.log(component)

            if (type === "cPU") {
                return res.render("display_pages/info_cpu", component)
            } else if (type === "gPU") {
                return res.render("display_pages/info_gpu", component)
            } else if (type === "ram") {
                return res.render("display_pages/info_ram", component)
            }

        } catch (err) {
            console.error("Lỗi Server 500 chi tiết:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    } 

    Info_Shop = async (req,res) => {
        const { shopid, page, limit, next, back} = req.query
        const limitInt = parseInt(limit, 10)
        const id = parseInt(shopid, 10)
        let current_page = parseInt(page, 10)

        if (next) {
            current_page += 1
        } else if (back) {
            current_page -= 1
        }
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Info_Shop")

        try{
            const shop = await prisma.shop.findUnique({ 
                where: {id},
                select: {
                    id: true,
                    shop_name: true,
                    shop_address: true,
                    laptops: true
                }
            })

            const laptops = Paginate_Data_List(current_page, limitInt, shop.laptops)
            const range_page = Range_Page_List(current_page, limitInt, shop.laptops)

            const Data = {
                id: shop.id,
                shop_name: shop.shop_name,
                shop_address: shop.shop_address,
                laptops,
                range_page,
                current_page
            }
            console.log("4: Đã tạo xong data")
            console.log('Shop:', shop.shop_name)
            console.log('Trang:', current_page, '  giới hạn:', limitInt, '  phạm vi:',  range_page)
            return res.render('display_pages/info_shop', Data)

        } catch (err) {
            console.error("Error_random_component: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    } 
    
}

module.exports = new shop