import * as d3 from 'd3';
import React, { useEffect, useRef, useState } from 'react';

import { GraphNode, GraphNodeData, MeshNodeMetaData } from './types';

const parseMeshData = (data: { meshNodes: MeshNodeMetaData[] }): GraphNodeData => {
    const meshNodes = data.meshNodes
        .filter(m => {
            return Object.keys(m.peers).length > 0;
        })
        .sort((a, b) => {
            return Object.keys(b.peers).length - Object.keys(a.peers).length;
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
    useEffect(
        () => {
            if (meshSnapshot && ref.current && !isRendered) {
                const width = 350;
                const height = 350;
                const data: GraphNodeData =
                    meshSnapshot !== undefined ? parseMeshData(meshSnapshot) : { nodes: [], links: [] };

                const force = d3
                    .forceSimulation()
                    .nodes(data.nodes)
                    .force('x', d3.forceX(width / 2).strength(0.05))
                    .force('y', d3.forceY(height / 2).strength(0.05))
                    .force('charge', d3.forceManyBody().strength(-220))
                    .force('link', d3.forceLink(data.links).distance(150))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                const svg = d3
                    .select(ref.current)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('viewBox', `0 0 ${width} ${height}`);

                const link = svg
                    .selectAll('line')
                    .data(data.links)
                    .enter()
                    .append('line')
                    .style('stroke', '#999999')
                    .style('stroke-opacity', 0.6)
                    .style('stroke-width', (d: any) => Math.sqrt(d.value));

                const dragStarted = (d: any) => {
                    // tslint:disable-next-line:no-unused-expression
                    !d3.event.active && force.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                };

                const dragged = (d: any) => {
                    d.fx = d3.event.x;
                    d.fy = d3.event.y;
                };

                const dragEnded = (d: any) => {
                    // tslint:disable-next-line:no-unused-expression
                    !d3.event.active && force.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                };

                const pulsate = (selection: d3.Selection<SVGCircleElement, GraphNode, SVGSVGElement, any>) => {
                    recursive_transitions();

                    function recursive_transitions(): void {
                        selection
                            .transition()
                            .duration(500)
                            .attr('stroke-width', 2)
                            .attr('r', 8)
                            .ease(d3.easeSinIn)
                            .transition()
                            .duration(500)
                            .attr('stroke-width', 3)
                            .attr('r', 12)
                            .ease(d3.easeSinIn)
                            .on('end', recursive_transitions);
                    }
                };

                const stopPulsate = (selection: d3.Selection<SVGElement, any, SVGElement, any>) => {
                    selection
                        .transition()
                        .duration(200)
                        .attr('r', 6)
                        // tslint:disable-next-line:number-literal-format
                        .attr('stroke-width', 1.0);
                };

                const node = svg
                    .selectAll('circle')
                    .data(data.nodes)
                    .enter()
                    .append<SVGCircleElement>('circle')
                    .attr('r', 6)
                    .style('stroke', '#fff')
                    // tslint:disable-next-line:number-literal-format
                    .style('stroke-width', 1.0)
                    .style('fill', '#00AE99')
                    .on('click', function(d: GraphNode): void {
                        stopPulsate(svg.selectAll('circle'));
                        const selected_circles: d3.Selection<
                            SVGCircleElement,
                            GraphNode,
                            SVGSVGElement,
                            undefined
                            // tslint:disable-next-line:no-invalid-this
                        > = d3.select(this);
                        pulsate(selected_circles);
                        showNodeDetails(d.metadata);
                    })
                    .call(
                        d3
                            .drag<SVGCircleElement, any>()
                            .on('start', dragStarted)
                            .on('drag', dragged)
                            .on('end', dragEnded),
                    );

                force.on('tick', () => {
                    link.attr('x1', (d: any) => d.source.x)
                        .attr('y1', (d: any) => d.source.y)
                        .attr('x2', (d: any) => d.target.x)
                        .attr('y2', (d: any) => d.target.y);

                    node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);
                });
                setRendered(true);
                const firstElementSelection = svg
                    .selectAll<SVGCircleElement, GraphNode>('circle')
                    .filter((_, i) => i === 0)
                    .each(d => {
                        showNodeDetails(d.metadata);
                    });
                pulsate(firstElementSelection);
            }
        },
        [meshSnapshot],
    );
    return <div ref={ref} />;
};
