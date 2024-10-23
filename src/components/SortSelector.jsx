import React from 'react';

const SortSelector = ({ sorting, setSorting }) => {
  return (
    <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
      <option value="priority">Priority</option>
      <option value="title">Title</option>
    </select>
  );
};

export default SortSelector;
