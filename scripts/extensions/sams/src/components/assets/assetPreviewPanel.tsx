// External modules
import * as React from 'react';

// Types
import {IAssetItem} from '../../interfaces';
import {superdeskApi} from '../../apis';

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

// Utils
import {
    getHumanReadableFileSize,
} from '../../utils/ui';

interface IProps {
    asset?: IAssetItem;
    setName?: string;
    onPanelClosed(): void;
    downloadAsset(asset: Partial<IAssetItem>): void;
}

export class AssetPreviewPanel extends React.PureComponent<IProps> {
    render() {
        const {gettext} = superdeskApi.localization;
        const {asset, setName} = this.props;

        if (asset?._id == null) {
            return null;
        }

        return (
            <React.Fragment>
                <PanelHeader onClose={this.props.onPanelClosed} borderB={true} title={gettext('Asset Preview')} />
                <PanelContent>
                    <div className="side-panel__content-block side-panel__content-block--flex">
                        <div className="side-panel__content-block-inner side-panel__content-block-inner--grow" />
                        <div className="side-panel__content-block-inner side-panel__content-block-inner--right">
                            <Dropdown
                                align = "right"
                                append = {true}
                                items={[
                                    {
                                        type: 'group',
                                        label: gettext('Actions'),
                                        items: [
                                            'divider',
                                            {
                                                label: gettext('Download'), icon: 'download',
                                                onSelect: () => this.props.downloadAsset(asset),
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
                        </div>
                    </div>
                    <PanelContentBlock flex={true}>
                        <PanelContentBlockInner grow={true}>
                            <FormRow>
                                <FormLabel text={gettext('Name')} style="light" />
                                <Text>{asset.name}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Description')} style="light" />
                                <Text>{asset.description}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Filename')} style="light" />
                                <Text>{asset.filename}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('FileLength')} style="light" />
                                <Text>{getHumanReadableFileSize(asset.length)}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Mimetype')} style="light" />
                                <Text>{asset.mimetype}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('Usage')} style="light" />
                                <Text>{asset.state}</Text>
                            </FormRow>

                            <FormRow>
                                <FormLabel text={gettext('SetName')} style="light" />
                                <Text>{setName}</Text>
                            </FormRow>
                        </PanelContentBlockInner>
                    </PanelContentBlock>
                </PanelContent>
            </React.Fragment>
        );
    }
}
