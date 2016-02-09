import postcss from 'postcss';
import extract from './extract.es6.js';
import apply   from './apply.es6.js';
import find    from './find.es6.js';

module.exports = postcss.plugin('csslt', () => {
    return (css, result) => {
        var csslt = extract(css);

        csslt.walkRules(rule => {
            const found = find(rule.selector, css);

            rule.walkDecls(decl => {
                found.forEach(node => apply(node, decl));
            });
        });

        return result;
    };
});
