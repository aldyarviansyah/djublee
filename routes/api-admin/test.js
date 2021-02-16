const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const models = require('../../db/models');

router.get('/', async (req, res) => {
  try {
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  return res.json({
    success: true,
    data: "oke"
  });
});

module.exports = router;