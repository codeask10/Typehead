import React, { useEffect, useState } from 'react';

const App = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [countdown, setCountdown] = useState(0);

  const fetchData = async (input) => {
    try {
      const res = await fetch(`https://api.github.com/search/users?q=${input}`);
      const data = await res.json();
      setUsers(data.items.map((user) => user.login) || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (query) {
      const bouncingFn = setTimeout(() => {
        fetchData(query);
      }, 500);
      return () => clearTimeout(bouncingFn);
    } else {
      setUsers([]);
    }
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelect = (selectedData) => {
    setQuery(selectedData);
    setUsers([]);
    setSelectedIndex(-1);
    setCountdown(15);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex((prev) => (prev < users.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : users.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelect(users[selectedIndex]);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div style={{ width: '600px', margin: '20px auto', position: 'relative' }}>
      <h1 style={{ textAlign: "center" }}>Typehead</h1>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={countdown > 0}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      {users.length > 0 && (
        <ul
          style={{
            listStyle: 'none',
            width: '100%',
            padding: '10px',
            margin: '0',
            backgroundColor: 'white',
            zIndex: 1,
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        >
          {users.map((user, index) => (
            <li
              key={index}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: selectedIndex === index ? 'lightBlue' : 'white',
              }}
              onClick={() => handleSelect(user)}
            >
              {user}
            </li>
          ))}
        </ul>
      )}
      {countdown > 0 && (
        <div style={{ margin: "10px" }}>
          <h2>{countdown}</h2>
        </div>
      )}
    </div>
  );
};

export default App;
