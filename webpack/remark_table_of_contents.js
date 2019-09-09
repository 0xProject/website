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
                title: getTitle(node.children),
            });
        },
    );

    return toc;
}

function getTitle(children) {
    let text = '';

    for (let i = 0; i < children.length; i++) {
        text += children[i].value;
    }

    return text;
}
