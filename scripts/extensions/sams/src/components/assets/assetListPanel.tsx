// External Modules
import * as React from 'react';

// Types
import {ISuperdesk} from 'superdesk-api';
import {IAssetItem, ASSET_LIST_STYLE} from '../../interfaces';

// UI
import {PanelInfo, ListItemGroup} from '../../ui';
import {GridList} from '../../ui/grid/GridList';
import {getAssetGridItemComponent} from './assetGridItem';
import {getAssetListItemComponent} from './assetListItem';

interface IProps {
    assets: Array<IAssetItem>;
    listStyle: ASSET_LIST_STYLE;
    previewAsset(asset: IAssetItem): void;
    selectedAssetId: string | undefined;
}

export function getAssetListPanel(superdesk: ISuperdesk) {
    const {gettext} = superdesk.localization;
    const {assertNever} = superdesk.helpers;

    const AssetGridItem = getAssetGridItemComponent(superdesk);
    const AssetListItem = getAssetListItemComponent(superdesk);

    return class AssetListPanelComponent extends React.PureComponent<IProps> {
        constructor(props: IProps) {
            super(props);
            this.onItemClick = this.onItemClick.bind(this);
        }

        onItemClick(asset: IAssetItem) {
            this.props.previewAsset(asset);
        }

        render() {
            if (this.props.assets.length === 0) {
                return (
                    <PanelInfo
                        icon="big-icon--comments"
                        heading={gettext('No Assets found')}
                        description={gettext('Upload new Assets or change your search filters')}
                    />
                );
            } else if (this.props.listStyle === ASSET_LIST_STYLE.GRID) {
                return (
                    <GridList className="sd-margin--1">
                        {this.props.assets.map((asset) => (
                            <AssetGridItem
                                key={asset._id}
                                asset={asset}
                                onClick={this.onItemClick}
                                selected={asset._id === this.props.selectedAssetId}
                            />
                        ))}
                    </GridList>
                );
            } else if (this.props.listStyle === ASSET_LIST_STYLE.LIST) {
                return (
                    <ListItemGroup>
                        {this.props.assets.map((asset) => (
                            <AssetListItem
                                key={asset._id}
                                asset={asset}
                                onClick={this.onItemClick}
                                selected={asset._id === this.props.selectedAssetId}
                            />
                        ))}
                    </ListItemGroup>
                );
            }

            assertNever(this.props.listStyle);
            return null;
        }
    };
}
