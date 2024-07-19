const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const render = async (templateName, data) => {
    const templatePath = path.join(__dirname, `../templates/${templateName}.ejs`);
    const template = fs.readFileSync(templatePath, 'utf8');

    return ejs.render(template, data);
}

module.exports = render;