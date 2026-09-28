"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, setFilters, setSearch } from "../store/usersSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchInput } from "@/components/forms";
import { Badge, Button, Select } from "@/components/ui";

export function UserFilters({ departments }: { departments: string[] }) {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.users.search);
  const filters = useAppSelector((state) => state.users.filters);
  const debouncedSearch = useDebounce(search, 350);
  const appliedSearchRef = useRef(debouncedSearch);

  useEffect(() => {
    if (appliedSearchRef.current === debouncedSearch) return;
    appliedSearchRef.current = debouncedSearch;
    void dispatch(fetchUsers({ search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, dispatch]);

  const hasActiveFilters = Boolean(filters.role || filters.status || filters.department || search);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
    void dispatch(fetchUsers({ filters: { ...filters, [key]: value }, page: 1 }));
  };

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput
        value={search}
        onChange={(value) => dispatch(setSearch(value))}
        placeholder="Fuzzy search name, email, ID or department…"
        className="w-full lg:max-w-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={filters.role}
          onChange={(event) => updateFilter("role", event.target.value)}
          aria-label="Filter by role"
          className="w-32"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </Select>

        <Select
          value={filters.status}
          onChange={(event) => updateFilter("status", event.target.value)}
          aria-label="Filter by status"
          className="w-36"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="suspended">Suspended</option>
        </Select>

        <Select
          value={filters.department}
          onChange={(event) => updateFilter("department", event.target.value)}
          aria-label="Filter by department"
          className="w-44"
        >
          <option value="">All departments</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </Select>

        {hasActiveFilters ? (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              dispatch(setSearch(""));
              dispatch(setFilters({ role: "", status: "", department: "" }));
              void dispatch(
                fetchUsers({ search: "", filters: { role: "", status: "", department: "" }, page: 1 }),
              );
            }}
          >
            Clear filters
          </Button>
        ) : (
          <Badge tone="neutral">server-side query</Badge>
        )}
      </div>
    </div>
  );
}
