const request = require('supertest');
const app = require('../../app');
const userService = require('../../services/userService');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const checkToken = require('../../middlewares/authMiddleware');
const UnauthorizedError = require('../../errors/UnauthorizedError');

jest.mock('jsonwebtoken');
jest.mock('~services/userService');

jest.mock('express-validator', () => {
    const originalModule = jest.requireActual('express-validator');
    return {
        ...originalModule,
        validationResult: jest.fn(),
    };
});

describe('Auth Controller', () => {
    beforeAll(() => {

    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    describe('GET /check', () => {
        it('should respond with 200 if token is valid', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { });
            });

            const response = await request(app)
                    .get('/auth/check')
                    .set('Cookie', ['token=valid-token']);

            expect(response.statusCode).toBe(200);
            expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String), expect.any(Function));
        });

        it('should respond with 401 if token is invalid', async () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new UnauthorizedError(), null);
            });

            const response = await request(app)
                    .get('/auth/check')
                    .set('Cookie', ['token=invalid-token']);

            expect(response.statusCode).toBe(401);
            expect(response.error.text).toBe('Unauthorized');
            expect(jwt.verify).toHaveBeenCalledWith('invalid-token', expect.any(String), expect.any(Function));
        });
    });

    describe('POST /auth/login', () => {
        it('should respond with 400 if validation fails', async () => {
            validationResult.mockReturnValue({ isEmpty: () => false });

            const response = await request(app).post('/auth/login').send({ email: '', password: '' });

            expect(response.statusCode).toBe(400);
            expect(response.error.text).toBe('Bad Request');
        });

        it('should login a user and set a token cookie', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true });

            const mockUser = { id: 1, email: 'test@example.com' };
            const mockToken = 'mockToken';
            userService.loginUser.mockResolvedValue({ user: mockUser, token: mockToken });

            const response = await request(app)
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password: 'password' });

            expect(response.statusCode).toBe(200);
            expect(response.body.user).toEqual(mockUser);
            expect(response.body.token).toEqual(mockToken);
            expect(response.headers['set-cookie'][0]).toMatch(/token=mockToken/);
        });

        it('should respond with 500 if there is an error during login', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true });

            userService.loginUser.mockRejectedValue(new Error('Login Error'));

            const response = await request(app)
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password: 'password' });

            expect(response.statusCode).toBe(500);
            expect(response.error.text).toBe('Login Error');
        });
    });

    describe('POST /auth/register', () => {
        it('should respond with 400 if validation fails', async () => {
            validationResult.mockReturnValue({
                isEmpty: () => false,
                array: () => ['Validation error']
            });

            const response = await request(app).post('/auth/register').send({});

            expect(response.statusCode).toBe(400);
            expect(response.error.text).toBe('[\"Validation error\"]');
        });

        it('should register a new user and respond with 201', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true });

            const mockUser = {
                id: 1,
                email: 'test@example.com',
                username: 'testuser',
                firstname: 'Test',
                lastname: 'User',
                number: '1234567890',
            };
            userService.registerUser.mockResolvedValue(mockUser);

            const response = await request(app)
                    .post('/auth/register')
                    .send({});

            expect(response.statusCode).toBe(201);
            expect(response.body).toEqual(mockUser);
        });

        it('should respond with 500 if there is an error during registration', async () => {
            validationResult.mockReturnValue({ isEmpty: () => true });

            userService.registerUser.mockRejectedValue(new Error('Registration error'));

            const response = await request(app)
                    .post('/auth/register')
                    .send({});

            expect(response.statusCode).toBe(500);
            expect(response.error.text).toBe('Registration error');
        });
    });

    describe('POST /auth/logout', () => {
        it('should clear the token cookie and respond with 200', async () => {
            const response = await request(app)
                    .post('/auth/logout')
                    .set('Cookie', 'token=valid-token');

            expect(response.statusCode).toBe(200);
            expect(response.headers['set-cookie'][0]).toMatch(/token=;/);
        });
    });

    // describe('DELETE /auth/delete', () => {
    //     it('should delete a user and respond with 204', async () => {
    //         const mockUserId = 1;
    //         const mockPassword = 'password';
            
    //         userService.deleteUser.mockResolvedValue({ message: 'User deleted' });
    
    //         const response = await request(app)
    //                 .delete('/auth/delete')
    //                 .set('Cookie', 'token=valid-token')
    //                 .send({ password: mockPassword });
    
    //         expect(response.statusCode).toBe(204);
    //         expect(userService.deleteUser).toHaveBeenCalledWith(mockUserId, mockPassword);
    //     });
    
    //     it('should respond with 500 if there is an error during deletion', async () => {
    //         const mockUserId = 1;
    //         const mockPassword = 'password';
            
    //         userService.deleteUser.mockRejectedValue(new Error('Deletion error'));
    
    //         const response = await request(app)
    //                 .delete('/auth/delete')
    //                 .set('Cookie', 'token=valid-token')
    //                 .send({ password: mockPassword });
    
    //         expect(response.statusCode).toBe(500);
    //         expect(response.error.text).toBe('Deletion error');
    //     });
    // });
    
});