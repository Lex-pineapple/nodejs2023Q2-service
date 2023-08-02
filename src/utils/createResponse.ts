export function createResponse(message: string, statusCode: number) {
  return {
    statusCode,
    message,
  };
}
