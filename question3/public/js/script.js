// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the table body element
  const userTableBody = document.getElementById('userTableBody');
  
  // Function to fetch all users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };
  
  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  };
  
  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Function to render the users table
  const renderUsersTable = (users) => {
    // Clear the table body
    userTableBody.innerHTML = '';
    
    // If there are no users, display a message
    if (users.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.setAttribute('colspan', '5');
      cell.textContent = 'No users found';
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      userTableBody.appendChild(row);
      return;
    }
    
    // Otherwise, display each user
    users.forEach(user => {
      const row = document.createElement('tr');
      
      // ID column
      const idCell = document.createElement('td');
      idCell.textContent = user.id;
      row.appendChild(idCell);
      
      // Name column
      const nameCell = document.createElement('td');
      nameCell.textContent = user.name;
      row.appendChild(nameCell);
      
      // Email column
      const emailCell = document.createElement('td');
      emailCell.textContent = user.email;
      row.appendChild(emailCell);
      
      // Created On column
      const createdOnCell = document.createElement('td');
      createdOnCell.textContent = formatDate(user.created_on);
      row.appendChild(createdOnCell);
      
      // Action column
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete this user?')) {
          const deleted = await deleteUser(user.id);
          if (deleted) {
            // Reload the users table
            const updatedUsers = await fetchUsers();
            renderUsersTable(updatedUsers);
          }
        }
      });
      
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
      
      userTableBody.appendChild(row);
    });
  };
  
  // Initial load of the users table
  const initializeTable = async () => {
    const users = await fetchUsers();
    renderUsersTable(users);
  };
  
  // Call the initialization function
  initializeTable();
}); 