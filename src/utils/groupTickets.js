export const groupTicketsBy = (tickets, grouping) => {
  const groups = {};

  tickets.forEach((ticket) => {
    // Dynamically create groups based on the selected grouping criteria
    let groupKey;

    // Handle status grouping (default groups predefined)
    if (grouping === 'status') {
      groupKey = ticket.status || 'Backlog';  // Default to 'Backlog' if no status

      // Ensure status categories always exist
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
    }
    // Handle priority grouping (numbers 0, 1, 2, 3, 4)
    else if (grouping === 'priority') {
      groupKey = ticket.priority !== undefined ? ticket.priority.toString() : '0';  // Default to "No priority" (0)

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
    }
    // Handle user grouping (group by userId)
    else if (grouping === 'user') {
      groupKey = ticket.userId || 'Unknown';  // Default to 'Unknown' if no userId

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
    }

    // Add the ticket to the appropriate group
    if (groupKey) {
      groups[groupKey].push(ticket);
    }
  });

  // For status, ensure we return all categories even if empty (Backlog, Todo, etc.)
  if (grouping === 'status') {
    const allStatusGroups = { Backlog: [], Todo: [], 'In Progress': [], Done: [], Cancelled: [] };
    return { ...allStatusGroups, ...groups };  // Return all status groups even if some are empty
  }

  return groups;
};


  
  export const sortTicketsBy = (groupedTickets, sorting) => {
    for (const group in groupedTickets) {
      groupedTickets[group].sort((a, b) => {
        if (sorting === 'priority') return b.priority - a.priority;
        if (sorting === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
    }
  
    return groupedTickets;
  };
  