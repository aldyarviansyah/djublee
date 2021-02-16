module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define(
    'Video',
    {
      file: DataTypes.STRING,
      headlineVideo: DataTypes.STRING,
      linkVideo: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      carSpesifikasiId: DataTypes.INTEGER

    },
    {
      timestamps: true,
      paranoid: true
    }
  );
  Video.associate = function(models) {
    Video.belongsTo(models.CarSpesifikasi, {
      foreignKey: 'carSpesifikasiId',
      as: 'carSpesifikasi',
      onDelete: 'cascade',
      hooks: true,
    });
  };

  return Video;
};
