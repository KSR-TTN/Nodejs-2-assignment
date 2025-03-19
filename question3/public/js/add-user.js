// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the form element
  const addUserForm = document.getElementById('addUserForm');
  
  // Add submit event listener to the form
  addUserForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validate form data
    if (!name || !email) {
      alert('Please fill in all fields');
      return;
    }
    
    // Create user object
    const user = {
      name,
      email
    };
    
    try {
      // Send POST request to create a new user
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      // Get the created user
      const newUser = await response.json();
      
      // Show success message
      alert(`User ${newUser.name} created successfully!`);
      
      // Reset the form
      addUserForm.reset();
      
      // Redirect to the home page after a short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
      
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please try again.');
    }
  });
}); 