const form = document.getElementById('transaction-form');
const typeInput = document.getElementById('type');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const dateInput = document.getElementById('date');
const clearBtn = document.getElementById('clear-btn');

const totalIncomeEl = document.getElementById('total-income');
const totalExpensesEl = document.getElementById('total-expenses');
const currentBalanceEl = document.getElementById('current-balance');

const transactionList = document.getElementById('transaction-list');
const noDataEl = document.getElementById('no-data');

const filterTypeEl = document.getElementById('filter-type');
const searchInput = document.getElementById('search-input');

// Load transactions from localStorage or initialize empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Set default date to today
dateInput.valueAsDate = new Date();

// Event Listeners
form.addEventListener('submit', addTransaction);
clearBtn.addEventListener('click', clearForm);
filterTypeEl.addEventListener('change', renderTransactions);
searchInput.addEventListener('input', renderTransactions);

function addTransaction(e) {
    e.preventDefault();

    const amount = parseFloat(amountInput.value);

    if (amount <= 0 || isNaN(amount)) {
        alert('Please enter a valid amount greater than zero.');
        return;
    }

    const newTransaction = {
        id: generateID(),
        type: typeInput.value,
        description: descriptionInput.value.trim(),
        amount: amount,
        category: categoryInput.value,
        date: dateInput.value
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    renderTransactions();
    clearForm();
    alert('Transaction added successfully!');
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function deleteTransaction(id) {
    transactions = transactions.filter(txn => txn.id !== id);
    updateLocalStorage();
    renderTransactions();
}

function clearForm() {
    descriptionInput.value = '';
    amountInput.value = '';
    categoryInput.value = '';
    typeInput.value = 'Income';
    dateInput.valueAsDate = new Date();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function calculateTotals(allTransactions) {
    const income = allTransactions
        .filter(txn => txn.type === 'Income')
        .reduce((acc, txn) => acc + txn.amount, 0);

    const expense = allTransactions
        .filter(txn => txn.type === 'Expense')
        .reduce((acc, txn) => acc + txn.amount, 0);

    const balance = income - expense;

    totalIncomeEl.innerText = `LKR ${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    totalExpensesEl.innerText = `LKR ${expense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    currentBalanceEl.innerText = `LKR ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderTransactions() {
    const filterType = filterTypeEl.value;
    const searchTerm = searchInput.value.toLowerCase();

    // Filter by type and search term
    let filteredTransactions = transactions.filter(txn => {
        const matchesType = (filterType === 'All') || (txn.type === filterType);
        const matchesSearch = txn.description.toLowerCase().includes(searchTerm) || 
                              txn.category.toLowerCase().includes(searchTerm);
        return matchesType && matchesSearch;
    });

    // Calculate totals based on all transactions
    calculateTotals(transactions);

    transactionList.innerHTML = '';

    if (filteredTransactions.length === 0) {
        noDataEl.style.display = 'block';
        return;
    } else {
        noDataEl.style.display = 'none';
    }

    filteredTransactions.forEach(txn => {
        const row = document.createElement('tr');
        const sign = txn.type === 'Income' ? '+' : '-';
        const badgeClass = txn.type === 'Income' ? 'badge-income' : 'badge-expense';

        row.innerHTML = `
            <td>${txn.date}</td>
            <td>${txn.description}</td>
            <td><span class="${badgeClass}">${txn.type}</span></td>
            <td>${txn.category}</td>
            <td>${sign} LKR ${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><button class="delete-btn" onclick="deleteTransaction(${txn.id})">Delete</button></td>
        `;

        transactionList.appendChild(row);
    });
}

// Initial render
renderTransactions();