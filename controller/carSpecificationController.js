const moment = require('moment');
const validator = require('validator');
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');
const randomize = require('randomatic');
const models = require('../db/models');
const minio = require('../helpers/minio');
const paginator = require('../helpers/paginator');
const distanceHelper = require('../helpers/distance');
const apiResponse = require('../helpers/apiResponse');
const carHelper = require('../helpers/car');
const general = require('../helpers/general');
const notification = require('../helpers/notification');

const { Op } = Sequelize;

const DEFAULT_LIMIT = process.env.DEFAULT_LIMIT || 10;
const MAX_LIMIT = process.env.MAX_LIMIT || 50;

async function GetCarSpecification(req, res, auth = false) {
  let { page, limit, by, sort } = req.query;
  let offset = 0;

  if (validator.isInt(limit ? limit.toString() : '') === false) limit = DEFAULT_LIMIT;
  if (parseInt(limit) > MAX_LIMIT) limit = MAX_LIMIT;
  if (validator.isInt(page ? page.toString() : '')) offset = (page - 1) * limit;
  else page = 1;

  if (!by) by = 'id';
  const order = [['createdAt', 'desc']];
  const where = {};

  return models.CarSpesifikasi.findAll({
    where,
    order,
    offset,
    limit,
    include: [
      {
        model: models.Car,
        as: "car",
        include: [
          {
            model: models.ModelYear,
            as: 'modelYear',
            attributes: ['id', 'year', 'modelId']
          },
          {
            model: models.City,
            as: 'city'
          },
          {
            model: models.SubDistrict,
            as: 'subdistrict'
          },
          {
            model: models.Brand,
            as: 'brand',
            attributes: ['id', 'name', 'logo', 'status']
          },
          {
            model: models.Model,
            as: 'model',
            attributes: ['id', 'name', 'groupModelId']
          },
          {
            model: models.GroupModel,
            as: 'groupModel',
            attributes: ['id', 'name', 'brandId']
          },
          {
            model: models.Color,
            as: 'interiorColor',
            attributes: ['id', 'name', 'hex']
          },
          {
            model: models.Color,
            as: 'exteriorColor',
            attributes: ['id', 'name', 'hex']
          },
          {
            model: models.MeetingSchedule,
            as: 'meetingSchedule',
            attributes: ['id', 'carId', 'day', 'startTime', 'endTime']
          },
          {
            model: models.InteriorGalery,
            as: 'interiorGalery',
            attributes: ['id', 'fileId', 'carId'],
            include: [
              {
                model: models.File,
                as: 'file'
              }
            ]
          },
          {
            model: models.ExteriorGalery,
            as: 'exteriorGalery',
            attributes: ['id', 'fileId', 'carId'],
            include: [
              {
                model: models.File,
                as: 'file'
              }
            ]
          },
          {
            required: false,
            model: models.Bargain,
            as: 'bargain',
            attributes: ['id', 'userId', 'carId', 'haveSeenCar', 'paymentMethod', 'expiredAt'],
            limit: 1,
            order: [['id', 'desc']]
          }
        ],
      },
      {
        model: models.SpesifikasiInterior,
        as: "spesifikasiInterior",
        include: [
          {
            model: models.SpesifikasiInteriorGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiExterior,
        as: "spesifikasiExterior",
        include: [
          {
            model: models.SpesifikasiExteriorGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiDimensi,
        as: "spesifikasiDimensi",
        include: [
          {
            model: models.SpesifikasiDimensiGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiMesin,
        as: "spesifikasiMesin",
        include: [
          {
            model: models.SpesifikasiMesinGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiPerforma,
        as: "spesifikasiPerforma",
        include: [
          {
            model: models.SpesifikasiPerformaGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiSafety,
        as: "spesifikasiSafety",
        include: [
          {
            model: models.SpesifikasiSafetyGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiEntertainment,
        as: "spesifikasiEntertainment",
        include: [
          {
            model: models.SpesifikasiEntertainmentGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.Berita,
        as: "berita"
      },
      {
        model: models.Video,
        as: "video"
      }
    ]
  })
    .then(async data => {
      const count = await models.CarSpesifikasi.count({ where });
      const pagination = paginator.paging(page, count, limit);

      res.json({
        success: true,
        pagination,
        data
      });
    })
    .catch(err => {
      res.status(422).json({
        success: false,
        errors: err.message
      });
    });
}

async function GetCarSpecificationByCarId(req, res, auth = false) {
  let { page, limit, by, sort } = req.query;
  let offset = 0;

  if (validator.isInt(limit ? limit.toString() : '') === false) limit = DEFAULT_LIMIT;
  if (parseInt(limit) > MAX_LIMIT) limit = MAX_LIMIT;
  if (validator.isInt(page ? page.toString() : '')) offset = (page - 1) * limit;
  else page = 1;

  if (!by) by = 'id';
  const order = [['createdAt', 'desc']];
  const where = {
    carId: req.params.id
  };

  return models.CarSpesifikasi.findOne({
    where,
    include: [
      {
        model: models.Car,
        as: "car",
        include: [
          {
            model: models.ModelYear,
            as: 'modelYear',
            attributes: ['id', 'year', 'modelId']
          },
          {
            model: models.City,
            as: 'city'
          },
          {
            model: models.SubDistrict,
            as: 'subdistrict'
          },
          {
            model: models.Brand,
            as: 'brand',
            attributes: ['id', 'name', 'logo', 'status']
          },
          {
            model: models.Model,
            as: 'model',
            attributes: ['id', 'name', 'groupModelId']
          },
          {
            model: models.GroupModel,
            as: 'groupModel',
            attributes: ['id', 'name', 'brandId']
          },
          {
            model: models.Color,
            as: 'interiorColor',
            attributes: ['id', 'name', 'hex']
          },
          {
            model: models.Color,
            as: 'exteriorColor',
            attributes: ['id', 'name', 'hex']
          },
          {
            model: models.MeetingSchedule,
            as: 'meetingSchedule',
            attributes: ['id', 'carId', 'day', 'startTime', 'endTime']
          },
          {
            model: models.InteriorGalery,
            as: 'interiorGalery',
            attributes: ['id', 'fileId', 'carId'],
            include: [
              {
                model: models.File,
                as: 'file'
              }
            ]
          },
          {
            model: models.ExteriorGalery,
            as: 'exteriorGalery',
            attributes: ['id', 'fileId', 'carId'],
            include: [
              {
                model: models.File,
                as: 'file'
              }
            ]
          },
          {
            required: false,
            model: models.Bargain,
            as: 'bargain',
            attributes: ['id', 'userId', 'carId', 'haveSeenCar', 'paymentMethod', 'expiredAt'],
            limit: 1,
            order: [['id', 'desc']]
          }
        ],
      },
      {
        model: models.SpesifikasiInterior,
        as: "spesifikasiInterior",
        include: [
          {
            model: models.SpesifikasiInteriorGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiExterior,
        as: "spesifikasiExterior",
        include: [
          {
            model: models.SpesifikasiExteriorGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiDimensi,
        as: "spesifikasiDimensi",
        include: [
          {
            model: models.SpesifikasiDimensiGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiMesin,
        as: "spesifikasiMesin",
        include: [
          {
            model: models.SpesifikasiMesinGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiPerforma,
        as: "spesifikasiPerforma",
        include: [
          {
            model: models.SpesifikasiPerformaGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiSafety,
        as: "spesifikasiSafety",
        include: [
          {
            model: models.SpesifikasiSafetyGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.SpesifikasiEntertainment,
        as: "spesifikasiEntertainment",
        include: [
          {
            model: models.SpesifikasiEntertainmentGalery,
            as: "galleries",
          }
        ]
      },
      {
        model: models.Berita,
        as: "berita"
      },
      {
        model: models.Video,
        as: "video"
      }
    ]
  })
  .then(async data => {
    res.json({
      success: true,
      data
    });
  })
  .catch(err => {
    res.status(422).json({
      success: false,
      errors: err.message
    });
  });
}

async function CreateAllSpecCar(req, res, auth = false){
  try{
    const dataExist = await models.CarSpesifikasi.findOne({where:{carId: req.body.carId}});

    if(dataExist){
      return res.json({
        success: false,
        message: "The data already exists"
      });
    }

    const result = await models.CarSpesifikasi.create(req.body,
      {
        include: [
          {
            model: models.SpesifikasiInterior,
            as: 'spesifikasiInterior',
            include: [
              {
                model: models.SpesifikasiInteriorGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiExterior,
            as: 'spesifikasiExterior',
            include: [
              {
                model: models.SpesifikasiExteriorGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiMesin,
            as: 'spesifikasiMesin',
            include: [
              {
                model: models.SpesifikasiMesinGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiPerforma,
            as: 'spesifikasiPerforma',
            include: [
              {
                model: models.SpesifikasiPerformaGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiDimensi,
            as: 'spesifikasiDimensi',
            include: [
              {
                model: models.SpesifikasiDimensiGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiSafety,
            as: 'spesifikasiSafety',
            include: [
              {
                model: models.SpesifikasiSafetyGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.SpesifikasiEntertainment,
            as: 'spesifikasiEntertainment',
            include: [
              {
                model: models.SpesifikasiEntertainmentGalery,
                as: 'galleries'
              }
            ]
          },
          {
            model: models.Berita,
            as: 'berita'
          },
          {
            model: models.Video,
            as: 'video'
          }
        ]
      }
    )
    .then(async data => {
      if(!data){
        return res.json({
          success: false,
          message: "Failed to create data"
        });
      }else{
        return res.json({
          success: true,
          data
        });

      }
    });
  }catch (err) {
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function EditAllSpecCar(req, res, auth = false){
  try{
    const Interior = await privateEditInterior(req, res);
    const Exterior = await privateEditExterior(req, res);
    const Mesin = await privateEditMesin(req, res);
    const Performa = await privateEditPerforma(req, res);
    const Dimensi = await privateEditDimensi(req, res);
    const Safety = await privateEditSafety(req, res);
    const Entertainment = await privateEditEntertainment(req, res);
    const Berita = await privateEditBerita(req, res);
    const Video = await privateEditVideo(req, res);

    const where = {
      carId: req.params.id
    };

    return models.CarSpesifikasi.findOne({
      where,
      include: [
        {
          model: models.Car,
          as: "car",
          include: [
            {
              model: models.ModelYear,
              as: 'modelYear',
              attributes: ['id', 'year', 'modelId']
            },
            {
              model: models.City,
              as: 'city'
            },
            {
              model: models.SubDistrict,
              as: 'subdistrict'
            },
            {
              model: models.Brand,
              as: 'brand',
              attributes: ['id', 'name', 'logo', 'status']
            },
            {
              model: models.Model,
              as: 'model',
              attributes: ['id', 'name', 'groupModelId']
            },
            {
              model: models.GroupModel,
              as: 'groupModel',
              attributes: ['id', 'name', 'brandId']
            },
            {
              model: models.Color,
              as: 'interiorColor',
              attributes: ['id', 'name', 'hex']
            },
            {
              model: models.Color,
              as: 'exteriorColor',
              attributes: ['id', 'name', 'hex']
            },
            {
              model: models.MeetingSchedule,
              as: 'meetingSchedule',
              attributes: ['id', 'carId', 'day', 'startTime', 'endTime']
            },
            {
              model: models.InteriorGalery,
              as: 'interiorGalery',
              attributes: ['id', 'fileId', 'carId'],
              include: [
                {
                  model: models.File,
                  as: 'file'
                }
              ]
            },
            {
              model: models.ExteriorGalery,
              as: 'exteriorGalery',
              attributes: ['id', 'fileId', 'carId'],
              include: [
                {
                  model: models.File,
                  as: 'file'
                }
              ]
            },
            {
              required: false,
              model: models.Bargain,
              as: 'bargain',
              attributes: ['id', 'userId', 'carId', 'haveSeenCar', 'paymentMethod', 'expiredAt'],
              limit: 1,
              order: [['id', 'desc']]
            }
          ],
        },
        {
          model: models.SpesifikasiInterior,
          as: "spesifikasiInterior",
          include: [
            {
              model: models.SpesifikasiInteriorGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiExterior,
          as: "spesifikasiExterior",
          include: [
            {
              model: models.SpesifikasiExteriorGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiDimensi,
          as: "spesifikasiDimensi",
          include: [
            {
              model: models.SpesifikasiDimensiGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiMesin,
          as: "spesifikasiMesin",
          include: [
            {
              model: models.SpesifikasiMesinGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiPerforma,
          as: "spesifikasiPerforma",
          include: [
            {
              model: models.SpesifikasiPerformaGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiSafety,
          as: "spesifikasiSafety",
          include: [
            {
              model: models.SpesifikasiSafetyGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.SpesifikasiEntertainment,
          as: "spesifikasiEntertainment",
          include: [
            {
              model: models.SpesifikasiEntertainmentGalery,
              as: "galleries",
            }
          ]
        },
        {
          model: models.Berita,
          as: "berita"
        },
        {
          model: models.Video,
          as: "video"
        }
      ]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.status(422).json({
          success: false,
          errors: err.message
        });
      });
  }catch (e) {
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function DeleteAllSpecCar(req, res, auth = false){
  try{
    const where = {
      carId: req.params.id
    };

    const data = await models.CarSpesifikasi.findOne({where});

    if(!data){
      return res.json({
        success: false,
        errors: "data not found"
      })
    }

    const deleteInteriorGalleries = models.SpesifikasiInteriorGalery.destroy({
      where: {
        spesifikasiInteriorId: data.spesifikasiInteriorId
      }
    })
    .catch(err => {
      res.json({
        success: false,
        errors: err.message
      })
    });

    const deleteExteriorGalleries = models.SpesifikasiExteriorGalery.destroy({
      where: {
        spesifikasiExteriorId: data.spesifikasiExteriorId
      }
    })
    .catch(err => {
      res.json({
        success: false,
        errors: err.message
      })
    });

    const deleteMesinGalleries = models.SpesifikasiMesinGalery.destroy({
      where: {
        spesifikasiMesinId: data.spesifikasiMesinId
      }
    })
    .catch(err => {
      res.json({
        success: false,
        errors: err.message
      })
    });

    const deletePerformaGalleries = models.SpesifikasiPerformaGalery.destroy({
      where: {
        spesifikasiPerformaId: data.spesifikasiPerformaId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteDimensiGalleries = models.SpesifikasiDimensiGalery.destroy({
      where: {
        spesifikasiDimensiId: data.spesifikasiDimensiId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteSafetyGalleries = models.SpesifikasiSafetyGalery.destroy({
      where: {
        spesifikasiSafetyId: data.spesifikasiSafetyId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteEntertainmentGalleries = models.SpesifikasiEntertainmentGalery.destroy({
      where: {
        spesifikasiEntertainmentId: data.spesifikasiEntertainmentId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteInterior = models.SpesifikasiInterior.destroy({
      where: {
        id: data.spesifikasiInteriorId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteExterior = models.SpesifikasiExterior.destroy({
      where: {
        id: data.spesifikasiExteriorId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteMesin = models.SpesifikasiMesin.destroy({
      where: {
        id: data.spesifikasiMesinId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deletePerforma = models.SpesifikasiPerforma.destroy({
      where: {
        id: data.spesifikasiPerformaId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteDimensi = models.SpesifikasiDimensi.destroy({
      where: {
        id: data.spesifikasiDimensiId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteSafety = models.SpesifikasiSafety.destroy({
      where: {
        id: data.spesifikasiSafetyId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteEntertainment = models.SpesifikasiEntertainment.destroy({
      where: {
        id: data.spesifikasiEntertainmentId
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteBerita = models.Berita.destroy({
      where: {
        carSpesifikasiId: data.id
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    const deleteVideo = models.Video.destroy({
      where: {
        carSpesifikasiId: data.id
      }
    })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        })
      });

    return data.destroy()
      .then(async data =>{
        res.status(200).json({
          success: true,
          data
        });
      });

  }catch{
    return res.json({
      success: false,
      message: err.message
    });
  }
}

//Interior
async function getInterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiInterior.findOne({
      where: {
        id: speCar.spesifikasiInteriorId
      },
      include: [{
        model: models.SpesifikasiInteriorGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addInterior(req, res, auth = false){
  try{
    const Interior = req.body;
    return models.SpesifikasiInterior.create(
      Interior,
      {
        include: [
          {
            model: models.SpesifikasiInteriorGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editInterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const interior = req.body;
    const galleries = req.body.galleries;
    console.log(galleries);

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const interiorData = await models.SpesifikasiInterior.findOne({
      where: { id: speCar.spesifikasiInteriorId } ,
      include: [{
        model: models.SpesifikasiInteriorGalery,
        as: 'galleries'
      }
      ]
    });

    if (!interiorData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(interiorData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiInteriorGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiInteriorId'] = interiorData.id;
        await models.SpesifikasiInteriorGalery.create(galeri);
      }else{
        await models.SpesifikasiInteriorGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await interiorData.update(interior)
      .then(async data => {
        return models.SpesifikasiInterior.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiInteriorGalery,
            as: "galleries"
          }]
        })
        .then(async data => {
          res.json({
            success: true,
            data
          });
        })
        .catch(err => {
          res.json({
            success: false,
            errors: err.message
          });
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditInterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const interior = req.body.spesifikasiInterior;
    const galleries = req.body.spesifikasiInterior.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const interiorData = await models.SpesifikasiInterior.findOne({
      where: { id: speCar.spesifikasiInteriorId } ,
      include: [{
        model: models.SpesifikasiInteriorGalery,
        as: 'galleries'
      }
      ]
    });

    if (!interiorData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(interiorData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiInteriorGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiInteriorId'] = interiorData.id;
        await models.SpesifikasiInteriorGalery.create(galeri);
      }else{
        await models.SpesifikasiInteriorGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await interiorData.update(interior)
      .then(async data => {
        return models.SpesifikasiInterior.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiInteriorGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Interior

//Exterior
async function getExterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiExterior.findOne({
      where: {
        id: speCar.spesifikasiExteriorId
      },
      include: [{
        model: models.SpesifikasiExteriorGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addExterior(req, res, auth = false){
  try{
    const Exterior = req.body;
    return models.SpesifikasiExterior.create(
      Exterior,
      {
        include: [
          {
            model: models.SpesifikasiExteriorGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editExterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const exterior = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const exteriorData = await models.SpesifikasiExterior.findOne({
      where: { id: speCar.spesifikasiExteriorId } ,
      include: [{
        model: models.SpesifikasiExteriorGalery,
        as: 'galleries'
      }
      ]
    });

    if (!exteriorData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(exteriorData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiExteriorGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiExteriorId'] = exteriorData.id;
        await models.SpesifikasiExteriorGalery.create(galeri);
      }else{
        await models.SpesifikasiExteriorGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await exteriorData.update(exterior)
      .then(async data => {
        return models.SpesifikasiExterior.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiExteriorGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditExterior(req, res, auth = false){
  try{
    const { id } = req.params;
    const exterior = req.body.spesifikasiExterior;
    const galleries = req.body.spesifikasiExterior.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const exteriorData = await models.SpesifikasiExterior.findOne({
      where: { id: speCar.spesifikasiExteriorId } ,
      include: [{
        model: models.SpesifikasiExteriorGalery,
        as: 'galleries'
      }
      ]
    });

    if (!exteriorData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(exteriorData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiExteriorGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiExteriorId'] = exteriorData.id;
        await models.SpesifikasiExteriorGalery.create(galeri);
      }else{
        await models.SpesifikasiExteriorGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await exteriorData.update(exterior)
      .then(async data => {
        return models.SpesifikasiExterior.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiExteriorGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Exterior

//Mesin
async function getMesin(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiMesin.findOne({
      where: {
        id: speCar.spesifikasiMesinId
      },
      include: [{
        model: models.SpesifikasiMesinGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addMesin(req, res, auth = false){
  try{
    const Mesin = req.body;
    return models.SpesifikasiMesin.create(
      Mesin,
      {
        include: [
          {
            model: models.SpesifikasiMesinGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editMesin(req, res, auth = false){
  try{
    const { id } = req.params;
    const mesin = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const mesinData = await models.SpesifikasiMesin.findOne({
      where: { id: speCar.spesifikasiMesinId } ,
      include: [{
        model: models.SpesifikasiMesinGalery,
        as: 'galleries'
      }
      ]
    });

    if (!mesinData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(mesinData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiMesinGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiMesinId'] = mesinData.id;
        await models.SpesifikasiMesinGalery.create(galeri);
      }else{
        await models.SpesifikasiMesinGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await mesinData.update(mesin)
      .then(async data => {
        return models.SpesifikasiMesin.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiMesinGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditMesin(req, res, auth = false){
  try{
    const { id } = req.params;
    const mesin = req.body.spesifikasiMesin;
    const galleries = req.body.spesifikasiMesin.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const mesinData = await models.SpesifikasiMesin.findOne({
      where: { id: speCar.spesifikasiMesinId } ,
      include: [{
        model: models.SpesifikasiMesinGalery,
        as: 'galleries'
      }
      ]
    });

    if (!mesinData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(mesinData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiMesinGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiMesinId'] = mesinData.id;
        await models.SpesifikasiMesinGalery.create(galeri);
      }else{
        await models.SpesifikasiMesinGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await mesinData.update(mesin)
      .then(async data => {
        return models.SpesifikasiMesin.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiMesinGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Mesin

//Performa
async function getPerforma(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiPerforma.findOne({
      where: {
        id: speCar.spesifikasiPerformaId
      },
      include: [{
        model: models.SpesifikasiPerformaGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addPerforma(req, res, auth = false){
  try{
    const Performa = req.body;
    return models.SpesifikasiPerforma.create(
      Performa,
      {
        include: [
          {
            model: models.SpesifikasiPerformaGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editPerforma(req, res, auth = false){
  try{
    const { id } = req.params;
    const performa = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const performaData = await models.SpesifikasiPerforma.findOne({
      where: { id: speCar.spesifikasiPerformaId } ,
      include: [{
        model: models.SpesifikasiPerformaGalery,
        as: 'galleries'
      }
      ]
    });

    if (!performaData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(performaData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiPerformaGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiPerformaId'] = performaData.id;
        await models.SpesifikasiPerformaGalery.create(galeri);
      }else{
        await models.SpesifikasiPerformaGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await performaData.update(performa)
      .then(async data => {
        return models.SpesifikasiPerforma.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiPerformaGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditPerforma(req, res, auth = false){
  try{
    const { id } = req.params;
    const performa = req.body.spesifikasiPerforma;
    const galleries = req.body.spesifikasiPerforma.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const performaData = await models.SpesifikasiPerforma.findOne({
      where: { id: speCar.spesifikasiPerformaId } ,
      include: [{
        model: models.SpesifikasiPerformaGalery,
        as: 'galleries'
      }
      ]
    });

    if (!performaData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(performaData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiPerformaGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiPerformaId'] = performaData.id;
        await models.SpesifikasiPerformaGalery.create(galeri);
      }else{
        await models.SpesifikasiPerformaGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await performaData.update(performa)
      .then(async data => {
        return models.SpesifikasiPerforma.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiPerformaGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Performa

//Dimensi
async function getDimensi(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiDimensi.findOne({
      where: {
        id: speCar.spesifikasiDimensiId
      },
      include: [{
        model: models.SpesifikasiDimensiGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addDimensi(req, res, auth = false){
  try{
    const dimensi = req.body;
    return models.SpesifikasiDimensi.create(
      dimensi,
      {
        include: [
          {
            model: models.SpesifikasiDimensiGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editDimensi(req, res, auth = false){
  try{
    const { id } = req.params;
    const dimensi = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const dimensiData = await models.SpesifikasiDimensi.findOne({
      where: { id: speCar.spesifikasiDimensiId } ,
      include: [{
        model: models.SpesifikasiDimensiGalery,
        as: 'galleries'
      }
      ]
    });

    if (!dimensiData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(dimensiData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiDimensiGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiDimensiId'] = dimensiData.id;
        await models.SpesifikasiDimensiGalery.create(galeri);
      }else{
        await models.SpesifikasiDimensiGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await dimensiData.update(dimensi)
      .then(async data => {
        return models.SpesifikasiDimensi.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiDimensiGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditDimensi(req, res, auth = false){
  try{
    const { id } = req.params;
    const dimensi = req.body.spesifikasiDimensi;
    const galleries = req.body.spesifikasiDimensi.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const dimensiData = await models.SpesifikasiDimensi.findOne({
      where: { id: speCar.spesifikasiDimensiId } ,
      include: [{
        model: models.SpesifikasiDimensiGalery,
        as: 'galleries'
      }
      ]
    });

    if (!dimensiData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(dimensiData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiDimensiGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiDimensiId'] = dimensiData.id;
        await models.SpesifikasiDimensiGalery.create(galeri);
      }else{
        await models.SpesifikasiDimensiGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await dimensiData.update(dimensi)
      .then(async data => {
        return models.SpesifikasiDimensi.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiDimensiGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Dimensi

//Safety
async function getSafety(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiSafety.findOne({
      where: {
        id: speCar.spesifikasiSafetyId
      },
      include: [{
        model: models.SpesifikasiSafetyGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addSafety(req, res, auth = false){
  try{
    const Safety = req.body;
    return models.SpesifikasiSafety.create(
      Safety,
      {
        include: [
          {
            model: models.SpesifikasiSafetyGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editSafety(req, res, auth = false){
  try{
    const { id } = req.params;
    const safety = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const safetyData = await models.SpesifikasiSafety.findOne({
      where: { id: speCar.spesifikasiSafetyId } ,
      include: [{
        model: models.SpesifikasiSafetyGalery,
        as: 'galleries'
      }
      ]
    });

    if (!safetyData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(safetyData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiSafetyGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiSafetyId'] = safetyData.id;
        await models.SpesifikasiSafetyGalery.create(galeri);
      }else{
        await models.SpesifikasiSafetyGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await safetyData.update(safety)
      .then(async data => {
        return models.SpesifikasiSafety.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiSafetyGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditSafety(req, res, auth = false){
  try{
    const { id } = req.params;
    const safety = req.body.spesifikasiSafety;
    const galleries = req.body.spesifikasiSafety.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const safetyData = await models.SpesifikasiSafety.findOne({
      where: { id: speCar.spesifikasiSafetyId } ,
      include: [{
        model: models.SpesifikasiSafetyGalery,
        as: 'galleries'
      }
      ]
    });

    if (!safetyData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(safetyData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiSafetyGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiSafetyId'] = safetyData.id;
        await models.SpesifikasiSafetyGalery.create(galeri);
      }else{
        await models.SpesifikasiSafetyGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await safetyData.update(safety)
      .then(async data => {
        return models.SpesifikasiSafety.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiSafetyGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Safety

//Entertainment
async function getEntertainment(req, res, auth = false){
  try{
    const { id } = req.params;
    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data not found"
    });

    return models.SpesifikasiEntertainment.findOne({
      where: {
        id: speCar.spesifikasiEntertainmentId
      },
      include: [{
        model: models.SpesifikasiEntertainmentGalery,
        as: "galleries"
      }]
    })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function addEntertainment(req, res, auth = false){
  try{
    const Entertainment = req.body;
    return models.SpesifikasiEntertainment.create(
      Entertainment,
      {
        include: [
          {
            model: models.SpesifikasiEntertainmentGalery,
            as: 'galleries'
          }
        ]
      })
      .then(async data => {
        res.json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.json({
      success: false,
      message: err.message
    });
  }
}

async function editEntertainment(req, res, auth = false){
  try{
    const { id } = req.params;
    const entertainment = req.body;
    const galleries = req.body.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const entertainmentData = await models.SpesifikasiEntertainment.findOne({
      where: { id: speCar.spesifikasiEntertainmentId } ,
      include: [{
        model: models.SpesifikasiEntertainmentGalery,
        as: 'galleries'
      }
      ]
    });

    if (!entertainmentData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(entertainmentData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiEntertainmentGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiEntertainmentId'] = entertainmentData.id;
        await models.SpesifikasiEntertainmentGalery.create(galeri);
      }else{
        await models.SpesifikasiEntertainmentGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await entertainmentData.update(entertainment)
      .then(async data => {
        return models.SpesifikasiEntertainment.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiEntertainmentGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            res.json({
              success: true,
              data
            });
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditEntertainment(req, res, auth = false){
  try{
    const { id } = req.params;
    const entertainment = req.body.spesifikasiEntertainment;
    const galleries = req.body.spesifikasiEntertainment.galleries;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        carId: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const entertainmentData = await models.SpesifikasiEntertainment.findOne({
      where: { id: speCar.spesifikasiEntertainmentId } ,
      include: [{
        model: models.SpesifikasiEntertainmentGalery,
        as: 'galleries'
      }
      ]
    });

    if (!entertainmentData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(entertainmentData.galleries, galleries);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.SpesifikasiEntertainmentGalery.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await galleries.map(async galeri => {
      if(galeri.id === null || galeri.id === ""){
        galeri['spesifikasiEntertainmentId'] = entertainmentData.id;
        await models.SpesifikasiEntertainmentGalery.create(galeri);
      }else{
        await models.SpesifikasiEntertainmentGalery.update(galeri,{
          where: {
            id: galeri.id
          }
        });
      }
    })

    return await entertainmentData.update(entertainment)
      .then(async data => {
        return models.SpesifikasiEntertainment.findOne({
          where: {
            id: data.id
          },
          include: [{
            model: models.SpesifikasiEntertainmentGalery,
            as: "galleries"
          }]
        })
          .then(async data => {
            return data;
          })
          .catch(err => {
            res.json({
              success: false,
              errors: err.message
            });
          });
      })
      .catch(err => {
        res.json({
          success: false,
          errors: err.message
        });
      });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of Entertainment

//berita
async function getBerita(req, res, auth = false){
  try{
    const { id } = req.params;

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.status(404).json({
      success: false,
      message: "data not found"
    });

    return models.Berita.findAll({
      where: {
        carSpesifikasiId: speCar.id
      }
    })
      .then(async data => {
        res.status(200).json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function addBerita(req, res, auth = false){
  try{
    const berita = req.body;
    return models.Berita.bulkCreate(berita)
      .then(async data => {
        res.status(200).json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function editBerita(req, res, auth = false){
  try{
    const { id } = req.params;
    const berita = req.body;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const beritaData = await models.Berita.findAll({
      where: { carSpesifikasiId: speCar.id }
    });

    if (!beritaData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(beritaData, berita);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.Berita.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await berita.map(async item => {
      if(item.id === null || item.id === ""){
        item['carSpesifikasiId'] = speCar.id;
        await models.Berita.create(item);
      }else{
        await models.Berita.update(item,{
          where: {
            id: item.id
          }
        });
      }
    })
    return await res.status(200).json({
      success: true,
      berita
    });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditBerita(req, res, auth = false){
  try{
    const { id } = req.params;
    const berita = req.body.berita;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const beritaData = await models.Berita.findAll({
      where: { carSpesifikasiId: speCar.id }
    });

    if (!beritaData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(beritaData, berita);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.Berita.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await berita.map(async item => {
      if(item.id === null || item.id === ""){
        item['carSpesifikasiId'] = speCar.id;
        await models.Berita.create(item);
      }else{
        await models.Berita.update(item,{
          where: {
            id: item.id
          }
        });
      }
    })

    return await res.status(200).json({
      success: true,
      berita
    });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//end of berita

//Video
async function getVideo(req, res, auth = false){
  try{
    const { id } = req.params;

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });
    if(speCar === null || speCar.length <= 0) return res.status(404).json({
      success: false,
      message: "data not found"
    });

    return models.Video.findAll({
      where: {
        carSpesifikasiId: speCar.id
      }
    })
      .then(async data => {
        res.status(200).json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function addVideo(req, res, auth = false){
  try{
    const video = req.body;
    return models.Video.bulkCreate(video)
      .then(async data => {
        res.status(200).json({
          success: true,
          data
        });
      })
      .catch(err => {
        res.status(400).json({
          success: false,
          errors: err.message
        });
      });
  }catch(err){
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function editVideo(req, res, auth = false){
  try{
    const { id } = req.params;
    const video = req.body;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const videoData = await models.Video.findAll({
      where: { carSpesifikasiId: speCar.id }
    });

    if (!videoData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(videoData, video);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.Video.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await video.map(async item => {
      if(item.id === null || item.id === ""){
        item['carSpesifikasiId'] = speCar.id;
        await models.Video.create(item);
      }else{
        await models.Video.update(item,{
          where: {
            id: item.id
          }
        });
      }
    })
    return await res.status(200).json({
      success: true,
      video
    });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}

async function privateEditVideo(req, res, auth = false){
  try{
    const { id } = req.params;
    const video = req.body.video;

    if (validator.isInt(id ? id.toString() : '') === false) {
      return res.status(400).json({
        success: false,
        errors: 'Invalid Parameter'
      });
    }

    const speCar = await models.CarSpesifikasi.findOne({
      where: {
        id: id
      }
    });

    if(speCar === null || speCar.length <= 0) return res.json({
      success: false,
      message: "data car not found"
    });

    const videoData = await models.Video.findAll({
      where: { carSpesifikasiId: speCar.id }
    });

    if (!videoData) {
      return res.status(400).json({
        success: false,
        errors: 'data dimensi not found'
      });
    }

    let listOfDelete = listChildRemove(videoData, video);
    if(listOfDelete.length > 0){
      await listOfDelete.map(async idDelete => {
        models.Video.destroy({
          where: {
            id:idDelete
          }
        })
      });
    }

    await video.map(async item => {
      if(item.id === null || item.id === ""){
        item['carSpesifikasiId'] = speCar.id;
        await models.Video.create(item);
      }else{
        await models.Video.update(item,{
          where: {
            id: item.id
          }
        });
      }
    })

    return await res.status(200).json({
      success: true,
      video
    });
  }catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
}
//End of video

function inArray(needle, haystack){
  var length = haystack.length;
  for(var i = 0; i < length; i++){
    if (haystack[i] === needle) return true;
  }
  return false;
}

function listChildRemove(oldData, newData){
  let oldIds = [];
  let newIds = [];
  let deleteIds = [];

  oldData.map(async data => {
    oldIds.push(data.id);
  });

  newData.map(async data => {
    if(data.id !== "" || data.id !== null) newIds.push(data.id);
  });

  oldIds.map(async id => {
    if(!newIds.includes(id)) deleteIds.push(id);
  });
  return deleteIds;
}

module.exports = {
  //All Include Specification
  GetCarSpecificationByCarId,
  GetCarSpecification,
  CreateAllSpecCar,
  EditAllSpecCar,
  DeleteAllSpecCar,
  //End of All
  //Dimensi
  getDimensi,
  addDimensi,
  editDimensi,
  //End of Dimensi
  //Interior
  getInterior,
  addInterior,
  editInterior,
  //End of Interior
  //Exterior
  getExterior,
  addExterior,
  editExterior,
  //End of Exterior
  //Mesin
  getMesin,
  addMesin,
  editMesin,
  //End of Mesin
  //Performa
  getPerforma,
  addPerforma,
  editPerforma,
  //End of Performa
  //Safety
  getSafety,
  addSafety,
  editSafety,
  //End of Safety
  //Entertainment
  getEntertainment,
  addEntertainment,
  editEntertainment,
  //End of Entertainment
  //berita
  getBerita,
  addBerita,
  editBerita,
  //end of berita
  //video
  getVideo,
  addVideo,
  editVideo
  //end of video
};