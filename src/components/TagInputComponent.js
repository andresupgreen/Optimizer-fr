import React, { useContext } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { ManageContext } from '../index';

import './taginputcomponent.css';

export const TagInputComponent = () => {
  const { tags, handleDelete, handleAddition, handleDrag } = useContext(ManageContext);

  const KeyCodes = {
    comma: 188,
    enter: 13
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  return (
    <div>
      <div>
        <ReactTags
          tags={tags}
          placeholder={'Please enter area/region'}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          inputFieldPosition="top"
          autofocus={false}
        />
      </div>
    </div>
  );
}