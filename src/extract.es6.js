import postcss from 'postcss';

const CSSLT = 'csslt';

export default function extract(css) {
    var cssltAst = postcss.root();

    css.walkAtRules(CSSLT, media => {
        cssltAst.append(media.nodes);
        media.remove();
    });

    return cssltAst;
}
