'use client';

/**
 * Users Table State Hook
 * Business logic pentru search, pagination, filters
 */

import { useState, useMemo } from 'react';
import type { User } from '@entities/user';

interface UseUsersTableStateProps {
  data: User[];
}

export function useUsersTableState({ data }: UseUsersTableStateProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Filter data
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchQuery) return data;

    const query = searchQuery.toLowerCase();
    return data.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  return {
    searchQuery,
    currentPage,
    pageSize,
    filteredData,
    paginatedData,
    totalPages,
    handleSearch,
    setCurrentPage,
    handlePageSizeChange,
  };
}
