function validateOrderCreate(body) {
  const errors = [];

  if (body.title !== undefined && typeof body.title !== 'string') {
    errors.push('title must be a string');
  }
  if (typeof body.title === 'string' && body.title.length > 255) {
    errors.push('title must be 255 characters or fewer');
  }
  if (body.description !== undefined && body.description !== null && typeof body.description !== 'string') {
    errors.push('description must be a string');
  }

  return errors;
}

module.exports = { validateOrderCreate };
