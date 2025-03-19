document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const userForm = document.getElementById('userForm');
    let searchTimeout;

    // Handle search input
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // Debounce the search to avoid too many API calls
        searchTimeout = setTimeout(() => {
            searchUsers(query);
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Handle form submission
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value
        };

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create user');
            }

            // Clear form
            userForm.reset();
            alert('User created successfully!');
        } catch (error) {
            alert(error.message);
        }
    });

    // Search users function
    async function searchUsers(query) {
        try {
            const response = await fetch(`/api/users/search?username=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch search results');
            }

            const users = await response.json();
            displaySearchResults(users);
        } catch (error) {
            console.error('Search error:', error);
            searchResults.style.display = 'none';
        }
    }

    // Display search results
    function displaySearchResults(users) {
        if (users.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        searchResults.innerHTML = users.map(user => `
            <div class="search-result-item">
                ${user.firstName} ${user.lastName} (${user.username})
            </div>
        `).join('');

        searchResults.style.display = 'block';

        // Add click handlers to search results
        const resultItems = searchResults.querySelectorAll('.search-result-item');
        resultItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const user = users[index];
                searchInput.value = user.username;
                searchResults.style.display = 'none';
            });
        });
    }
}); 