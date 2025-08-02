const { Product, User,comments  } = require("../../models");

// exports.getAll = async (req, res, next) => {
//     try {
//       const data = await comments.findAll({
//         include: [
//           {
//             model: User,
//             as: "user",
//             attributes: ["id", "name"],
//           },
//           {
//             model: Product,
//             as: "product",  // lấy từ alias trong model
//             attributes: ["id", "title"],
//           }
//         ]
//       });
  
//       res.json(data);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Lỗi khi lấy dữ liệu bình luận" });
//     }
//   };

exports.detail = async (req, res, next) => {
    // findByPk là phương thức lấy ra 1 dữ liệu
    const comment = await comments.findByPk(req.params.id)
    res.json(comment);
};

exports.create = async(req, res, next) => {
    console.log(req.body);
    const data = req.body;
    const comment = await comments.create(data);
    res.json(comment);

}
exports.update =async(req, res, next) => {
    const file = req.file;
    const data = req.body;
    console.log(req.body);
    if(file){
        data.images = file.filename;
    }
    const comment = await comments.update(
        data,
        {
            where: {
                id: req.params.id
            }
        }
    );
    res.json(comment);
}
exports.delete =async(req, res, next) => {
    const comment = await comments.destroy({
        where: {
            id: req.params.id
        }
    });
    res.json(comment);
}
exports.toggleStatus = async (req, res, next) => {
    try {
      const comment = await comments.findByPk(req.params.id);
  
      if (!comment) {
        return res.status(404).json({ message: "Không tìm thấy bình luận" });
      }
  
      const newStatus = comment.status === 1 ? 0 : 1;
  
      await comment.update({ status: newStatus });
  
      res.json({ message: "Cập nhật trạng thái thành công", status: newStatus });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi cập nhật trạng thái bình luận" });
    }
  };
  

  exports.getByProduct = async (req, res, next) => {
    const { productId } = req.params;
  
    try {
      const data = await comments.findAll({
        where: { productId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Product,
            as: "product",
            attributes: ["id", "title"],
          }
        ]
      });
  
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi lấy bình luận theo sản phẩm" });
    }
  };
  
