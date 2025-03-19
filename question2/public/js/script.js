// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the table body and filter container elements
  const studentTableBody = document.getElementById('studentTableBody');
  const branchFilters = document.getElementById('branchFilters');
  
  // Keep track of the current active filter
  let currentFilter = 'all';
  
  // Function to fetch all students from the API
  const fetchStudents = async (branch = null) => {
    try {
      let url = '/api/students';
      if (branch && branch !== 'all') {
        url += `?branch=${encodeURIComponent(branch)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      
      const students = await response.json();
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      return [];
    }
  };
  
  // Function to fetch all unique branch names
  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      
      if (!response.ok) {
        throw new Error('Failed to fetch branches');
      }
      
      const branches = await response.json();
      return branches;
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  };
  
  // Function to delete a student
  const deleteStudent = async (studentId) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  };
  
  // Function to render the students table
  const renderStudentsTable = (students) => {
    // Clear the table body
    studentTableBody.innerHTML = '';
    
    // If there are no students, display a message
    if (students.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.setAttribute('colspan', '6');
      cell.textContent = 'No students found';
      cell.style.textAlign = 'center';
      row.appendChild(cell);
      studentTableBody.appendChild(row);
      return;
    }
    
    // Otherwise, display each student
    students.forEach(student => {
      const row = document.createElement('tr');
      
      // ID column
      const idCell = document.createElement('td');
      idCell.textContent = student.id;
      row.appendChild(idCell);
      
      // Name column
      const nameCell = document.createElement('td');
      nameCell.textContent = student.name;
      row.appendChild(nameCell);
      
      // Age column
      const ageCell = document.createElement('td');
      ageCell.textContent = student.age;
      row.appendChild(ageCell);
      
      // Branch column
      const branchCell = document.createElement('td');
      branchCell.textContent = student.branch;
      row.appendChild(branchCell);
      
      // Email column
      const emailCell = document.createElement('td');
      emailCell.textContent = student.email;
      row.appendChild(emailCell);
      
      // Action column
      const actionCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-btn';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', async () => {
        if (confirm(`Are you sure you want to delete student ${student.name}?`)) {
          const deleted = await deleteStudent(student.id);
          if (deleted) {
            // Reload the students table with the current filter
            loadStudentsByFilter(currentFilter);
          }
        }
      });
      
      actionCell.appendChild(deleteButton);
      row.appendChild(actionCell);
      
      studentTableBody.appendChild(row);
    });
  };
  
  // Function to create branch filter buttons
  const createBranchFilters = (branches) => {
    // We already have an "All Branches" button in HTML, so we just add the specific branches
    branches.forEach(branch => {
      const filterButton = document.createElement('button');
      filterButton.className = 'filter-btn';
      filterButton.textContent = branch;
      filterButton.setAttribute('data-branch', branch);
      
      filterButton.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        filterButton.classList.add('active');
        
        // Load students with this branch filter
        loadStudentsByFilter(branch);
      });
      
      branchFilters.appendChild(filterButton);
    });
  };
  
  // Function to load students by branch filter
  const loadStudentsByFilter = async (branch) => {
    currentFilter = branch;
    const students = await fetchStudents(branch);
    renderStudentsTable(students);
  };
  
  // Initialize the page
  const initialize = async () => {
    // Set up the "All Branches" button click handler
    const allBranchesBtn = document.querySelector('[data-branch="all"]');
    allBranchesBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      allBranchesBtn.classList.add('active');
      loadStudentsByFilter('all');
    });
    
    // Fetch and create branch filter buttons
    const branches = await fetchBranches();
    createBranchFilters(branches);
    
    // Initially load all students
    loadStudentsByFilter('all');
  };
  
  // Call the initialization function
  initialize();
}); 