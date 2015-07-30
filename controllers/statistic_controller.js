var models = require('../models/models.js');

var statistics = {
  quizes: 0,
  comments: 0,
  commentsUnpublished: 0,
  commentedQuizes: 0,
  commentsUncomented: 0
};

var errors = [];


exports.calculate = function(req, res, next) {
  models.Quiz.count()
   // preguntas
    .then(function(numQuizes) {
      statistics.quizes = numQuizes;
      return models.Comment.count();
    })
    // comentarios
    .then(function(numComments) {
      statistics.comments = numComments;
      return models.Comment.countUnpublished();
    })
    // comentarios sin publicar
    .then(function(numUnpublished) {
      statistics.commentsUnpublished = numUnpublished;
      return models.Comment.countCommentedQuizes();
    })
    // preguntas con comentario
    .then(function(numCommented) {
      statistics.commentedQuizes = numCommented;
      return models.CountUnCommentedQuizes();
    })
    .catch(function(err) {
      errors.push(err);
    })
    .finally(function() {
      next();
    });
};


exports.show = function(req, res) {
  res.render('statistics/statistics.ejs', {
    statistics: statistics,
    errors: []
  })
};
