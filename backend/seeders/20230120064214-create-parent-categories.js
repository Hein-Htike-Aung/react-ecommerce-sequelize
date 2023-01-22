"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "parent_category",
      [
        {
          parentCategoryName: "Bags",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Shoes",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Shirts",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Makeup",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Sports",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Electronic",
          created_at: "2023-01-01 06:44:42",
          updated_at: "2023-01-01 06:44:42",
        },
        {
          parentCategoryName: "Home appliance",
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
