import React from 'react';
import Select from 'react-select';

const SortBy = ({ option, setOption }) => {
  function handleChange(selectedOption) {
    setOption(selectedOption);
  }

  return (
    <Select
      theme={theme => ({
        ...theme,
        borderRadius: 5,
        width: '50',
        colors: {
          ...theme.colors,
          primary25: 'var(--color-primary-lighter)',
          primary: 'var(--color-primary)',
        },
      })}
      value={option}
      onChange={handleChange}
      options={options}
      isSearchable={false}
    />
  );
};

const options = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Votes Average' },
  { value: 'original_title.asc', label: 'Title' },
  { value: 'release_date.desc', label: 'Release Date' },
];

export default SortBy;
