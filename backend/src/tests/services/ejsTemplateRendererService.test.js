const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const render = require('~services/ejsTemplateRendererService');

jest.mock('fs');
jest.mock('ejs');

describe('render', () => {
    const templateName = 'testTemplate';
    const data = { name: 'Test' };
    const templateContent = '<h1><%= name %></h1>';
    const renderedContent = '<h1>Test</h1>';

    beforeAll(() => {
        const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
        fs.readFileSync.mockReturnValue(templateContent);
        ejs.render.mockReturnValue(renderedContent);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the template with provided data', async () => {
        const result = await render(templateName, data);

        const templatePath = path.join(__dirname, `../../templates/${templateName}.ejs`);
        expect(fs.readFileSync).toHaveBeenCalledWith(templatePath, 'utf8');
        expect(ejs.render).toHaveBeenCalledWith(templateContent, data);
        expect(result).toBe(renderedContent);
    });

    it('should throw an error if the template file cannot be read', async () => {
        fs.readFileSync.mockImplementationOnce(() => {
            throw new Error('File read error');
        });

        await expect(render(templateName, data)).rejects.toThrow('File read error');
    });

    it('should throw an error if the template rendering fails', async () => {
        ejs.render.mockImplementationOnce(() => {
            throw new Error('Render error');
        });

        await expect(render(templateName, data)).rejects.toThrow('Render error');
    });
});
