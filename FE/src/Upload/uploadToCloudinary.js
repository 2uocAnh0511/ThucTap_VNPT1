// src/utils/uploadToCloudinary.js

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload_preset"); // thay bằng upload preset của bạn
  formData.append("cloud_name", "dwiippvbh");       // thay bằng cloud name

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dwiippvbh/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url; // trả về URL ảnh
  } catch (err) {
    console.error("Lỗi khi upload ảnh lên Cloudinary:", err);
    throw err;
  }
};
