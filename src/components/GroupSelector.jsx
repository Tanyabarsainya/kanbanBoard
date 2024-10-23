import React from 'react';

const GroupSelector = ({ grouping, setGrouping }) => {
  return (
    <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
      <option value="status">Status</option>
      <option value="user">User</option>
      <option value="priority">Priority</option>
    </select>
  );
};

export default GroupSelector;
