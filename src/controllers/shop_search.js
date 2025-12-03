const prisma = require('../databases/database')
const fs = require('fs')


// Hàm function
async function Paginate_Data(page,limit,type){
    if (!page || !type || !limit){
        console.error("Error lack info", page, type, limit)
        throw new Error(`Lack info`);
    }
    const skip = (page - 1) * limit
        
    try{
        const data = await prisma[type].findMany({
            skip,
            take: limit,
            orderBy: {
                id: 'desc'
            }
        })
        console.log("2: Lấy xong danh sách trang")
        return data

    } catch (err) {
        console.error("Error_PaginateData: ", err)
        throw new Error(`ModelNotFound`);
    }   
}

async function Range_Page(page,limit,type){
    if (!page || !type || !limit){
        console.error("Error lack info")
        throw new Error(`Lack info`);
    }
    
    try{
        const count = await prisma[type].count()
        const quantity = Math.ceil(count / limit)
        let range = []
        let max
        let min

        if (quantity == 1){
            const data = {
                range: [1],
                max: true,
                min: true
            }
            console.log("3: Chỉ có một trang")
            return data

        } else if (quantity == 2) {
            const data = {
                range: [1,2],
                max: (page == quantity),
                min: (page == 1)
            }
            console.log("3: Chỉ có hai trang")
            return data
        }


        if (page == 1){
            const data = {
                range: [1,2,3],
                max: (page == quantity),
                min: (page == 1)
            }
            console.log("3: Tạo xong phạm vi trang")
            return data
        } else if ( 1 < page && page < quantity){
            range[0] = page - 1
            range[1] = page
            range[2] = page + 1
        } else if (page == quantity) {
            range[0] = page - 2
            range[1] = page - 1
            range[2] = page
        }
        const data = {
            range,
            max: (page == quantity),
            min: (page == 1)
        }
        console.log("3: Tạo xong phạm vi trang")
        return data

    } catch (err) {
        console.error("Error can not create range_page")
        throw new Error(`Server error! Please do it again`);
    }
}

function Paginate_Data_List(page,limit,list){
    const start_raw = list.length - (page * limit)
    const start = Math.max(0, start_raw)
    const end = list.length - ((page - 1) * limit)

    try{
        const data = list.slice(start, end)
        data.reverse()
        console.log("2: Lấy xong danh sách trang")
        return data

    } catch (err) {
        console.error("Error_PaginateData: ", err)
        throw new Error(`Server error! Please do it again`);
    }
}

function Range_Page_List(page,limit,list){
    let range = []
    let max, min
    const quantity = Math.ceil(list.length / limit)

    if (quantity === 1) {
        const data = {
            range: [1],
            max: true,
            min: true
        }
        console.log("3: Chỉ có một trang")
        return data
    } else if (quantity === 2) {
        const data = {
            range: [1,2],
            max: (page === quantity),
            min: (page === 1)
        }
        console.log("3: Chỉ có hai trang")
        return data
    } else {
        if (page === 1) {
            range= [1,2,3]
        } else if (1 < page && page < quantity) {
            range[0] = page - 1
            range[1] = page
            range[2] = page + 1
        } else if (page === quantity) {
            range[0] = page - 2
            range[1] = page - 1
            range[2] = page 
        }

        const data = {
            range,
            max: (page === quantity),
            min: (page === 1)
        }
        console.log("3: Có ba trang")
        return data
    }
}


