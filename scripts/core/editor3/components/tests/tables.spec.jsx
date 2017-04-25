import React from 'react';
import {EditorState, ContentState} from 'draft-js';
import {shallow, mount} from 'enzyme';
import {tableBlockAndContent} from './utils';
import {TableCell} from '../tables';
import {TableBlockComponent as TableBlock} from '../tables/TableBlock';
import {TableButtonComponent as TableButton} from '../tables/TableButton';

describe('editor3.component.table-button', () => {
    it('should call action when clicked', () => {
        const action = jasmine.createSpy();
        const wrapper = mount(<TableButton addTable={action} />);

        wrapper.find('span').simulate('click');

        expect(action).toHaveBeenCalled();
    });
});

describe('editor3.component.table-block', () => {
    it('should render 2 rows and 6 cells', () => {
        const {block, contentState} = tableBlockAndContent();
        const wrapper = shallow(
            <TableBlock
                contentState={contentState}
                block={block}
                setActiveCell={() => { /* no-op */ }}
                editorState={{}}
                parentOnChange={() => { /* no-op */ }}
                parentReadOnly={false} />
        );

        expect(wrapper.find('tr').length).toEqual(2);
        expect(wrapper.find('TableCell').length).toEqual(6);
    });

    it('should render correct text in each cell', () => {
        const {block, contentState} = tableBlockAndContent();
        const wrapper = mount(
            <TableBlock
                contentState={contentState}
                block={block}
                setActiveCell={() => { /* no-op */ }}
                editorState={{}}
                parentOnChange={() => { /* no-op */ }}
                parentReadOnly={true} />
        );

        ['a', 'b', 'c', 'd', 'e', 'f'].forEach((letter, i) => {
            const cellContentState = wrapper.find('TableCell').at(i)
                .prop('editorState')
                .getCurrentContent();
            const cellText = cellContentState.getPlainText('');

            expect(cellText).toBe(letter);
        });
    });
});

describe('editor3.component.table-cell', () => {
    it('should render', () => {
        const wrapper = shallow(
            <TableCell
                editorState={EditorState.createWithContent(ContentState.createFromText('abc'))}
                onChange={() => { /* no-op */ }}
                onFocus={() => { /* no-op */ }} />
        );

        expect(wrapper.find('DraftEditor').length).toBe(1);
    });
});
