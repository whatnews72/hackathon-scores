const Joi = require('joi');

const teamSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': '팀 이름은 필수입니다.',
    'any.required': '팀 이름은 필수입니다.',
  }),
  members: Joi.array().items(Joi.string()).default([]),
});

const judgeSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': '심사위원 이름은 필수입니다.',
    'any.required': '심사위원 이름은 필수입니다.',
  }),
  category: Joi.string().default(''),
});

const scoreSchema = Joi.object({
  teamId: Joi.number().required().messages({
    'number.base': '팀 ID는 숫자여야 합니다.',
    'any.required': '팀 ID는 필수입니다.',
  }),
  judgeId: Joi.number().required().messages({
    'number.base': '심사위원 ID는 숫자여야 합니다.',
    'any.required': '심사위원 ID는 필수입니다.',
  }),
  score: Joi.number().min(0).max(100).required().messages({
    'number.base': '점수는 숫자여야 합니다.',
    'number.min': '점수는 0 이상이어야 합니다.',
    'number.max': '점수는 100 이하여야 합니다.',
    'any.required': '점수는 필수입니다.',
  }),
  comment: Joi.string().allow('').default(''),
});

const validateTeam = (data) => {
  return teamSchema.validate(data, { abortEarly: false });
};

const validateJudge = (data) => {
  return judgeSchema.validate(data, { abortEarly: false });
};

const validateScore = (data) => {
  return scoreSchema.validate(data, { abortEarly: false });
};

module.exports = {
  validateTeam,
  validateJudge,
  validateScore,
};
