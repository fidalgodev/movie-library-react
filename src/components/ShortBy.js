import React from 'react';

const SortBy = ({ changeSort }) => {
  function handleChange(e) {
    changeSort(e.target.value);
  }

  return (
    <select onChange={handleChange}>
      <option value="popularity.desc">Popularity</option>
      <option value="vote_average.desc">Votes Average</option>
      <option value="original_title.asc">Title</option>
      <option value="release_date.desc">Release Date</option>
    </select>
  );
};

export default SortBy;
