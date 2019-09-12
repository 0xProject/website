const visit = require('unist-util-visit-parents');

const MAX_HEADING_DEPTH = 3;

module.exports = transform;

function transform(tree) {
    const toc = [];

    visit(
        tree,
        node => node.type === 'heading' && node.depth <= MAX_HEADING_DEPTH,
        node => {
            toc.push({
                id: node.data.id,
                level: node.depth,
                title: getText(node),
            });
        },
    );

    return toc;
}

function getText(node) {
    let nodes = [];

    findTextNodes(node, nodes);

    return nodes.join('');
}

function findTextNodes(parent, nodes) {
    for (let i = 0; i < parent.children.length; i++) {
        if (parent.children[i].value) {
            nodes.push(parent.children[i].value);
        } else {
            if (parent.children[i].children.length) {
                findTextNodes(parent.children[i], nodes);
            }
        }
    }
}
