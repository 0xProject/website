export interface MeshNodeGeoData {
    country: string;
    city: string;
    lat: number;
    long: number;
    timezone: string;
}
export interface MeshNodeStats {
    ethRPCRateLimitExpiredRequests_number: number;
    ethRPCRequestsSentInCurrentUTCDay_number: number;
    ethereumChainID_number: number;
    maxExpirationTime_string: string;
    msg: string;
    myPeerID: string;
    numOrdersIncludingRemoved_number: number;
    numOrders_number: number;
    numPeers_number: number;
    numPinnedOrders_number: number;
    pubSubTopic_string: string;
    rendezvous_string: string;
    startOfCurrentUTCDay_string: string;
    version_string: string;
}
export interface MeshNodeMetaData {
    name: string;
    peerId?: string;
    multiAddress?: string;
    ip?: string;
    geo?: MeshNodeGeoData;
    port?: string;
    meshVersion?: string;
    stats?: MeshNodeStats;
    peers: MeshNodeMetaData[];
}
export interface GraphNode {
    name: string;
    group: number;
    x?: number;
    y?: number;
    metadata: MeshNodeMetaData;
}
export interface GraphNodeData {
    nodes: GraphNode[];
    links: Array<{ source: number; target: number; value: number }>;
}
