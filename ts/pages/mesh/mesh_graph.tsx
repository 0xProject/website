import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

import { GraphNodeData, MeshNodeMetaData } from './types';

const parseMeshData = (data: any): GraphNodeData => {
    const meshNodes = data.meshNodes.filter((m: any) => {
        return Object.keys(m.peers).length !== 0;
    });
    const nodes = meshNodes.map((m: any) => {
        const node = { name: m.name, group: 0, metadata: m };
        return node;
    });
    const links = [];
    for (let i = 0; i < nodes.length - 1; i++) {
        for (let y = 0; y < nodes.length; y++) {
            const link = { source: i, target: y, value: 1 };
            links.push(link);
        }
    }
    return { nodes, links };
};

interface MeshGraphProps {
    meshSnapshot: { meshNodes: MeshNodeMetaData[] };
    showNodeDetails: (data: MeshNodeMetaData) => void;
}

export const MeshGraph: React.FC<MeshGraphProps> = ({ meshSnapshot, showNodeDetails }) => {
    const ref = useRef(null);
    const [isRendered, setRendered] = useState(false);
    useEffect(() => {
        if (meshSnapshot && ref.current && !isRendered) {
            const width = 350;
            const height = 350;
            const data: GraphNodeData =
                meshSnapshot !== undefined ? parseMeshData(meshSnapshot) : { nodes: [], links: [] };
            const force = d3
                .forceSimulation()
                .nodes(data.nodes)
                .force('charge', d3.forceManyBody().strength(-220))
                .force('link', d3.forceLink(data.links).distance(150))
                .force('center', d3.forceCenter(width / 2, height / 2));

            const svg = d3
                .select(ref.current)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            const link = svg
                .selectAll('line')
                .data(data.links)
                .enter()
                .append('line')
                .style('stroke', '#999999')
                .style('stroke-opacity', 0.6)
                .style('stroke-width', (d: any) => Math.sqrt(d.value));

            const dragStarted = (d: any) => {
                !d3.event.active && force.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            };

            const dragged = (d: any) => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            };

            const dragEnded = (d: any) => {
                !d3.event.active && force.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            };

            const clicked = (d: any) => {
                showNodeDetails(d.metadata);
            };

            const node = svg
                .selectAll('circle')
                .data(data.nodes)
                .enter()
                .append<SVGCircleElement>('circle')
                .attr('r', 6)
                .style('stroke', '#fff')
                .style('stroke-width', 1.0)
                .style('fill', '#00AE99')
                .on('click', clicked)
                .call(
                    d3
                        .drag()
                        .on('start', dragStarted)
                        .on('drag', dragged)
                        .on('end', dragEnded),
                );

            setRendered(true);
            force.on('tick', () => {
                link.attr('x1', (d: any) => d.source.x)
                    .attr('y1', (d: any) => d.source.y)
                    .attr('x2', (d: any) => d.target.x)
                    .attr('y2', (d: any) => d.target.y);

                node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
            }),
                [data, height, width];
        }
    });
    return <div ref={ref} />;
};
