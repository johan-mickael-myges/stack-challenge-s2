const request = require('supertest');
const app = require('../app');

describe('Jest should be available', () => {
    it('should test that true === true', () => {
        expect(true).toBe(true);
    });
});
