const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const prisma = require("./src/databases/database")
const session = require('express-session')
const routes = require('./src/routes')
const app = express()
const port = 3000


// --- Cấu hình quan trọng: Express phục vụ các tệp tĩnh ---
// Giả sử các tệp HTML của bạn nằm trong thư mục gốc của dự án
app.use('/static', express.static('static')) 
// Nếu các tệp của bạn nằm trong một thư mục con tên là 'public', hãy dùng:
// app.use(express.static('public')); 
// Thay thế 'public' bằng tên thư mục chính xác của bạn nếu cần.


// Thiết lập session để nhận diện người dùng
app.use(session({
    secret: '77896091736371787214684',
    resave: false,
    saveUninitialized: false,
}))


// Thiết lập engine để chạy template với đuôi là .hbs
app.engine('hbs', handlebars.engine({ 
    extname:'hbs',
    defaultLayout:'main', 
    helpers:{
        if_eq: function(a, b, option) {
            const valA = parseInt(a, 10)
            const valB = parseInt(b, 10)
            
            if (valA === valB) {
              return option.fn(this)
            }
            return option.inverse(this)
        },
        if_us: function(a, b, option) {
            if (a === b) {
              return option.fn(this)
            }
            return option.inverse(this)
        }}
    }))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'template'))


// Thiết lập session cho toàn bộ web
app.use(async (req, res, next) => {
  if (!req.session.userId || !req.session){
    res.locals.user = null
    return next()
  }
    
  try {
      const user = await prisma.user.findUnique({ 
        where: {id: req.session.userId},
        select: {
          id: true,
          username: true,
          role: true,
          shop: {
            select: {
              id: true,
              shop_name: true
          }}
        }})
      
      res.locals.user = user
  } catch (err) {
      req.session.destroy()
      res.locals.user = null
  }

  next()
})


// 🔽 Bắt buộc để đọc dữ liệu từ form HTML (x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));
// Hàm ở nơi khác giúp xử lí các route ở nơi khác thay vì xử lí tại file này
routes(app)


// Khởi động máy chủ
app.listen(port, () => {
  console.log(`Máy chủ đang chạy tại http://localhost:${port}`)
})