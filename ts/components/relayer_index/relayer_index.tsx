import * as _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import { GridList } from 'material-ui/GridList';
import * as React from 'react';

import { RelayerGridTile, RelayerGridTileStyle } from 'ts/components/relayer_index/relayer_grid_tile';
import { Retry } from 'ts/components/ui/retry';
import { ScreenWidths, WebsiteBackendRelayerInfo } from 'ts/types';
import { backendClient } from 'ts/utils/backend_client';
import { utils } from 'ts/utils/utils';

export enum RelayerIndexCellStyle {
    Expanded = 0,
    Minimized,
}

export interface RelayerIndexProps {
    networkId: number;
    screenWidth: ScreenWidths;
    cellStyle: RelayerIndexCellStyle;
}

interface RelayerIndexState {
    relayerInfos?: WebsiteBackendRelayerInfo[];
    error?: Error;
}

const CELL_HEIGHT_EXPANDED = 290;
const CELL_HEIGHT_MINIMIZED = 225;
const NUMBER_OF_COLUMNS_LARGE = 3;
const NUMBER_OF_COLUMNS_MEDIUM = 2;
const NUMBER_OF_COLUMNS_SMALL = 2;
const GRID_PADDING = 20;

export class RelayerIndex extends React.Component<RelayerIndexProps, RelayerIndexState> {
    private _isUnmounted: boolean;
    constructor(props: RelayerIndexProps) {
        super(props);
        this._isUnmounted = false;
        this.state = {
            relayerInfos: undefined,
            error: undefined,
        };
    }
    public componentWillMount(): void {
        // tslint:disable-next-line:no-floating-promises
        this._fetchRelayerInfosAsync();
    }
    public componentWillUnmount(): void {
        this._isUnmounted = true;
    }
    public render(): React.ReactNode {
        const isReadyToRender = this.state.error === undefined && this.state.relayerInfos !== undefined;
        if (!isReadyToRender) {
            return (
                // TODO: consolidate this loading component with the one in portal and OpenPositions
                // TODO: possibly refactor into a generic loading container with spinner and retry UI
                <div className="center">
                    {this.state.error === undefined ? (
                        <CircularProgress size={40} thickness={5} />
                    ) : (
                        <Retry onRetry={this._fetchRelayerInfosAsync.bind(this)} />
                    )}
                </div>
            );
        } else {
            const numberOfRelayers = this.state.relayerInfos.length;
            const numberOfColumns = Math.min(
                numberOfRelayers,
                this._numberOfColumnsForScreenWidth(this.props.screenWidth),
            );
            const isExpanded = this.props.cellStyle === RelayerIndexCellStyle.Expanded;
            const cellHeight = isExpanded ? CELL_HEIGHT_EXPANDED : CELL_HEIGHT_MINIMIZED;
            const gridTileStyle = isExpanded ? RelayerGridTileStyle.Expanded : RelayerGridTileStyle.Minimized;
            return (
                <GridList
                    cellHeight={cellHeight}
                    cols={numberOfColumns}
                    padding={GRID_PADDING}
                    style={{ marginTop: -10, marginBottom: 0 }}
                >
                    {this.state.relayerInfos.map((relayerInfo: WebsiteBackendRelayerInfo, index) => (
                        <RelayerGridTile
                            key={index}
                            relayerInfo={relayerInfo}
                            networkId={this.props.networkId}
                            style={gridTileStyle}
                        />
                    ))}
                </GridList>
            );
        }
    }
    private async _fetchRelayerInfosAsync(): Promise<void> {
        try {
            if (!this._isUnmounted) {
                this.setState({
                    relayerInfos: undefined,
                    error: undefined,
                });
            }
            const relayerInfos = await backendClient.getRelayerInfosAsync();
            if (!this._isUnmounted) {
                this.setState({
                    relayerInfos,
                });
            }
        } catch (e) {
            const err = utils.maybeWrapInError(e);
            if (!this._isUnmounted) {
                this.setState({
                    error: err,
                });
            }
        }
    }
    private _numberOfColumnsForScreenWidth(screenWidth: ScreenWidths): number {
        switch (screenWidth) {
            case ScreenWidths.Md:
                return NUMBER_OF_COLUMNS_MEDIUM;
            case ScreenWidths.Sm:
                return NUMBER_OF_COLUMNS_SMALL;
            case ScreenWidths.Lg:
            default:
                return NUMBER_OF_COLUMNS_LARGE;
        }
    }
}
