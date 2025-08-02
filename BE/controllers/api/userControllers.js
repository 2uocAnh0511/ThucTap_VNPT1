const userModel = require('../../models/user');
const { Op, where } = require("sequelize");


exports.getAll = async (req, res, next) => {
    const data = await userModel.findAll()
    res.json(data);
};

exports.detail = async (req, res, next) => {
    // findByPk là phương thức lấy ra 1 dữ liệu
    const user = await userModel.findByPk(req.params.id)
    res.json(user);
};

exports.create = async (req, res, next) => {
    const file = req.file;
    console.log(file);// 
    const body = req.body;
    const user = await userModel.create(body);
    res.json(user);
};
exports.update =async(req, res, next) => {
    const file = req.file;
    const data = req.body;
    console.log(req.body);
    if(file){
        data.images = file.filename;
    }
    const user = await userModel.update(
        data,
        {
            where: {
                id: req.params.id
            }
        }
    );
    res.json(user);
}
exports.delete =async(req, res, next) => {
    const user = await userModel.destroy({
        where: {
            id: req.params.id
        }
    });
    res.json(user);


}

