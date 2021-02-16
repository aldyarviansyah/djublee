const moment = require('moment');
const express = require('express');
const validator = require('validator');
const Sequelize = require('sequelize');
const randomize = require('randomatic');
const models = require('../../db/models');
const paginator = require('../../helpers/paginator');
const carSpecificationController = require('../../controller/carSpecificationController');

const { Op } = Sequelize;
const router = express.Router();

const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT || 10;
const MAX_LIMIT = process.env.MAX_LIMIT || 50;

router.get('/', async (req, res) => await carSpecificationController.GetCarSpecification(req, res));
router.get('/:id', async (req, res) => await carSpecificationController.GetCarSpecificationByCarId(req, res));
router.post('/', async (req, res) => await carSpecificationController.CreateAllSpecCar(req, res));
router.patch('/:id', async (req, res) => await carSpecificationController.EditAllSpecCar(req, res));
router.delete('/:id', async (req, res) => await carSpecificationController.DeleteAllSpecCar(req, res));

//dimensi
router.get('/dimensi/:id', async (req, res) => await carSpecificationController.getDimensi(req, res));
router.post('/dimensi/', async (req, res) => await carSpecificationController.addDimensi(req, res));
router.patch('/dimensi/:id', async (req, res) => await carSpecificationController.editDimensi(req, res));
//end of dimensi

//Interior
router.get('/interior/:id', async (req, res) => await carSpecificationController.getInterior(req, res));
router.post('/interior/', async (req, res) => await carSpecificationController.addInterior(req, res));
router.patch('/interior/:id', async (req, res) => await carSpecificationController.editInterior(req, res));
//end of interior

//Exterior
router.get('/exterior/:id', async (req, res) => await carSpecificationController.getExterior(req, res));
router.post('/exterior/', async (req, res) => await carSpecificationController.addExterior(req, res));
router.patch('/exterior/:id', async (req, res) => await carSpecificationController.editExterior(req, res));
//end of Exterior

//Mesin
router.get('/mesin/:id', async (req, res) => await carSpecificationController.getMesin(req, res));
router.post('/mesin/', async (req, res) => await carSpecificationController.addMesin(req, res));
router.patch('/mesin/:id', async (req, res) => await carSpecificationController.editMesin(req, res));
//end of Mesin

//Performa
router.get('/performa/:id', async (req, res) => await carSpecificationController.getPerforma(req, res));
router.post('/performa/', async (req, res) => await carSpecificationController.addPerforma(req, res));
router.patch('/performa/:id', async (req, res) => await carSpecificationController.editPerforma(req, res));
//end of Performa

//Safety
router.get('/safety/:id', async (req, res) => await carSpecificationController.getSafety(req, res));
router.post('/safety/', async (req, res) => await carSpecificationController.addSafety(req, res));
router.patch('/safety/:id', async (req, res) => await carSpecificationController.editSafety(req, res));
//end of Safety

//Entertainment
router.get('/entertainment/:id', async (req, res) => await carSpecificationController.getEntertainment(req, res));
router.post('/entertainment/', async (req, res) => await carSpecificationController.addEntertainment(req, res));
router.patch('/entertainment/:id', async (req, res) => await carSpecificationController.editEntertainment(req, res));
//end of Entertainment

//Berita
router.get('/berita/:id', async (req, res) => await carSpecificationController.getBerita(req, res));
router.post('/berita/', async (req, res) => await carSpecificationController.addBerita(req, res));
router.patch('/berita/:id', async (req, res) => await carSpecificationController.editBerita(req, res));
//end of berita

//Video
router.get('/video/:id', async (req, res) => await carSpecificationController.getVideo(req, res));
router.post('/video/', async (req, res) => await carSpecificationController.addVideo(req, res));
router.patch('/video/:id', async (req, res) => await carSpecificationController.editVideo(req, res));
//end of video

module.exports = router;