import postcss from 'postcss';
import extract from './extract.es6.js';
import apply   from './apply.es6.js';

module.exports = postcss.plugin('csslt', () => {
    return (css, result) => {
        var csslt = extract(css);

        apply(css, csslt);

        return result;
    };
});
