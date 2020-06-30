import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { NodeStats, NodeDetails } from 'ts/pages/mesh/mesh_node_stats';

import { configs } from 'ts/utils/configs';
import { fetchUtils } from 'ts/utils/fetch_utils';
import { formatNumber } from 'ts/utils/format_number';

const PLACEHOLDER = '-';

const meshSnapshotBaseUrl = 'https://viz.mesh.0x.org';
const meshSnapshotPath = '/snapshot';

// NOTE: set to Production URL to get correct data in development
const ordersBaseUrl = configs.API_BASE_PROD_URL;
const ordersPath = '/sra/orders';

const fetchMeshSnapshot = () => fetchUtils.requestAsync(meshSnapshotBaseUrl, meshSnapshotPath);
const fetchOrders = () => fetchUtils.requestAsync(ordersBaseUrl, ordersPath);

export const MeshStats: React.FC = () => {
    const [meshData, setMeshData] = useState<{ numActiveNodes: number; numEdges: number }>();
    const [orders, setOrders] = useState();

    const [nodeDetails, setNodeDetails] = useState<{ data?: NodeDetails; isVisible: boolean }>({
        data: undefined,
        isVisible: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            const [meshSnapshot, orders] = await Promise.all([fetchMeshSnapshot(), fetchOrders()]);
            const meshData = parseMeshSnapshot(meshSnapshot);

            setMeshData(meshData);
            setOrders(orders);
        };

        fetchData();
    }, []);

    const parseMeshSnapshot = meshSnapshot => {
        if (!meshSnapshot) return { numActiveNodes: 0, numEdges: 0 };

        const numActiveNodes = meshSnapshot.meshNodes.filter(node => Object.keys(node.peers).length > 0).length;
        const numEdges = (numActiveNodes * (numActiveNodes - 1)) / 2;

        return {
            numActiveNodes,
            numEdges,
        };
    };

    const getActiveNodes = () => {
        if (!meshData) return PLACEHOLDER;
        return formatNumber(meshData.numActiveNodes).formatted;
    };

    const getConnections = () => {
        if (!meshData) return PLACEHOLDER;
        return formatNumber(meshData.numEdges).formatted;
    };

    const getOpenOrders = () => {
        if (!orders) return PLACEHOLDER;
        return formatNumber(orders.total).formatted;
    };

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

            <NodeStats {...nodeDetails} />
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
    width: 100%;
    margin-bottom: 40px;

    /* Temporary until content is implemented*/
    padding-bottom: 100%;

    background-color: #efefef;
`;

const StatisticContainer = styled.ul`
    display: flex;
    flex-direction: row;
`;

const StatisticWrapper = styled.li`
    padding: 0 40px;
    flex-basis: 33%;

    &:not(:last-child) {
        border-right: 1px solid rgba(162, 245, 235, 0.3);
    }

    & header {
        font-weight: 300;
        font-size: 17px;
        line-height: 23px;

        margin-bottom: 13px;
    }

    & span {
        font-size: 28px;
        line-height: 38px;
        font-feature-settings: 'tnum' on, 'lnum' on;
    }
`;
