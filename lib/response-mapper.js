export const responseMapper = (res, status, data, message) => {
    return res.status(status).json({
        data: data || null,
        message: message || 'Operation successful',
        status: status
    });
}
