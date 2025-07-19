const AddressModel = require("../../models/addressModel");
const UserModel = require("../../models/usersModel");
const { Op } = require("sequelize");

class AddressController {
  static async getAddressesByUser(req, res) {
    // const userId = req.params.id;
    const user_id = 1;

    try {
      const addresses = await AddressModel.findAll({
        where: { user_id: userId },
        include: [
          {
            model: UserModel,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [
          ["is_default", "DESC"],
          ["created_at", "DESC"],
        ],
      });

      return res.status(200).json({ success: true, data: addresses });
    } catch (error) {
      console.error("Error in getAddressesByUser:", error);
      return res.status(500).json({
        success: false,
        message: "Lỗi server khi lấy địa chỉ theo user",
      });
    }
  }

  static async addAddress(req, res) {
    const { address_line, is_default } = req.body;
    // const user_id = req.params.userId;
        const user_id = 1;


    try {
      if (!user_id) {
        return res.status(400).json({ success: false, message: 'user_id là bắt buộc' });
      }

      if (!address_line) {
        return res.status(400).json({ success: false, message: 'address_line là bắt buộc' });
      }

      if (is_default) {
        await AddressModel.update({ is_default: 0 }, { where: { user_id } });
      }

      const newAddress = await AddressModel.create({
        address_line,
        is_default: is_default ? 1 : 0,
        user_id
      });

      return res.status(201).json({ success: true, data: newAddress, message: 'Thêm địa chỉ thành công' });
    } catch (error) {
      console.error('Error in AddressController.addAddress:', error);
      return res.status(500).json({ success: false, message: 'Lỗi server khi thêm địa chỉ', error: error.message });
    }
  }

  static async updateAddress(req, res) {
    // const user_id = req.params.userId;
    const user_id = 1;
    const address_id = req.params.id;
    const { address_line, is_default } = req.body;

    try {
      const address = await AddressModel.findByPk(address_id);

      if (!address || address.user_id !== parseInt(user_id)) {
        return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
      }

      if (!address_line) {
        return res.status(400).json({ success: false, message: 'address_line là bắt buộc' });
      }

      if (is_default) {
        await AddressModel.update(
          { is_default: 0 },
          {
            where: {
              user_id,
              id: { [Op.ne]: address_id },
            },
          }
        );
      }

      await address.update({
        address_line,
        is_default: is_default ? 1 : 0,
      });

      return res.status(200).json({ success: true, data: address });
    } catch (error) {
      console.error("Error in updateAddress:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi server khi cập nhật địa chỉ", error: error.message });
    }
  }

  static async deleteAddress(req, res) {
    // const user_id = req.params.userId;
    const user_id = 1;
    const address_id = req.params.id;

    try {
      const address = await AddressModel.findByPk(address_id);

      if (!address || address.user_id !== parseInt(user_id)) {
        return res.status(404).json({ success: false, message: "Không tìm thấy địa chỉ" });
      }

      await address.destroy();

      return res.status(200).json({ success: true, message: "Đã xoá địa chỉ" });
    } catch (error) {
      console.error("Error in deleteAddress:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi server khi xoá địa chỉ", error: error.message });
    }
  }
}

module.exports = AddressController;