const prisma = require('../databases/database')
const fs = require('fs')
const path = require('path');


class shop_update{
    Update_Laptop_Form = async (req,res) => {
        const {laptopid} = req.query
        const id = parseInt(laptopid, 10)

        try {
            const laptop = await prisma.laptop.findUnique({ 
                where: {id},
                include: {
                    shop: {
                        select: {
                            shop_name: true
                        }}
                }
            })

            const Data = {
                laptop,
                isUpdating: true,
                actionPath: `/updatelaptop/${laptop.id}`
            }

            console.log("")
            console.log("")
            console.log("Đã lấy xong laptop cần sửa:", Data)
            return res.render('admin_pages/form_laptop', Data)

        } catch (err) {
            console.error("Error_update_laptop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }    
    }

    Update_Ram_Form = async (req,res) => {
        const {ramid} = req.query
        const id = parseInt(ramid, 10)

        try {
            const ram = await prisma.ram.findUnique({ where: {id} })

            const Data = {
                ram,
                isUpdating: true,
                actionPath: `/updateram/${ram.id}`
            }

            console.log("")
            console.log("")
            console.log("Đã lấy xong ram cần sửa:", Data)
            return res.render('admin_pages/form_ram', Data)

        } catch (err) {
            console.error("Error_update_ram: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }   
    }

    Update_Cpu_Form = async (req,res) => {
        const {cpuid} = req.query
        const id = parseInt(cpuid, 10)

        try {
            const cpu = await prisma.cPU.findUnique({ where: {id} })

            const Data = {
                cpu,
                isUpdating: true,
                actionPath: `/updatecpu/${cpu.id}`
            }

            console.log("")
            console.log("")
            console.log("Đã lấy xong cpu cần sửa:", Data)
            return res.render('admin_pages/form_cpu', Data)

        } catch (err) {
            console.error("Error_update_cpu: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }    

    Update_Gpu_Form = async (req,res) => {
        const {gpuid} = req.query
        const id = parseInt(gpuid, 10)

        try {
            const gpu = await prisma.gPU.findUnique({ where: {id} })

            const Data = {
                gpu,
                isUpdating: true,
                actionPath: `/updategpu/${gpu.id}`
            }

            console.log("")
            console.log("")
            console.log("Đã lấy xong gpu cần sửa:", Data)
            return res.render('admin_pages/form_gpu', Data)
        
        } catch (err) {
            console.error("Error_update_gpu: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Update_Shop_Form = async (req,res) => {
        const {shopid} = req.query
        const id = parseInt(shopid, 10)

        try {
            const shop = await prisma.shop.findUnique({ 
                where: {id},
                include: {
                    user: {
                        select: {
                            username: true,
                        }}
                } 
            })

            const Data = {
                shop,
                isUpdating: true,
                actionPath: `/updateshop/${shop.id}`
            }   

            console.log("")
            console.log("")
            console.log("Đã lấy xong shop cần sửa:", Data)
            return res.render('admin_pages/form_shop', Data)

        } catch (err) {
            console.error("Error_update_shop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }


    Update_Laptop = async (req,res) => {
        const { laptop_name, storage, ram, cpu, gpu, screen_size, screen_type, battery, price, shop_name } = req.body
        const screen_sizeFloat = parseFloat(screen_size)
        const priceInt = parseInt(price, 10)
        const batteryInt = parseInt(battery, 10)
        const id = parseInt(req.params.id, 10)
        let laptop_img, old_laptop_img


        if (!laptop_name || !storage || !ram || !cpu || !gpu || !screen_sizeFloat || !screen_type || !batteryInt || !priceInt || !shop_name){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const [existinglaptop, existingshop] = await Promise.all([
                prisma.laptop.findUnique({ where: {id}}),
                prisma.shop.findUnique({ where: {shop_name}}),
            ])

            if (!existinglaptop){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(404).json({ message: "Laptop not found!" })
            }
            if (!existingshop){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(404).json({ message: "Shop not found!" })
            }

            if (req.file) {
                laptop_img = `/static/uploads/laptop/${req.file.filename}`
                old_laptop_img = existinglaptop.laptop_img

                if (old_laptop_img && old_laptop_img.startsWith('/static/uploads/laptop/')) {
                    const oldname = path.basename(old_laptop_img)
                    const oldpath = path.join(__dirname, '..', '..', 'static', 'uploads', 'laptop', oldname)

                    if (fs.existsSync(oldpath)) {
                        fs.unlinkSync(oldpath)
                    }
                }

            } else {
                laptop_img = existinglaptop.laptop_img
            }

            const newlaptop = await prisma.laptop.update({
                where: {id},
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
            // return res.status(200).json({ message: "Laptop updating successfully", laptop: newlaptop })
            res.redirect('/laptop?page=1&limit=6')

        } catch (err) {
            console.error('Update_Laptop error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Update_Ram = async (req,res) => {
        const { ram_name, capacity, speed, type, manufacturer } = req.body
        const [capacityInt, speedInt] = [parseInt(capacity, 10), parseInt(speed, 10)]
        const id = parseInt(req.params.id, 10)
        let ram_img, old_ram_img

        if (!ram_name || !capacityInt || !speedInt || !type || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existingram = await prisma.ram.findUnique({ where: {id}})

            if (!existingram){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(404).json({ message: "Ram not found!" })
            }

            if (req.file) {
                ram_img = `/static/uploads/ram/${req.file.filename}`
                old_ram_img = existingram.ram_img

                if (old_ram_img && old_ram_img.startsWith('/static/uploads/ram/')) {
                    const oldname = path.basename(old_ram_img)
                    const oldpath = path.join(__dirname, '..', '..', 'static', 'uploads', 'ram', oldname)

                    if (fs.existsSync(oldpath)) {
                        fs.unlinkSync(oldpath)
                    }
                }

            } else {
                ram_img = existingram.ram_img
            }

            const newram = await prisma.ram.update({
                where: {id},
                data: {
                   ram_name,
                   ram_img,
                   capacity: capacityInt,
                   speed: speedInt,
                   type,
                   manufacturer,
            }})
            // return res.status(201).json({ message: "Ram created successfully", ram: newram })
            res.redirect('/component?page=1&page=1&page=1&limit=3')

        } catch (err) {
            console.error('Update_Ram error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Update_Cpu = async (req,res) => {
        const { cpu_name, cores, threads, baseClock, boostClock, manufacturer } = req.body
        const [coresInt, threadsInt] = [parseInt(cores, 10), parseInt(threads, 10)]
        const [baseClockFloat, boostClockFloat] = [parseFloat(baseClock), parseFloat(boostClock)]
        const id = parseInt(req.params.id, 10)
        let cpu_img, old_cpu_img


        if (!cpu_name || !coresInt || !threadsInt || !baseClockFloat || !boostClockFloat || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existingcpu = await prisma.cPU.findUnique({ where: {id}})

            if (!existingcpu){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Cpu not found!" })
            }

            if (req.file) {
                cpu_img = `/static/uploads/cpu/${req.file.filename}`
                old_cpu_img = existingcpu.cpu_img

                if (old_cpu_img && old_cpu_img.startsWith('/static/uploads/cpu/')) {
                    const oldname = path.basename(old_cpu_img)
                    const oldpath = path.join(__dirname, '..', '..', 'static', 'uploads', 'cpu', oldname)

                    if (fs.existsSync(oldpath)) {
                        fs.unlinkSync(oldpath)
                    }
                }
            
            } else {
                cpu_img = existingcpu.cpu_img
            }

            const newcpu = await prisma.cPU.update({
                where: {id},
                data: {
                    cpu_name,
                    cpu_img,
                    cores: coresInt,
                    threads: threadsInt,
                    baseClock: baseClockFloat,
                    boostClock: boostClockFloat,
                    manufacturer
            }})
            // return res.status(201).json({ message: "Cpu created successfully", cpu: newcpu })
            res.redirect('/component?page=1&page=1&page=1&limit=3')

        } catch (err) {
            console.error('Upload_cpu error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Update_Gpu = async (req,res) => {
        const { gpu_name, vram, clockSpeed, manufacturer } = req.body
        const vramInt = parseInt(vram, 10)
        const clockSpeedFloat = parseFloat(clockSpeed)
        const id = parseInt(req.params.id, 10)
        let gpu_img, old_gpu_img

    
        if (!gpu_name || !vramInt || !clockSpeedFloat || !manufacturer){
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(400).json({ message: "Please fill in all required information" })
        }

        try {
            const existinggpu = await prisma.gPU.findUnique({ where: {id}})

            if (!existinggpu){
                if (req.file) { fs.unlinkSync(req.file.path) }
                return res.status(409).json({ message: "Gpu not found!" })
            }

            if (req.file) {
                gpu_img = `/static/uploads/gpu/${req.file.filename}`
                old_gpu_img = existinggpu.gpu_img

                if (old_gpu_img && old_gpu_img.startsWith('/static/uploads/gpu/')) {
                    const oldname = path.basename(old_gpu_img)
                    const oldpath = path.join(__dirname, '..', '..', 'static', 'uploads', 'gpu', oldname)   

                    if (fs.existsSync(oldpath)) {
                        fs.unlinkSync(oldpath)
                    }
                }
            
            } else {
                gpu_img = existinggpu.gpu_img
            }

            const newgpu = await prisma.gPU.update({
                where: {id},
                data: {
                    gpu_name,
                    gpu_img,
                    vram: vramInt,
                    clockSpeed: clockSpeedFloat,
                    manufacturer
            }})
            // return res.status(201).json({ message: "Gpu created successfully", gpu: newgpu })
            res.redirect('/component?page=1&page=1&page=1&limit=3')

        } catch (err) {
            console.error('Upload_Gpu error:', err)
            if (req.file) { fs.unlinkSync(req.file.path) }
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Update_Shop = async (req,res) => {
        const { shop_name, shop_address, username } = req.body
        const id = parseInt(req.params.id, 10)

        if (!shop_name || !shop_address || !username){
            return res.status(400).json({ message: "Please fill in all required information" })
        }
        
        try {
            const [existingshop, existinguser] = await Promise.all([
                prisma.shop.findUnique({ where: { shop_name } }),
                prisma.user.findUnique({ where: { username } }),
            ])

            if (!existingshop){
                return res.status(409).json({ message: "Shop not found!" })
            }
            if (!existinguser){
                return res.status(404).json({ message: "User not found!" })
            }


            const newshop = await prisma.shop.update({
                where: {id},
                data: {
                    shop_name,
                    shop_address,
                    user_id: existinguser.id
            }})
            // return res.status(201).json({ message: "Shop created successfully", shop: newshop })
            return res.redirect(`/shopinfo?shopid=${id}&page=1&limit=6`)

        } catch (err) {
            console.error("Update_Shop error:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }  
    }

    Delete_Laptop = async (req,res) => {
        const { laptopid } = req.query
        const id = parseInt(laptopid, 10)

        try{
            const laptop = await prisma.laptop.findUnique({ where: {id} })
            
            const delete_laptop = await prisma.laptop.delete({
                where: {id}
            })

            const img_path = path.join(__dirname,'..','..',laptop.laptop_img)
            if (fs.existsSync(img_path)) {
                fs.unlinkSync(img_path)
            }
            return res.redirect("/laptop")

        } catch (err) {
            console.error("Delete_Laptop error:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }
}


module.exports = new shop_update