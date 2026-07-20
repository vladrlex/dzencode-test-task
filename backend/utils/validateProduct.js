const VALID_SYMBOLS = ['USD', 'UAH'];

function validatePrices(price) {
  if (price === undefined) return [];
  if (!Array.isArray(price)) return ['price must be an array'];

  const errors = [];
  price.forEach((p, index) => {
    if (typeof p.value !== 'number' || Number.isNaN(p.value) || p.value < 0) {
      errors.push(`price[${index}].value must be a non-negative number`);
    }
    if (!VALID_SYMBOLS.includes(p.symbol)) {
      errors.push(`price[${index}].symbol must be one of ${VALID_SYMBOLS.join(', ')}`);
    }
  });
  return errors;
}

function validateProductCreate(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string') {
    errors.push('title is required');
  }
  if (!body.type || typeof body.type !== 'string') {
    errors.push('type is required');
  }
  if (body.serialNumber === undefined || body.serialNumber === null || Number.isNaN(Number(body.serialNumber))) {
    errors.push('serialNumber is required and must be a number');
  }
  if (!body.order || Number.isNaN(parseInt(body.order, 10))) {
    errors.push('order is required and must reference an existing order');
  }

  errors.push(...validatePrices(body.price));

  return errors;
}

function validateProductUpdate(body) {
  const errors = [];

  if (body.title !== undefined && (!body.title || typeof body.title !== 'string')) {
    errors.push('title must be a non-empty string');
  }
  if (body.type !== undefined && (!body.type || typeof body.type !== 'string')) {
    errors.push('type must be a non-empty string');
  }
  if (body.serialNumber !== undefined && Number.isNaN(Number(body.serialNumber))) {
    errors.push('serialNumber must be a number');
  }
  if (body.order !== undefined && Number.isNaN(parseInt(body.order, 10))) {
    errors.push('order must be a valid order id');
  }

  errors.push(...validatePrices(body.price));

  return errors;
}

module.exports = { validateProductCreate, validateProductUpdate };
