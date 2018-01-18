var pkg = require('../package.json'),
    schema = require('../settings-schema'),
    properties = schema.properties,
    markdown = [],
    fs = require('fs');

markdown.push(`The sections below describe each ${pkg.name} setting as of version ${schema.version}.`);
markdown.push(``);

//Build configuration markdown array.
var keys = Object.keys(properties);
    keys.forEach((property,i) => {
            var setting = properties[property];
            markdown.push(`# settings.${property}`);
            markdown.push(`\`${setting.type}\``);
            markdown.push(``);
            markdown.push(`${setting.description}`);
            if (setting.type !== 'object')
                markdown.push(``);

          //Primitive types
            if (['object', 'array'].indexOf(setting.type) === -1)
                markdown.push(`**default:** ${
                    setting.default
                        ? ('`"' + setting.default + '"`')
                        : 'none'}`);
          //Arrays
            else if (setting.type === 'array') {
              //of primitive types
                if (setting.type === 'array' && ['object', 'array'].indexOf(setting.items.type) === -1)
                    markdown.push(`**default:** ${
                        setting.defaultArray
                            ? `[${setting.defaultArray.map(item => `"${item}"`).join(', ')}]`
                            : 'none'}`);
              //of objects
                else if (setting.items.type === 'object') {

                    if (setting.default) {
                        markdown.push(`**default:**`);
                        markdown.push(`\`\`\``);
                        markdown.push(`${JSON.stringify(setting.default, null, 2)}`);
                        markdown.push(`\`\`\``);
                        markdown.push(``);
                    } else
                        markdown.push(`**default:** none`);

                    var subProperties = setting.items.properties;
                    Object.keys(subProperties).forEach(subProperty => {
                        var subSetting = subProperties[subProperty];
                        markdown.push(``);
                        markdown.push(`#j# settings.${property}[].${subProperty}`);
                        markdown.push(`\`${subSetting.type}\``);
                        markdown.push(``);
                        markdown.push(`${subSetting.title}`);
                    });
                }
            }
          //Objects
            else if (setting.type === 'object') {
                var subKeys = Object.keys(setting.properties);
                    subKeys.forEach((subProperty,i) => {
                        var subSetting = setting.properties[subProperty];
                        markdown.push(``);
                        markdown.push(`## settings.${property}.${subProperty}`);
                        markdown.push(`\`${subSetting.type}\``);
                        markdown.push(``);
                        markdown.push(`${subSetting.title}`);
                        markdown.push(``);
                        markdown.push(`**default:** ${
                            subSetting.default
                                ? ('`"' + subSetting.default + '"`')
                                : 'none'}`);
                    });
            }

            if (i < keys.length - 1) {
                markdown.push(``);
                markdown.push(``);
                markdown.push(``);
            }
        });

fs.writeFile(
    './scripts/configuration.md',
    markdown.join('\n'),
    (err) => {
        if (err)
            console.log(err);
        console.log('The configuration markdown file was built!');
    });
