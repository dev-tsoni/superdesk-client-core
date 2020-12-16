// External modules
import * as React from 'react';
import {Dispatch} from 'redux';
import {connect} from 'react-redux';

// Types
import {IAssetItem, LIST_ACTION} from '../../interfaces';
import {IApplicationState} from '../../store';
import {superdeskApi, samsApi} from '../../apis';

// Redux Actions & Selectors
import {closeAssetContentPanel, queryAssetsFromCurrentSearch, editAsset, deleteAsset} from '../../store/assets/actions';
import {getSelectedAsset, getSetNameForSelectedAsset} from '../../store/assets/selectors';

// UI
import {Dropdown, FormLabel, IconButton} from 'superdesk-ui-framework/react';
import {
    FormRow,
    PanelContent,
    PanelContentBlock,
    PanelContentBlockInner,
    PanelHeader,
    Text,
} from '../../ui';
import {VersionUserDateLines} from '../common/versionUserDateLines';

// Utils
import {getHumanReadableFileSize} from '../../utils/ui';
import {getMimetypeHumanReadable} from '../../utils/assets';

interface IProps {
    asset?: IAssetItem;
    setName?: string;
    deleteAsset(asset: IAssetItem): void;
    editAsset(asset: IAssetItem): void;
    onPanelClosed(): void;
    downloadAsset(asset: Partial<IAssetItem>): void;
    queryAssetsFromCurrentSearch(listStyle: LIST_ACTION): void;
}

const mapStateToProps = (state: IApplicationState) => ({
    asset: getSelectedAsset(state),
    setName: getSetNameForSelectedAsset(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    editAsset: (asset: IAssetItem) => dispatch(editAsset(asset._id)),
    deleteAsset: (asset: IAssetItem) => dispatch<any>(deleteAsset(asset)),
    onPanelClosed: () => dispatch(closeAssetContentPanel()),
    queryAssetsFromCurrentSearch: (listAction?: LIST_ACTION) => dispatch<any>(queryAssetsFromCurrentSearch(listAction)),

});

export function downloadAssetBinary(asset: IAssetItem): void {
    samsApi.assets.getAssetBinary(asset);
}

export class AssetPreviewPanelComponent extends React.PureComponent<IProps> {
    constructor(props: IProps) {
        super(props);

        this.onEditAsset = this.onEditAsset.bind(this);
        this.onDownloadSingleAssetCompressedBinary = this.onDownloadSingleAssetCompressedBinary.bind(this);
        this.onDeleteAsset = this.onDeleteAsset.bind(this);
    }

    onEditAsset(): void {
        this.props.editAsset(this.props.asset!);
    }

    onDeleteAsset(): void {
        this.props.deleteAsset(this.props.asset!);
    }

    onDownloadSingleAssetCompressedBinary(): void {
        downloadAssetBinary(this.props.asset!);
    }

    render() {
        const {gettext} = superdeskApi.localization;

        if (this.props.asset?._id == null) {
            return null;
        }

        return (
            <React.Fragment>
                <PanelHeader onClose={this.props.onPanelClosed} borderB={true} title={gettext('Asset Preview')} />
                <PanelContent>
                    <PanelContentBlock flex={true}>
                        <PanelContentBlockInner grow={true}>
                            <VersionUserDateLines item={this.props.asset} />
                        </PanelContentBlockInner>
                        <PanelContentBlockInner right={true}>
                            <Dropdown
                                align = "right"
                                items={[
                                    {
                                        type: 'group',
                                        label: gettext('Actions'),
                                        items: [
                                            'divider',
                                            {
                                                label: gettext('Edit'), icon: 'trash',
                                                onSelect: this.onEditAsset,
                                            },
                                            {
                                                label: gettext('Download'), icon: 'download',
                                                onSelect: this.onDownloadSingleAssetCompressedBinary,
                                            },
                                            {
                                                label: gettext('Delete'), icon: 'trash',
                                                onSelect: this.onDeleteAsset,
                                            },
                                        ],
                                    },
                                ]}
                            >
                                <IconButton
                                    ariaValue="dropdown-more-options"
                                    icon="dots-vertical"
                                    onClick={() => false}
                                />
                            </Dropdown>
                        </PanelContentBlockInner>
                    </PanelContentBlock>
                    <PanelContentBlock flex={true}>
                        <PanelContentBlockInner grow={true}>
                            <FormRow>
                                <FormLabel text={gettext('Name')} style="light" />
                                <Text>{this.props.asset?.name}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Description')} style="light" />
                                <Text>{this.props.asset?.description || '-'}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Filename')} style="light" />
                                <Text>{this.props.asset?.filename}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Size')} style="light" />
                                <Text>{getHumanReadableFileSize(this.props.asset?.length)}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Type')} style="light" />
                                <Text>
                                    {getMimetypeHumanReadable(this.props.asset?.mimetype)}
                                    ({this.props.asset?.mimetype})
                                </Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('State')} style="light" />
                                <Text>{this.props.asset?.state}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Set')} style="light" />
                                <Text>{this.props.setName}</Text>
                            </FormRow>
                        </PanelContentBlockInner>
                    </PanelContentBlock>
                </PanelContent>
            </React.Fragment>
        );
    }
}

export const AssetPreviewPanel = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AssetPreviewPanelComponent);
