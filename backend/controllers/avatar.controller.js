const httpStatus = require('http-status');
const fs = require('fs');
const path = require('path');

const uploadAvatar = async (req, res) => {
  const avatarPath = `${req.file.filename}`;

  res.status(httpStatus.OK).send({ message: 'O arquivo foi enviado: ', avatarPath });
};

const deleteAvatar = async (req, res) => {
  const serverFilename = req.body.avatarPath.response ? req.body.avatarPath.response.avatarPath : req.body.avatarPath;
  const filePath = path.join(__dirname, '..', 'files', serverFilename);

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Erro ao excluir o arquivo');
    } else {
      res.status(httpStatus.OK).send('Arquivo excluído com sucesso!');
    }
  });
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
};
