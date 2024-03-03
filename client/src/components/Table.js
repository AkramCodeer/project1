import React, { useState, useEffect } from 'react';
import './Table.css'; // Import CSS file for styling

const Table = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBySold, setSortBySold] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, searchTerm, sortBySold]); // Fetch transactions when page, search term, or sorting criteria changes

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/transactions');
      const data = await response.json();

      // Filter transactions by search term
      let filteredTransactions = data;
      if (searchTerm) {
        filteredTransactions = filteredTransactions.filter(transaction =>
          transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) 
        );
      }

      // Filter transactions by sold status
      if (sortBySold === 'sold') {
        filteredTransactions = filteredTransactions.filter(transaction => transaction.sold);
      } else if (sortBySold === 'notSold') {
        filteredTransactions = filteredTransactions.filter(transaction => !transaction.sold);
      }

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when search term changes
  };

  const handleSortBySold = (e) => {
    setSortBySold(e.target.value);
    setCurrentPage(1); // Reset pagination to first page when sorting criteria changes
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1>Transactions</h1>
      <div className="filter-search">
        <input
          type="text"
          placeholder="Search by title "
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={sortBySold} onChange={handleSortBySold}>
          <option value="all">All</option>
          <option value="sold">Sold</option>
          <option value="notSold">Not Sold</option>
        </select>
      </div>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Description</th>
            <th>Category</th>
            <th>Image</th>
            <th>Sold</th>
            <th>Date of Sale</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.price}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td><img src={transaction.image} alt={transaction.title} style={{ width: '100px', height: 'auto' }} /></td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.dateOfSale}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        transactionsPerPage={transactionsPerPage}
        totalTransactions={transactions.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ transactionsPerPage, totalTransactions, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      {pageNumbers.map(number => (
        <li key={number} className={currentPage === number ? 'active' : ''}>
          <button onClick={() => paginate(number)}>{number}</button>
        </li>
      ))}
    </ul>
  );
};

export default Table;
