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

exports.updateProfile = async (req, res) => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'Unauthorized' });
    const token = authHeader.split(' ')[1];

    // 2. Giải mã token để lấy userId
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 3. Tìm user và cập nhật các trường
    const user = await User.findByPk(payload.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, phone, address, avatar } = req.body;
    if (name !== undefined)    user.name    = name;
    if (phone !== undefined)   user.phone   = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined)  user.avatar  = avatar;  // avatar là URL upload từ Cloudinary

    await user.save();

    // 4. Trả về user mới (frontend sẽ cập nhật cookie “user”)
    return res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
