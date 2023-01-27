"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(+process.env.SALT);
    const ownerPassword = bcrypt.hashSync("owner123!@#", salt);
    const adminPassword = bcrypt.hashSync("admin123!@#", salt);
    const managerPassword = bcrypt.hashSync("manager123!@#", salt);
    const editorPassword = bcrypt.hashSync("editor123!@#", salt);
    await queryInterface.bulkInsert(
      "user",
      [
        {
          fullName: "OwnerUser",
          email: "owneruser@gmail.com",
          password: ownerPassword,
          phone: "09234234243",
          status: false,
          img: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=1200",
          gender: "Male",
          role: "Owner",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          fullName: "AdminUser",
          email: "adminuser@gmail.com",
          password: adminPassword,
          phone: "09234234243",
          status: false,
          img: "https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=1200",
          gender: "Male",
          role: "Admin",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          fullName: "ManagerUser",
          email: "manageruser@gmail.com",
          password: managerPassword,
          phone: "09234234243",
          status: false,
          img: "https://images.pexels.com/photos/2231132/pexels-photo-2231132.jpeg?auto=compress&cs=tinysrgb&w=1200",
          gender: "Female",
          role: "Manager",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          fullName: "EditorUser",
          email: "editoruser@gmail.com",
          password: editorPassword,
          phone: "09234234243",
          status: false,
          img: "https://images.pexels.com/photos/1128061/pexels-photo-1128061.jpeg?auto=compress&cs=tinysrgb&w=1200",
          gender: "Female",
          role: "Editor",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
