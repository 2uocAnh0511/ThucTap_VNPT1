const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Đăng ký
// Đăng ký
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        console.log(req.body);

        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Tạo người dùng với role = 0
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 0
        });

        res.status(201).json({
            message: "Đăng ký thành công!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Email hoặc mật khẩu không chính xác!" });
      }
  
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
        JWT_SECRET,
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        message: "Đăng nhập thành công!",
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }  // Đảm bảo rằng bạn trả về thông tin user
      });
  
    } catch (error) {
      console.error("Lỗi server:", error);
      return res.status(500).json({ message: "Lỗi server, vui lòng thử lại!", error: error.message });
    }
  };
  
