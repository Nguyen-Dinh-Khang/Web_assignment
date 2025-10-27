const prisma = require('../databases/database')
const fs = require('fs')

class shop {
    Home = async (req,res) => {
        res.render('home')
    }

    Search_Shop(req,res){
        res.render('search_pages/search_shop')
    }

    Search_Component(req,res){
        res.render('search_pages/search_component')
    }

    Search_Offer(req,res){
        res.render('search_pages/search_offer')
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
}

module.exports = new shop