import Joi from 'joi';

export const validateContact = (contact) => {
  const schema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().allow('').trim(),
    timezone: Joi.string().required(),
  });

  const { error } = schema.validate(contact);
  return !error;
};
