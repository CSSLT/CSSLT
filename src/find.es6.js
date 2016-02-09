import parser from 'postcss-selector-parser';
import NodePath from './node-path.es6.js';

/**
 * @typedef Selector
 * @name Selector
 * @desc Селектор из postcss-selector-parser
 */

/**
 * @typedef Node
 * @name Node
 * @desc Узел postcss. Правило, медиа, декларация и т.п.
 */

/**
 * Выбирает узлы, удовлетворяющие селектору
 * @param {Selector} selector
 * @param {Node} nodes
 * @returns {NodePath[]}
 */
function select(selector, nodes) {
    return selector.nodes.reduce((found, selector) => {
        if (selector.type === 'combinator') {
            return found;
        }

        return collectChildren(selector, found);
    }, nodes);
}

/**
 * Собирает все элементы, удовлетворяющие селектору, в узлах и их потомках
 * @param {Selector}
 * @param {Node[]}
 * @returns {NodePath[]}
 */
function collectChildren(selector, nodes) {
    return nodes.reduce((found, item, index) => {
        var foundAtContainer = [],
            node;

        if (item instanceof NodePath) {
            node = item.parent[item.prop];
        } else {
            node = item;
        }

        /* Если это декларация, то внутри неё мы можем найти только prop или value */
        if (node.type === 'decl') {
            if (selector.value === 'prop' || selector.value === 'value') {
                return found.concat(makePath(node, selector.value));
            }
        }

        /* Если мы ищем selector, то это свойство у rule. Внутри rule бывают другие rule, поэтому не останавливаемся */
        if (selector.value === 'selector' && node.type === 'rule') {
            foundAtContainer.push(makePath(node, selector.value));
        }

        if (match(selector, node)) {
            foundAtContainer.push(makePath(node.parent.nodes, index));
        }

        if (node.nodes && node.nodes.length) {
            foundAtContainer = foundAtContainer.concat(collectChildren(selector, node.nodes));
        }

        return found.concat(foundAtContainer);
    }, []);
}

/**
 * Проверяет, соответствует ли узел селектору
 * @param {Selector} selector
 * @param {Node} node
 * @returns {boolean}
 */
function match(selector, node) {
    if (selector.type === 'tag') {
        switch (selector.value) {
            case 'atrule':
            case 'decl':
            case 'root':
            case 'rule':
                return selector.value === node.type;
        }
    }

    return false;
}

function makePath(parent, prop) {
    return new NodePath(parent, prop);
}

export default function find(selector, ctx) {
    var nodes;

    parser(function(selector) {
        nodes = selector.nodes.reduce((found, node) => {
            return found.concat(select(node, [ ctx ]));
        }, []);
    }).process(selector.toLowerCase());

    return nodes;
}
