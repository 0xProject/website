import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { NodeDetails, NodeStats } from 'ts/pages/mesh/mesh_node_stats';

import { configs } from 'ts/utils/configs';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { formatNumber } from 'ts/utils/format_number';

interface MeshNode {
    name: string;
    peerId: string;
    multiAddress: string;
    geo: {
        [key: string]: number | string;
    };
    port: string;
    meshVersion: string;
    peers: {
        [key: string]: any;
    };
}

interface Snapshot {
    meshNodes: MeshNode[];
}

const PLACEHOLDER = '-';

const meshSnapshotBaseUrl = 'https://viz.mesh.0x.org';
const meshSnapshotPath = '/snapshot';

// NOTE: set to Production URL to get correct data in development
const ordersBaseUrl = configs.API_BASE_PROD_URL;
const ordersPath = '/sra/orders';

const fetchMeshSnapshot = async () => fetchUtils.requestAsync(meshSnapshotBaseUrl, meshSnapshotPath);
const fetchOrders = async () => fetchUtils.requestAsync(ordersBaseUrl, ordersPath);

export const MeshStats: React.FC = () => {
    const [meshData, setMeshData] = useState<{ numActiveNodes: number; numEdges: number }>();
    const [orders, setOrders] = useState();

    const [nodeDetails, setNodeDetails] = useState<{ data?: NodeDetails; isVisible: boolean }>({
        data: undefined,
        isVisible: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [meshSnapshotData, ordersData] = await Promise.all([fetchMeshSnapshot(), fetchOrders()]);

            setMeshData(parseMeshSnapshot(meshSnapshotData));
            setOrders(ordersData);
        };

        // tslint:disable-next-line:no-floating-promises
        fetchData();
    }, []);

    // Question: what to do with Snapshot interface?
    const parseMeshSnapshot = (meshSnapshot: Snapshot) => {
        if (!meshSnapshot) {
            return { numActiveNodes: 0, numEdges: 0 };
        }

        const numActiveNodes = meshSnapshot.meshNodes.filter(node => Object.keys(node.peers).length > 0).length;
        const numEdges = (numActiveNodes * (numActiveNodes - 1)) / 2;

        return {
            numActiveNodes,
            numEdges,
        };
    };

    const getActiveNodes = () => {
        return meshData ? formatNumber(meshData.numActiveNodes).formatted : PLACEHOLDER;
    };

    const getConnections = () => {
        return meshData ? formatNumber(meshData.numEdges).formatted : PLACEHOLDER;
    };

    const getOpenOrders = () => {
        return orders ? formatNumber(orders.total).formatted : PLACEHOLDER;
    };

    // tslint:disable-next-line:no-unused-variable
    const showNodeDetails = (data: NodeDetails) => {
        setNodeDetails({ data, isVisible: true });
    };

    return (
        <Container>
            <GraphContainer>{/* TODO: implement interactive graph  */}</GraphContainer>

            <StatisticContainer>
                <Statistic title="active nodes" value={getActiveNodes()} />
                <Statistic title="connections" value={getConnections()} />
                <Statistic title="open orders" value={getOpenOrders()} />
            </StatisticContainer>

            <NodeStatsContainer>
                <NodeStats {...nodeDetails} />
            </NodeStatsContainer>
        </Container>
    );
};

const Statistic: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
    <StatisticWrapper>
        <header>{title}</header>
        <span>{value}</span>
    </StatisticWrapper>
);

const Container = styled.div`
    position: relative;
    width: 100%;

    @media (max-width: 768px) {
        margin-top: 60px;
    }
`;

const GraphContainer = styled.div`
    max-width: 350px;
    margin-bottom: 40px;

    /* Temporary until content is implemented*/
    height: 350px;
    margin-left: auto;

    background-color: #efefef;
`;

const NodeStatsContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
`;

const StatisticContainer = styled.ul`
    display: flex;
    flex-direction: row;
`;

const StatisticWrapper = styled.li`
    padding: 0 6px;
    flex-basis: 33%;

    &:not(:last-child) {
        border-right: 1px solid rgba(162, 245, 235, 0.3);
    }

    & header {
        font-weight: 300;
        font-size: 14px;
        line-height: 20px;

        margin-bottom: 13px;
    }

    & span {
        font-size: 20px;
        line-height: 30px;
        font-feature-settings: 'tnum' on, 'lnum' on;
    }

    @media (min-width: 768px) {
        padding: 0 40px;

        & header {
            font-size: 17px;
            line-height: 23px;
        }

        & span {
            font-size: 28px;
            line-height: 38px;
        }
    }
`;