class shop__search{
    Random_Laptop = async (req,res) => {
        const { page, limit, next, back } = req.query
        const type = "laptop"
        // Xử lí kiểu dữ liệu
        let current_page = parseInt(page, 10)  || 1
        let limitInt = parseInt(limit, 10) || 6
        
        if (next) {
            current_page += 1
        } else if (back) {
            current_page -= 1
        }
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Ramdom_laptop")

        try{
            const list = await Paginate_Data(current_page, limitInt, type)
            const range_page = await Range_Page(current_page, limitInt, type)

            const Data = {
                list,
                current_page,
                range_page
            }
            console.log("4: Đã tạo xong data")
            console.log('Trang:', current_page, '  giới hạn:', limitInt, '  phạm vi:',  range_page)
            return res.render('search_pages/search_laptop', Data)

        } catch (err) {
            console.error("Error_random_laptop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }    
    }

    Random_Component = async (req,res) => {
        console.log(req.query)
        const { page, limit, next, back } = req.query
        const type = ['ram', 'cPU', 'gPU']
        // Xử lí kiểu dữ liệu
        let limitInt = parseInt(limit, 10) || 6
        let current_page = page.map( p => parseInt(p, 10))
        // Khai báo object
        let list = {}
        let range_page = {}
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Random_component")

        // Lấy số hiệu của loại thiết bị:  1:ram   2:cpu  3:gpu
        const indexvalue = next || back
        if (indexvalue) {
            const indexpage = parseInt(indexvalue, 10) - 1   // Vì index trong array bắt đầu từ 0 trong khi số hiệu thì từ 1

            if (next) {
                current_page[indexpage] += 1
            } else if (back) {
                current_page[indexpage] -= 1
            } 
        } // Lấy page của thiết bị thực hiện tính toán
        
        
        try {
            for (let i of type) {
                let indexpage = type.indexOf(i)
                let page = (indexpage !== -1) ? current_page[indexpage] : 1

                list[i] = await Paginate_Data(page, limitInt, i)
                range_page[i] = await Range_Page(page, limitInt, i)
            }

            const Data = {
                list,
                current_page_ram: current_page[0],
                current_page_cpu: current_page[1],
                current_page_gpu: current_page[2],
                range_page
            }
            console.log("4: Đã tạo xong data")
            console.log(Data)
            return res.render('search_pages/search_component', Data)

        } catch (err) {
            console.error("Error_random_component: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Random_Shop = async (req,res) => {
        try{
            const shop_list = await prisma.shop.findMany({
                select: {
                    id: true,
                    shop_name: true,
                    shop_address: true,
                    user: {
                        select: {
                            username: true
                    }},
                    _count: {
                        select:{
                            laptops: true
                    }}
                }
            })

            const shop = shop_list.map(shop => ({
                id: shop.id,
                shop_name: shop.shop_name,
                shop_address: shop.shop_address,
                owner: shop.user.username,
                amount: shop._count.laptops
            }))

            console.log("")
            console.log("")
            console.log("Thành công lấy danh sách shop")
            return res.render('search_pages/search_shop', {shop:shop})

        } catch (err) {
            console.error("Error_random_shop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    
    Post_Laptop_Name (req, res) {
        const {laptop_name} = req.body
        req.session.last_search_name = laptop_name

        return res.redirect('/searchlaptop?page=1&limit=6')
    }

    Post_Component_Name (req,res) {
        const {component_name} = req.body
        req.session.last_search_name = component_name

        return res.redirect('/searchcomponent?page=1&page=1&page=1&limit=3')
    }

    Post_Laptop_Component (req,res) {
        const { storage, ram, cpu, gpu, battery, price } = req.body
        req.session.last_search_storage = storage
        req.session.last_search_ram = ram
        req.session.last_search_cpu = cpu
        req.session.last_search_gpu = gpu
        req.session.last_search_battery = battery
        req.session.last_search_price = price

        return res.redirect('/laptopcomponent?page=1&limit=6')
    }

    Post_Shop_Name (req,res) {
        const {shop_name} = req.body
        req.session.last_search_name = shop_name

        return res.redirect('/searchshop')
    }


    Search_Laptop_Name = async (req,res) => {
        const name = req.session.last_search_name
        const { page, limit, next, back} = req.query
        // Xử lí kiểu dữ liệu
        let limitInt = parseInt(limit, 10) || 6
        let current_page = parseInt(page, 10)  || 1
        // Khai báo biến
        let message, list, range_page

        if (!name) {
            return res.redirect(`/laptop?page=${current_page}&limit=6`)
        } 

        if (next) {
            current_page += 1
        } else if (back) {
            current_page -= 1
        }
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Search_Laptop_Name")


        try{
            const list_raw = await prisma.laptop.findMany({ 
                where: {
                    laptop_name: {
                        contains: name,                       
                    }}
            })
            

            if (list_raw.length === 0) {
                message = "Không tìm thấy thiết bị nào phù hợp với yêu cầu của bạn."
            } else {
                list = Paginate_Data_List(current_page, limitInt, list_raw)
                range_page = Range_Page_List(current_page, limitInt, list_raw)
            } 

            const Data = {
                message,
                laptop_name: name,
                list,
                current_page,
                range_page,
                in_search: current_page
            }
            console.log("4: Đã tạo xong data")
            console.log('Trang:', current_page, '  giới hạn:', limitInt, '  phạm vi:',  range_page)
            return res.render('search_pages/search_laptop', Data)
                  
        } catch (err) {
            console.error("Error_search_laptop_name: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Search_Component_Name = async (req,res) => {
        const name = req.session.last_search_name
        const { page, limit, next, back } = req.query
        const type = ['ram', 'cPU', 'gPU']
        const fieldname = ['ram_name', 'cpu_name', 'gpu_name']
        // Xử lí kiểu dữ liệu
        let current_page = page.map(p => parseInt(p,10) || 1)
        let limitInt = parseInt(limit, 10)
        // Khai báo biến
        let list = {}, list_raw = {}, range_page = {}, message
        

        if (!name) {
            return res.redirect('/component?page=1&page=1&page=1&limit=3')
        }

        const indexdata = next || back
        if (indexdata) {
            const indextype = indexdata - 1
            if (next) {
                current_page[indextype] += 1
            } else {
                current_page[indextype] -= 1
            }
        }
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Search_Component_Name")


        try{
            for (let i of type) {
                list_raw[i] = await prisma[i].findMany({
                    where: {
                        [fieldname[type.indexOf(i)]]: {
                        contains: name
                    }}
                })
                
                if (list_raw[i].length != 0) {
                    list[i] = Paginate_Data_List(current_page[type.indexOf(i)], limitInt, list_raw[i])
                    range_page[i] = Range_Page_List(current_page[type.indexOf(i)], limitInt, list_raw[i])
                }
            }

            if (list_raw['ram'].length == 0 && list_raw['cPU'].length == 0 && list_raw['gPU'].length == 0) {
                message = "Không tìm thấy thiết bị nào phù hợp với yêu cầu của bạn."
            }

            const Data = {
                message,
                component_name: name,
                list,
                current_page_ram: current_page[0],
                current_page_cpu: current_page[1],
                current_page_gpu: current_page[2],
                range_page
            }
            console.log("4: Đã tạo xong data")
            console.log(Data)
            return res.render('search_pages/search_component', Data)

        } catch (err) {
            console.error("Error_search_component: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Search_Laptop_Component = async (req,res) => {
        let storage = req.session.last_search_storage || ''
        let ram = req.session.last_search_ram || ''
        let cpu = req.session.last_search_cpu || ''
        let gpu = req.session.last_search_gpu || ''
        let battery = req.session.last_search_battery || ''
        let price  = req.session.last_search_price || ''
        let { page, limit, next, back } = req.query 
        // Xử lí hình thức
        storage = storage.trim().replaceAll(/\s+/g, ' ')
        ram = ram.trim().replaceAll(/\s+/g, ' ')
        cpu = cpu.trim().replaceAll(/\s+/g, ' ')
        gpu = gpu.trim().replaceAll(/\s+/g, ' ')
        battery = battery.trim().replaceAll(/\s+/g, '')
        price = price.trim().replaceAll(/\s+/g, '')
        // Xử lí kiểu
        price = parseInt(price,10) || ''
        battery = parseInt(battery, 10)  || ''
        let current_page = parseInt(page,10)
        let limitInt = parseInt(limit,10)
        // Khai báo biến
        const inputdata_key = ['storage', 'ram', 'cpu', 'gpu', 'battery', 'price']
        const inputdata_value = {
            storage, 
            ram, 
            cpu, 
            gpu, 
            battery, 
            price
        }
        let list_raw = []
        let message, list, range_page, list_score
        // Xử lí trang
        if (next) {
            current_page += 1
        } else if (back) {
            current_page -= 1
        }
        console.log("")
        console.log("")
        console.log("1: Đã xử lí xong dữ liệu vào hàm Search_Laptop_Name")


        try{
            // Lấy toàn bộ laptop thỏa mãn ít nhất một điều kiện
            let list_raw_raw = []
            for (let i of inputdata_key.slice(0,4)) {
                if (inputdata_value[i]) {
                    const list_raw_raw_raw = await prisma.laptop.findMany({
                        where: {
                            [i]: {
                                contains: inputdata_value[i]
                        }}
                    })

                list_raw_raw.push(...list_raw_raw_raw)
            }}

            // Lọc laptop trùng
            const uniqueLaptopsMap = new Map()
            for (let laptop of list_raw_raw) {
                uniqueLaptopsMap.set(laptop.id, laptop)
            }
            list_raw_raw = Array.from(uniqueLaptopsMap.values())


            if (list_raw_raw.length === 0) {
                message = "Không tìm thấy thiết bị phù hợp!"
            } else {
                // Cho dữ liệu vào list_raw (array có phần tử là object)
                list_raw = list_raw_raw.map(laptop => ({
                    laptop: laptop,
                    score: 0
                }))

                // Tính điểm cho dữ liệu trong object list_raw
                for (let i of list_raw) {
                    for (let y = 0; y < 4; y++) {
                        const key = inputdata_key[y]
                        const inputdata = inputdata_value[key]
                        const laptopdata = i.laptop[key]

                        if (inputdata && laptopdata.toLowerCase().includes(inputdata.toLowerCase())) {
                            i.score += 1 
                        }
                    }

                    if (inputdata_value.battery) {
                        let dif = Math.abs(i.laptop.battery - inputdata_value.battery)
                        if (dif <= 15) {
                            i.score += 2 - (dif / 10)
                        } 
                    }

                    if (inputdata_value.price) {
                        let dif = Math.abs(i.laptop.price - inputdata_value.price)
                        if (dif <= 3000000) {
                            i.score += 2 - (dif / 2000000)
                        }
                    } 
                }

                // Sắp xếp theo điểm
                list_raw.sort((a,b) => {return a.score - b.score})
                list_score = list_raw.map(score => {return score})
                list_raw = list_raw.map(laptop => {return laptop.laptop})
                
                // Xử lí trang
                list = Paginate_Data_List(current_page, limitInt, list_raw)
                range_page = Range_Page_List(current_page, limitInt, list_raw)
            }

            const Data = {
                message,
                storage,
                ram,
                cpu,
                gpu,
                battery,
                price,
                list,
                current_page,
                range_page,
                in_sort: current_page,
            }
            console.log("4: Đã tạo xong data")
            console.log('Trang:', current_page, '  giới hạn:', limitInt, '  phạm vi:',  range_page)
            return res.render('search_pages/search_laptop', Data)

        } catch (err) {
            console.error("Error_search_laptop_component: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }

    Search_Shop_Name = async (req,res) => {
        const name = req.session.last_search_name
        let message

        if (!name) {
            return res.redirect(`/shop`)
        }

        try{
            const shop_list = await prisma.shop.findMany({
                where: {
                    shop_name: {
                        contains: name
                }},
                select: {
                    id: true,
                    shop_name: true,
                    shop_address: true,
                    user: {
                        select: {
                            username: true
                    }},
                    _count: {
                        select:{
                            laptops: true
                    }} 
                }
            })

            if (shop_list.length == 0) {
                message = "Không tìm thấy"
            }

            const shop = shop_list.map(shop => ({
                id: shop.id,
                shop_name: shop.shop_name,
                shop_address: shop.shop_address,
                owner: shop.user.username,
                amount: shop._count.laptops
            }))

            const Data = {
                message,
                shop,
                name
            }
            
            console.log('')
            console.log('')
            console.log('Đã lấy thành công shop', Data)
            return res.render('search_pages/search_shop', Data)

        } catch (err) {
            console.error("Error_search_shop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }    
    }
    
}


module.exports = {
    shop__search,
    Paginate_Data_List,
    Range_Page_List
}