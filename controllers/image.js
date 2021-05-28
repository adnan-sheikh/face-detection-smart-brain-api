const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: 'apikey',
});

const handleApiCall = (req, res) => {
  app.models
    .initModel({
      id: Clarifai.FACE_DETECT_MODEL,
      version: '45fb9a671625463fa646c3523a3087d5',
    })
    .then((faceModel) => {
      return faceModel.predict(req.body.input);
    })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      if (entries.length) {
        res.json(entries[0]);
      } else {
        res.status(404).json('user not found');
      }
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports.handleImage = handleImage;
module.exports.handleApiCall = handleApiCall;
