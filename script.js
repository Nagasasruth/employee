// Employee data (simulating a database)
let employees = [
    {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        department: 'HR',
        role: 'Manager'
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        department: 'IT',
        role: 'Developer'
    },
    {
        id: 3,
        firstName: 'Charlie',
        lastName: 'Lee',
        email: 'charlie@example.com',
        department: 'Finance',
        role: 'Analyst'
    },
    {
        id: 4,
        firstName: 'Diana',
        lastName: 'Williams',
        email: 'diana@example.com',
        department: 'Marketing',
        role: 'Coordinator'
    },
    {
        id: 5,
        firstName: 'Ethan',
        lastName: 'Brown',
        email: 'ethan@example.com',
        department: 'Operations',
        role: 'Manager'
    }
];

// DOM Elements
const employeeGrid = document.getElementById('employeeGrid');
const employeeTemplate = document.getElementById('employeeTemplate');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtn = document.getElementById('filterBtn');
const filterSidebar = document.getElementById('filterSidebar');
const closeFilterBtn = document.getElementById('closeFilterBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const sortSelect = document.getElementById('sortSelect');
const itemsPerPage = document.getElementById('itemsPerPage');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const employeeForm = document.getElementById('employeeForm');
const formTitle = document.getElementById('formTitle');
const employeeId = document.getElementById('employeeId');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const department = document.getElementById('department');
const role = document.getElementById('role');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

// Filter variables
let currentFilters = {
    firstName: '',
    department: '',
    role: ''
};
let currentSort = '';
let currentPage = 1;
let itemsPerPageValue = 10;

// Initialize the app
function init() {
    if (employeeGrid) {
        // Dashboard page
        renderEmployees();
        setupEventListeners();
    } else if (employeeForm) {
        // Add/Edit page
        setupForm();
    }
}

// Render employees based on current filters, sort, and pagination
function renderEmployees() {
    let filteredEmployees = [...employees];
    
    // Apply filters
    if (currentFilters.firstName) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.firstName.toLowerCase().includes(currentFilters.firstName.toLowerCase())
    }
    
    if (currentFilters.department) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.department === currentFilters.department)
    }
    
    if (currentFilters.role) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.role === currentFilters.role)
    }
    
    // Apply sorting
    if (currentSort) {
        const [sortField, sortDirection] = currentSort.split('-');
        filteredEmployees.sort((a, b) => {
            const aValue = a[sortField].toLowerCase();
            const bValue = b[sortField].toLowerCase();
            
            if (sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    }
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPageValue;
    const endIndex = startIndex + itemsPerPageValue;
    const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);
    
    // Calculate total pages
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPageValue);
    
    // Update pagination controls
    updatePaginationControls(totalPages);
    
    // Render using Freemarker template
    const templateData = {
        employees: paginatedEmployees
    };
    
    const renderedHTML = FreeMarker.template(employeeTemplate.innerHTML, templateData);
    employeeGrid.innerHTML = renderedHTML;
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            showDeleteModal(id);
        });
    });
}

// Update pagination controls
function updatePaginationControls(totalPages) {
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    
    prevPage.disabled = currentPage === 1;
    nextPage.disabled = currentPage === totalPages || totalPages === 0;
    
    if (totalPages === 0) {
        pageInfo.textContent = 'No results found';
    }
}

// Show delete confirmation modal
function showDeleteModal(id) {
    deleteModal.classList.add('active');
    confirmDeleteBtn.setAttribute('data-id', id);
}

// Hide delete confirmation modal
function hideDeleteModal() {
    deleteModal.classList.remove('active');
    confirmDeleteBtn.removeAttribute('data-id');
}

// Delete an employee
function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    renderEmployees();
    hideDeleteModal();
}

