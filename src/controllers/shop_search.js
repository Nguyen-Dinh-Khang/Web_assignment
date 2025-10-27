const prisma = require('../databases/database')
const fs = require('fs')


// Hàm function
async function Paginate_Data(page,limit,type){
    const skip = (page - 1) * limit
        
    try{
        const data = await prisma[type].findMany({
            skip,
            take: limit,
            orderBy: {
                id: 'desc'
            }
        })
        console.log("2: Lấy xong danh sách laptop")
        return data

    } catch (err) {
        console.error("Error_PaginateData: ", err)
        throw new Error(`ModelNotFound`);
    }   
}

async function Paginate_Data_List(page,limit,list){
    const start_raw = list.length - (page * limit)
    const start = Math.max(0, start_raw)
    const end = list.length - ((page - 1) * limit)

    try{
        const data = list.slice(start, end)
        data.reverse()
        console.log("2: Lấy xong danh sách")
        return data

    } catch (err) {
        console.error("Error_PaginateData: ", err)
        throw new Error(`Server error! Please do it again`);
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

class shop_search{
    Random_Laptop = async (req,res) => {
        const { page, limit, type, next, back } = req.query
        let pageInt = parseInt(page, 10)  || 1
        let limitInt = parseInt(limit, 10) || 15
        const modelType = type || 'laptop'
        if (next) {
            pageInt += 1
        } else if (back) {
            pageInt -= 1
        }
        console.log("1: Đã tới chỗ nhận xong biến:", pageInt, limitInt, modelType)

        try{
            const laptops = await Paginate_Data(pageInt, limitInt, modelType)
            const range_page = await Range_Page(pageInt, limitInt, modelType)

            const Data = {
                list: laptops,
                current_page: pageInt,
                limit: limitInt,
                range_page
            }
            console.log("4: Đã tạo xong data để truyền vào render search_laptop")
            return res.render('search_pages/search_laptop', Data)

        } catch (err) {
            console.error("Error_random_laptop: ", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
        
    }

    Post_Laptop_Name (req, res) {
        const {laptop_name} = req.body
        req.session.last_search_name = laptop_name

        return res.redirect(`/searchname?page=1&limit=6&type=laptop`)
    }

    Search_Name = async (req,res) => {
        const name = req.session.last_search_name
        const { page, limit, type, next, back} = req.query
        let pageInt = parseInt(page, 10)  || 1
        let limitInt = parseInt(limit, 10) || 15
        let message, list, range_page
        const fieldname = `${type}_name`
        console.log("1: Đã lấy xong biến cần thiết")

        if (!name) {
            return res.render('search_pages/search_laptop')
        }

        if (next) {
            pageInt += 1
        } else if (back) {
            pageInt -= 1
        }

        try{
            const list_raw = await prisma[type].findMany({ 
                where: {
                    [fieldname]: {
                        contains: name,                       
                    }}})

            if (list_raw.length === 0) {
                message = "Không tìm thấy thiết bị nào phù hợp với yêu cầu của bạn."
            } else {
                list = await Paginate_Data_List(pageInt, limitInt, list_raw)
                range_page = Range_Page_List(pageInt, limitInt, list_raw)
            } 

            const data = {
                list,
                message,
                current_page: pageInt,
                limit: limitInt,
                range_page
            }
            console.log("4: Đã xong bước cập nhật dữ liệu để truyền vào render search_name")
            
            if (type == 'laptop') {
                return res.render('search_pages/search_laptop', data)
            } else if (type == 'component') {
                return res.render('search_pages/search_component', data)
            }            

        } catch (err) {
            console.error("Lỗi Server 500 chi tiết:", err)
            return res.status(500).json({ message: "Server error! Please do it again" })
        }
    }
}


module.exports = new shop_search