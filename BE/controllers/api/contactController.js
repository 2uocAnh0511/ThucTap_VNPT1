const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
  const { username, email, content } = req.body;

  try {
    // Tạo transporter với Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'khoadinh.280404@gmail.com',           // Gmail bạn
        pass: 'avzo zckx qgbo kvyv',              // App password (không phải mật khẩu Gmail thường)
      },
    });

    const mailOptions = {
  from: '"Liên hệ website" <your_email@gmail.com>',
  to: "your_email@gmail.com",
  replyTo: email,  // để người nhận nhấn "Trả lời" sẽ gửi đúng đến người liên hệ
  subject: `Liên hệ từ ${username}`,
  html: `
    <p><strong>Họ tên:</strong> ${username}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Nội dung:</strong><br>${content}</p>
  `,
};

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Gửi email thành công!" });
  } catch (error) {
    console.error("Lỗi gửi email:", error);
    res.status(500).json({ error: "Gửi email thất bại!" });
  }
};