// Setup event listeners for dashboard page
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            currentFilters = {
                firstName: '',
                department: '',
                role: ''
            };
            
            const filtered = employees.filter(emp => 
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            renderFilteredEmployees(filtered);
        } else {
            currentFilters = {
                firstName: '',
                department: '',
                role: ''
            };
            renderEmployees();
        }
    });
    
    // Filter sidebar toggle
    filterBtn.addEventListener('click', () => {
        filterSidebar.classList.add('active');
    });
    
    closeFilterBtn.addEventListener('click', () => {
        filterSidebar.classList.remove('active');
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', () => {
        currentFilters = {
            firstName: document.getElementById('firstNameFilter').value.trim(),
            department: document.getElementById('departmentFilter').value,
            role: document.getElementById('roleFilter').value
        };
        
        currentPage = 1;
        renderEmployees();
        filterSidebar.classList.remove('active');
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', () => {
        document.getElementById('firstNameFilter').value = '';
        document.getElementById('departmentFilter').value = '';
        document.getElementById('roleFilter').value = '';
        
        currentFilters = {
            firstName: '',
            department: '',
            role: ''
        };
        
        currentPage = 1;
        renderEmployees();
    });
    
    // Sorting
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        renderEmployees();
    });
    
    // Items per page
    itemsPerPage.addEventListener('change', (e) => {
        itemsPerPageValue = parseInt(e.target.value);
        currentPage = 1;
        renderEmployees();
    });
    
    // Pagination
    prevPage.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEmployees();
        }
    });
    
    nextPage.addEventListener('click', () => {
        const totalPages = Math.ceil(getFilteredEmployees().length / itemsPerPageValue);
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployees();
        }
    });
    
    // Delete modal
    confirmDeleteBtn.addEventListener('click', () => {
        const id = parseInt(confirmDeleteBtn.getAttribute('data-id'));
        deleteEmployee(id);
    });
    
    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
}

// Get filtered employees (without pagination)
function getFilteredEmployees() {
    let filteredEmployees = [...employees];
    
    if (currentFilters.firstName) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.firstName.toLowerCase().includes(currentFilters.firstName.toLowerCase())
    }
    
    if (currentFilters.department) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.department === currentFilters.department)
    }
    
    if (currentFilters.role) {
        filteredEmployees = filteredEmployees.filter(emp => 
            emp.role === currentFilters.role)
    }
    
    return filteredEmployees;
}

// Setup form for add/edit page
function setupForm() {
    // Check if we're editing an existing employee
    const urlParams = new URLSearchParams(window.location.search);
    const employeeIdParam = urlParams.get('id');
    
    if (employeeIdParam) {
        formTitle.textContent = 'Edit Employee';
        const id = parseInt(employeeIdParam);
        const employee = employees.find(emp => emp.id === id);
        
        if (employee) {
            employeeId.value = employee.id;
            firstName.value = employee.firstName;
            lastName.value = employee.lastName;
            email.value = employee.email;
            department.value = employee.department;
            role.value = employee.role;
        } else {
            // Employee not found, redirect to dashboard
            window.location.href = 'index.html';
        }
    }
    
    // Form submission
    employeeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const employeeData = {
                id: employeeId.value ? parseInt(employeeId.value) : generateId(),
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                department: department.value,
                role: role.value
            };
            
            if (employeeId.value) {
                // Update existing employee
                const index = employees.findIndex(emp => emp.id === parseInt(employeeId.value));
                if (index !== -1) {
                    employees[index] = employeeData;
                }
            } else {
                // Add new employee
                employees.push(employeeData);
            }
            
            // Redirect to dashboard
            window.location.href = 'index.html';
        }
    });
    
    // Cancel button
    cancelBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Form validation on input
    firstName.addEventListener('input', () => validateField(firstName, 'firstNameError', 'First name is required'));
    lastName.addEventListener('input', () => validateField(lastName, 'lastNameError', 'Last name is required'));
    email.addEventListener('input', validateEmail);
    department.addEventListener('change', () => validateField(department, 'departmentError', 'Department is required'));
    role.addEventListener('change', () => validateField(role, 'roleError', 'Role is required'));
}

// Generate a new ID for new employees
function generateId() {
    return employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
}

// Validate the entire form
function validateForm() {
    let isValid = true;
    
    if (!validateField(firstName, 'firstNameError', 'First name is required')) isValid = false;
    if (!validateField(lastName, 'lastNameError', 'Last name is required')) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validateField(department, 'departmentError', 'Department is required')) isValid = false;
    if (!validateField(role, 'roleError', 'Role is required')) isValid = false;
    
    return isValid;
}

// Validate a single field
function validateField(field, errorElementId, errorMessage) {
    const errorElement = document.getElementById(errorElementId);
    
    if (!field.value.trim()) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// Validate email field
function validateEmail() {
    const errorElement = document.getElementById('emailError');
    const emailValue = email.value.trim();
    
    if (!emailValue) {
        errorElement.textContent = 'Email is required';
        errorElement.style.display = 'block';
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errorElement.textContent = 'Please enter a valid email address';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
