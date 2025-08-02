const Footer = () => {
  return (
    <footer className="bg-[#9F1D25] text-white py-8 w-full relative">

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
          
          {/* Logo Hotline */}
          <div className="flex justify-center md:justify-start">
            <div className="border-2 border-white border-dashed px-6 py-2 rotate-[-5deg] inline-block">
              <h2 className="text-white font-bold text-2xl">1900.6777</h2>
              <img src="/qka.png" alt="Logo" height="100" />
            </div>
          </div>

          {/* Cột 1: Chính sách */}
          <div>
            <h6 className="font-bold mb-2">CHÍNH SÁCH</h6>
            <p className="opacity-80">Chính sách đổi hàng</p>
            <p className="opacity-80">Chính sách bảo hành</p>
          </div>

          {/* Cột 2: Hệ thống cửa hàng */}
          <div>
            <h6 className="font-bold mb-2">HỆ THỐNG CỬA HÀNG</h6>
            <p className="opacity-80">TP. Hồ Chí Minh</p>
            <p className="opacity-80">Hà Nội</p>
            <p className="opacity-80">Hải Phòng</p>
            <p className="opacity-80">Biên Hòa - Bình Dương</p>
          </div>

          {/* Cột 3: Thông tin */}
          <div>
            <h6 className="font-bold mb-2">THÔNG TIN</h6>
            <p className="opacity-80">Thông tin liên hệ</p>
            <p className="opacity-80">Thanh toán - Trả góp</p>
            <p className="opacity-80">Liên hệ đối tác doanh nghiệp</p>
          </div>

        </div>

        {/* Dòng cuối */}
        <div className="mt-6 text-center text-xs opacity-80">
          Copyright by QKA Watches | Hotline: 1900 6777
        </div>
      </div>
    </footer>
  );
};

export default Footer;
