const errorHandler = require('~middlewares/errorHandler');

describe('errorHandler middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        next = jest.fn();
    });

    it('should return the correct status and message for operational errors', () => {
        const error = {
            isOperational: true,
            statusCode: 400,
            message: 'Operational Error'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Operational Error');
    });

    it('should return 500 status and message for non-operational errors', () => {
        const error = {
            isOperational: false,
            message: 'Non-operational Error'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Non-operational Error');
    });

    it('should return 500 status and message for errors without statusCode', () => {
        const error = {
            isOperational: true,
            message: 'Error without statusCode'
        };

        errorHandler(error, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error without statusCode');
    });
});
