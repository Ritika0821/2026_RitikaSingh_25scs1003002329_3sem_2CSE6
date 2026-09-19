let startingBalance = Number(localStorage.getItem("startingBalance")) || 0;

const startingBalanceInput = document.getElementById("startingBalance");

startingBalanceInput.value = startingBalance;


let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addTransactionBtn = document.getElementById("addTransactionBtn");

const transactionList = document.getElementById("transactionList");
const categoryFilter = document.getElementById("categoryFilter");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");


// Add Transaction
addTransactionBtn.addEventListener("click", function () {

    startingBalance = Number(startingBalanceInput.value) || 0;

localStorage.setItem("startingBalance", startingBalance);
    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (description === "" || amount <= 0 || date === "") {
        alert("Please fill all the fields correctly.");
        return;
    }

    const transaction = {
        id: Date.now(),
        description: description,
        amount: amount,
        type: type,
        category: category,
        date: date
    };

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();
    updateSummary();

    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
});


// Save Transactions
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


// Display Transactions
function displayTransactions() {

    transactionList.innerHTML = "";

    const selectedCategory = categoryFilter.value;

    const filteredTransactions = transactions.filter(function (transaction) {

        if (selectedCategory === "all") {
            return true;
        }

        return transaction.category === selectedCategory;
    });


    filteredTransactions.forEach(function (transaction) {

        const transactionDiv = document.createElement("div");

        transactionDiv.classList.add("transaction-item");

        transactionDiv.innerHTML = `
            <div>
                <strong>${transaction.description}</strong>
                <p>${transaction.category} | ${transaction.date}</p>
            </div>

            <div>
                <span>
                    ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount}
                </span>

                <button onclick="editTransaction(${transaction.id})">
                    Edit
                </button>

                <button onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(transactionDiv);
    });
}


// Update Summary
function updateSummary() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });

    const totalBalance = startingBalance + totalIncome - totalExpense;

    income.textContent = "₹" + totalIncome;
    expense.textContent = "₹" + totalExpense;
    balance.textContent = "₹" + totalBalance;
}


// Delete Transaction
function deleteTransaction(id) {

    transactions = transactions.filter(function (transaction) {
        return transaction.id !== id;
    });

    saveTransactions();
    displayTransactions();
    updateSummary();
}


// Edit Transaction
function editTransaction(id) {

    const transaction = transactions.find(function (transaction) {
        return transaction.id === id;
    });

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;

    deleteTransaction(id);
}


// Filter Transactions
categoryFilter.addEventListener("change", function () {
    displayTransactions();
});


// Display saved transactions when page loads
displayTransactions();
updateSummary();