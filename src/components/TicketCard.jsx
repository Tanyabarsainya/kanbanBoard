import React from "react";
import "./TicketCard.css";

// Import images for different priority levels
import urgentIcon from "../assets/SVG - Urgent Priority grey.svg";
import highIcon from "../assets/high.svg";
import mediumIcon from "../assets/medium.svg";
import lowIcon from "../assets/low.svg";
import noPriorityIcon from "../assets/noPriority.svg";
import tagImg from "../assets/32px-Eo_circle_grey_blank.svg.png";

// Mapping priority to the respective icons
const priorityIcons = {
  4: urgentIcon,
  3: highIcon,
  2: mediumIcon,
  1: lowIcon,
  0: noPriorityIcon,
};

const TicketCard = ({ ticket, hideAvatar }) => {
  const { id, title, description, priority, status, user, tag } = ticket;

  // Use the priority to get the corresponding icon
  const priorityIcon = priorityIcons[priority] || noPriorityIcon;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-id">{id}</div>
        {!hideAvatar && (
          <div className="card-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/6858/6858504.png" alt="User Avatar" />
          </div>
        )}
      </div>

      <div className="card-body">
        <div className="card-title">{title}</div>
       

        <div className="card-text">{description}</div>
        <div className="card-footer">
          <div className="card-footer-item">
            <span className="icon-button">
              <img src={priorityIcon} alt="Priority Icon" />
            </span>
            <div className="tag">
              <img style={{height:"30px"}} src={tagImg} alt="tag" />
              {tag}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
