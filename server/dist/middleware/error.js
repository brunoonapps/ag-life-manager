import { ZodError } from 'zod';
export const errorHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: 'VALIDATION_ERROR',
            details: err.flatten().fieldErrors,
        });
    }
    console.error(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
