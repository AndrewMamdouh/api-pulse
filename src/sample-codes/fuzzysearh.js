import React, { useState } from 'react';
import Fuse from 'fuse.js';

/**
 *
 */
const FuzzySearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const data = [
    'apple',
    'banana',
    'cherry',
    'date',
    'elderberry',
    'fig',
    'grape',
    'honeydew',
  ];

  const options = {
    includeScore: true,
    threshold: 0.4,
    keys: [''],
  };

  const fuse = new Fuse(data, options);

  /**
   *
   */
  const handleSearch = (e) => {
    const { value } = e.target;
    setQuery(value);

    if (value.trim()) {
      const searchResults = fuse.search(value);
      setResults(searchResults.map((res) => res.item));
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default FuzzySearchComponent;
