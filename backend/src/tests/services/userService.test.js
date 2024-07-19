const { registerUser } = require('~services/userService');
const { User, Role } = require('~models');
const { ROLE_USER } = require('~constants/roles');
const BadRequestError = require('~errors/BadRequestError');
const sendMail = require('~services/mailerService');
const config = require('~config/config');

jest.mock('~models');
jest.mock('~services/mailerService');

jest.mock('~config/config', () => ({
    ...jest.requireActual('~config/config'),
    frontendUrl: 'https://layalin.com',
}));

describe('UserService - registerUser', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should register a new user successfully', async () => {
        const mockUserData = {
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser',
            firstname: 'Test',
            lastname: 'User',
            number: '1234567890',
        };

        const mockUser = {
            ...mockUserData,
            id: 1,
            addRole: jest.fn(),
        };

        const mockRole = { id: ROLE_USER };

        User.findOne.mockResolvedValueOnce(null); // No existing user
        User.create.mockResolvedValueOnce(mockUser); // New user creation
        Role.findOne.mockResolvedValueOnce(mockRole); // Role lookup

        const result = await registerUser(mockUserData);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
        expect(User.create).toHaveBeenCalledWith(mockUserData);
        expect(Role.findOne).toHaveBeenCalledWith({ where: { id: ROLE_USER } });
        expect(mockUser.addRole).toHaveBeenCalledWith(mockRole);

        expect(sendMail).toHaveBeenCalledWith(mockUserData.email, 'Bienvenue', 'welcome-user', {
            user: mockUser,
            loginUrl: `https://layalin.com/login`,
        });

        expect(result).toEqual(mockUser);
    });

    it('should throw an error if the user already exists', async () => {
        const mockUserData = {
            email: 'test@example.com',
            password: 'password123',
            username: 'testuser',
            firstname: 'Test',
            lastname: 'User',
            number: '1234567890',
        };

        User.findOne.mockResolvedValueOnce(mockUserData); // Simulate existing user

        await expect(registerUser(mockUserData)).rejects.toThrow(BadRequestError);
        expect(User.findOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
        expect(User.create).not.toHaveBeenCalled();
    });
});
