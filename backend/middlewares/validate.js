import Joi from 'joi';

export const shortAlphaNumSchema = Joi.string().alphanum().min(1).max(128)
  .required();

export const shortTextSchema = Joi.string().min(1).max(128).required();

export const longTextSchema = Joi.string().min(1).required();

export const positiveNumberSchema = Joi.number().min(0).required();

export const emailSchema = Joi.string().email({ minDomainSegments: 2 }).required();

export const idSchema = Joi.number().integer().min(0).required();

export const dateSchema = Joi.date().required();

export const booleanSchema = Joi.boolean().required();
