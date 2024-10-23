import React, { useState, useEffect, useRef } from 'react';
import { fetchTickets } from '../utils/api';
import TicketCard from './TicketCard';
import GroupSelector from './GroupSelector';
import SortSelector from './SortSelector';
import { groupTicketsBy, sortTicketsBy } from '../utils/groupTickets';
import useLocalStorage from '../hooks/useLocalStorage';
import './KanbanBoard.css';
import displayIcon from '../assets/Display.svg';

// Import SVG icons for priority and status groups
import urgentIcon from '../assets/urgent.svg';
import highIcon from '../assets/high.svg';
import mediumIcon from '../assets/medium.svg';
import lowIcon from '../assets/low.svg';
import noPriorityIcon from '../assets/noPriority.svg';
import backlogIcon from '../assets/Backlog.svg';
import todoIcon from '../assets/todo.svg';
import inProgressIcon from '../assets/inProgress.svg';
import doneIcon from '../assets/Done.svg';
import cancelledIcon from '../assets/Cancelled.svg';

// Avatar links (dynamic, you can add more users here)
const avatarUrls = {
  'usr-1': 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png',
  'usr-2': 'https://cdn-icons-png.flaticon.com/512/219/219986.png',
  'usr-3': 'https://cdn-icons-png.flaticon.com/512/219/219969.png',
  'usr-4': 'https://cdn-icons-png.flaticon.com/512/219/219988.png',
  'default': 'https://cdn-icons-png.freepik.com/512/14074/14074217.png',
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useLocalStorage('grouping', 'status');  // Default to status
  const [sorting, setSorting] = useLocalStorage('sorting', 'priority');
  const [groupedTickets, setGroupedTickets] = useState({});
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const getTickets = async () => {
      const data = await fetchTickets();
      setTickets(data);
    };
    getTickets();
  }, []);

  useEffect(() => {
    let grouped = groupTicketsBy(tickets, grouping);
  
    if (grouping === 'priority') {
      // Custom order for priority with all levels explicitly defined
      const orderedPriority = { '0': [], '4': [], '3': [], '2': [], '1': [] };
      
      // Ensure all priority levels are included, even if they have no tickets
      grouped = Object.keys(orderedPriority).reduce((acc, key) => {
        acc[key] = grouped[key] || [];  // Ensure no missing priority groups
        return acc;
      }, {});
    }
  
    const sorted = sortTicketsBy(grouped, sorting);
    setGroupedTickets(sorted);
  }, [tickets, grouping, sorting]);
  

  const priorityLevels = {
    4: { label: 'Urgent', icon: urgentIcon },
    3: { label: 'High', icon: highIcon },
    2: { label: 'Medium', icon: mediumIcon },
    1: { label: 'Low', icon: lowIcon },
    0: { label: 'No priority', icon: noPriorityIcon },
  };

  const statusGroups = {
    Backlog: { label: 'Backlog', icon: backlogIcon },
    Todo: { label: 'Todo', icon: todoIcon },
    'In Progress': { label: 'In Progress', icon: inProgressIcon },
    Done: { label: 'Done', icon: doneIcon },
    Cancelled: { label: 'Cancelled', icon: cancelledIcon },
  };

  const renderColumnTitle = (groupKey) => {
    if (grouping === 'priority') {
      const { label, icon } = priorityLevels[groupKey] || priorityLevels[0];  // Default to "No priority"
      return (
        <h3>
          <img src={icon} alt={label} />
          {label}
        </h3>
      );
    } else if (grouping === 'status') {
      const { label, icon } = statusGroups[groupKey] || statusGroups.Backlog;  // Default to "Backlog"
      return (
        <h3>
          <img src={icon} alt={label} />
          {label}
        </h3>
      );
    } else if (grouping === 'user') {
      const userTickets = groupedTickets[groupKey] || [];
      const userName = userTickets[0]?.userId || 'Unknown';
      const avatarUrl = avatarUrls[groupKey] || avatarUrls.default;  // Get the avatar for the user
  
      return (
        <h3>
          <img className="user-group-avatar" src={avatarUrl} alt={userName} />
          {userName} ({userTickets.length})
        </h3>
      );
    } else {
      return <h3>{groupKey}</h3>;
    }
  };
  
  

  // Close dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="kanban-board">
      <div className="controls">
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="display-button" onClick={() => setDropdownOpen(!isDropdownOpen)}>
            <img style={{marginRight:"%"}} src={displayIcon} alt="displayIcon" />
            Display
          </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              Grouping <GroupSelector grouping={grouping} setGrouping={setGrouping} />
              Ordering <SortSelector sorting={sorting} setSorting={setSorting} />
            </div>
          )}
        </div>
      </div>

      <div className="board-columns">
        {Object.keys(groupedTickets).map((groupKey) => (
          <div key={groupKey} className="kanban-column">
            {renderColumnTitle(groupKey)}
            {groupedTickets[groupKey].map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} hideAvatar={grouping === 'user'} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
