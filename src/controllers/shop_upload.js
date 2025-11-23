const prisma = require('../databases/database')
const fs = require('fs')

class shop_upload{
    Upload_Shop_Form(req,res){
        res.render('admin_pages/form_shop', { 
            layout: 'admin',
            isUpdating: false,
            actionPath: '/uploadshop'
        })
    }

    Upload_Laptop_Form(req, res){
        const {is_staff} = req.query
        if (is_staff) {
            res.render('admin_pages/form_laptop', { 
                isUpdating: false,
                actionPath: '/uploadlaptop' 
            })
        } else {
            res.render('admin_pages/form_laptop', { 
                layout: 'admin',
                isUpdating: false,
                actionPath: '/uploadlaptop' 
            })
        }
    }

    Upload_Ram_Form(req, res){
        res.render('admin_pages/form_ram', { 
            layout: 'admin',
            isUpdating: false,
            actionPath: '/uploadram'
        })
    }

    Upload_Cpu_Form(req, res){
        res.render('admin_pages/form_cpu', { 
            layout: 'admin',
            isUpdating: false,
            actionPath: '/uploadcpu'
        })
    }

    Upload_Gpu_Form(req, res){
        res.render('admin_pages/form_gpu', { 
            layout: 'admin',
            isUpdating: false,
            actionPath: '/uploadgpu'
        })
    }



    Upload_Shop = async (req,res) => {
        const { shop_name, shop_address, username } = req.body

        if (!shop_name || !shop_address || !username){
            return res.status(400).json({ message: "Please fill in all required information" })
        }
        
        try {
            const [existingshop, existinguser] = await Promise.all([
                prisma.shop.findUnique({ where: { shop_name } }),
                prisma.user.findUnique({ where: { username } }),
            ])

            if (existingshop){
                return res.status(409).json({ message: "Shop is exist!" })
            }
            if (!existinguser){
                return res.status(404).json({ message: "User not found!" })
            }

            const shopowner = await prisma.shop.findUnique({ where: { user_id: existinguser.id } })
            if (shopowner){
                return res.status(409).json({ message: "This user already has a shop!" })
            }


            const newshop = await prisma.shop.create({
                data: {
                    shop_name,
                    shop_address,
                    user_id: existinguser.id
            }})
            return res.status(201).json({ message: "Shop created successfully", shop: newshop })

        } catch (err) {
            console.error("Upload_Shop error:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }  
    }

    Upload_Laptop = async (req,res) => {
        const { laptop_name, storage, ram, cpu, gpu, screen_size, screen_type, battery, price, shop_name } = req.body
        const screen_sizeFloat = parseFloat(screen_size)
        const priceInt = parseInt(price, 10)
        const batteryInt = parseInt(battery, 10)
        const laptop_img = req.file 
            ? `/static/uploads/laptop/${req.file.filename}`
            : null

        if (!laptop_img){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Laptop image file is required!" })
        }
        if (!laptop_name || !storage || !ram || !cpu || !gpu || !screen_sizeFloat || !screen_type || !batteryInt || !priceInt || !shop_name){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const [existinglaptop, existingshop] = await Promise.all([
                prisma.laptop.findUnique({ where: {laptop_name}}),
                prisma.shop.findUnique({ where: {shop_name}}),
            ])

            if (existinglaptop){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Laptop is exist!" })
            }
            if (!existingshop){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(404).json({ message: "Shop not found!" })
            }

            const newlaptop = await prisma.laptop.create({
                data: {
                    laptop_name, 
                    laptop_img, 
                    storage, 
                    ram, 
                    cpu, 
                    gpu, 
                    screen_size: screen_sizeFloat,
                    screen_type, 
                    battery: batteryInt, 
                    price: priceInt,
                    shop_id: existingshop.id
            }})
            return res.status(201).json({ message: "Laptop created successfully", laptop: newlaptop })

        } catch (err) {
            console.error('Upload_Laptop error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Upload_Ram = async (req,res) => {
        const { ram_name, capacity, speed, type, manufacturer } = req.body
        const [capacityInt, speedInt] = [parseInt(capacity, 10), parseInt(speed, 10)]
        const ram_img = req.file 
            ? `/static/uploads/ram/${req.file.filename}`
            : null

        if (!ram_img){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Ram image file is required!" })
        }
        if (!ram_name || !capacityInt || !speedInt || !type || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existingram = await prisma.ram.findUnique({ where: {ram_name}})

            if (existingram){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Ram is exist!" })
            }


            const newram = await prisma.ram.create({
                data: {
                   ram_name,
                   ram_img,
                   capacity: capacityInt,
                   speed: speedInt,
                   type,
                   manufacturer,
            }})
            return res.status(201).json({ message: "Ram created successfully", ram: newram })

        } catch (err) {
            console.error('Upload_Ram error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Upload_Cpu = async (req,res) => {
        const { cpu_name, cores, threads, baseClock, boostClock, manufacturer } = req.body
        const [coresInt, threadsInt] = [parseInt(cores, 10), parseInt(threads, 10)]
        const [baseClockFloat, boostClockFloat] = [parseFloat(baseClock), parseFloat(boostClock)]
        const cpu_img = req.file 
            ? `/static/uploads/cpu/${req.file.filename}`
            : null

        if (!cpu_img){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Cpu image file is required!" })
        }
        if (!cpu_name || !coresInt || !threadsInt || !baseClockFloat || !boostClockFloat || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existingcpu = await prisma.cPU.findUnique({ where: {cpu_name}})

            if (existingcpu){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Cpu is exist!" })
            }


            const newcpu = await prisma.cPU.create({
                data: {
                    cpu_name,
                    cpu_img,
                    cores: coresInt,
                    threads: threadsInt,
                    baseClock: baseClockFloat,
                    boostClock: boostClockFloat,
                    manufacturer
            }})
            return res.status(201).json({ message: "Cpu created successfully", cpu: newcpu })

        } catch (err) {
            console.error('Upload_cpu error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Upload_Gpu = async (req,res) => {
        const { gpu_name, vram, clockSpeed, manufacturer } = req.body
        const vramInt = parseInt(vram, 10)
        const clockSpeedFloat = parseFloat(clockSpeed)
        const gpu_img = req.file 
            ? `/static/uploads/gpu/${req.file.filename}`
            : null

        if (!gpu_img){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Gpu image file is required!" })
        }
        if (!gpu_name || !vramInt || !clockSpeedFloat || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existinggpu = await prisma.gPU.findUnique({ where: {gpu_name}})

            if (existinggpu){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Gpu is exist!" })
            }


            const newgpu = await prisma.gPU.create({
                data: {
                    gpu_name,
                    gpu_img,
                    vram: vramInt,
                    clockSpeed: clockSpeedFloat,
                    manufacturer
            }})
            return res.status(201).json({ message: "Gpu created successfully", gpu: newgpu })

        } catch (err) {
            console.error('Upload_Gpu error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

}


module.exports = new shop_upload