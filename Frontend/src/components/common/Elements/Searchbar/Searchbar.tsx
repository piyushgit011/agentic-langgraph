import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  SearchWrapper,
  SearchBox,
  SearchInput,
  IconBoxSelect,
  SearchContainer,
  TopbarSearch
} from './SearchbarStyles';
import Button from '../Button/Button';

interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  variant?: 'table' | 'topbar' | 'minimal';
  className?: string;
  disabled?: boolean;
  onSearch?: () => void;
  [key: string]: any;
}

const Searchbar: React.FC<SearchbarProps> = ({
  value,
  onChange,
  placeholder = 'Search here...',
  variant = 'table', // 'table', 'topbar', 'minimal'
  className,
  disabled = false,
  onSearch,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  switch (variant) {
    case 'topbar':
      return (
        <SearchContainer className={className}>
          <TopbarSearch
            type="search"
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            $visible={true}
            {...props}
          />
          <Button
            buttonType="topbarSearch"
            onClick={handleSearch}
            disabled={disabled}
          >
            <SearchIcon />
          </Button>
        </SearchContainer>
      );

    case 'minimal':
      return (
        <SearchContainer className={className}>
          <SearchInput
            type="text"
            value={value}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            visible={true}
            {...props}
          />
          <Button
            buttonType="topbarSearch"
            onClick={handleSearch}
            disabled={disabled}
          >
            <SearchIcon />
          </Button>
        </SearchContainer>
      );

    case 'table':
    default:
      return (
        <SearchWrapper className={className}>
          <SearchBox className="table_search_box">
            <IconBoxSelect>
              <SearchIcon />
            </IconBoxSelect>
            <SearchInput
              type="text"
              value={value}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              {...props}
            />
          </SearchBox>
        </SearchWrapper>
      );
  }
};

export default Searchbar;
