import ValidationError, {
  ErrorCode,
} from '../../../../src/openapi-validator/classes/errors/ValidationError';

describe('ValidationError', () => {
  it('should set code and message', () => {
    const err = new ValidationError(ErrorCode.InvalidBody, 'Invalid body');
    expect(err.code).toBe(ErrorCode.InvalidBody);
    expect(err.message).toBe('Invalid body');
  });

  it('should default message to empty string if not provided', () => {
    const err = new ValidationError(ErrorCode.StatusNotFound);
    expect(err.message).toBe('');
  });

  it('toString returns the message', () => {
    const err = new ValidationError(ErrorCode.PathNotFound, 'Path not found');
    expect(err.toString()).toBe('Path not found');
  });
});
