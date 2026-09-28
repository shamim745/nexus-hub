import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserSummary } from "../types/user.types";
import { usersApi, type UsersFilterInput, type UsersResponse } from "../services/usersApi";
import { extractErrorMessage } from "@/lib/http/apiClient";

export interface UsersState {
  items: User[];
  summary: UserSummary | null;
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  search: string;
  sort: SortSpec;
  filters: UsersFilterInput;
  selectedIds: string[];
  status: AsyncStatus;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  summary: null,
  total: 0,
  page: 1,
  pageSize: 10,
  pageCount: 1,
  search: "",
  sort: { key: "name", direction: "asc" },
  filters: { role: "", status: "", department: "" },
  selectedIds: [],
  status: "idle",
  error: null,
};

export interface FetchUsersArgs {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SortSpec;
  filters?: UsersFilterInput;
}

export const fetchUsers = createAsyncThunk<
  UsersResponse,
  FetchUsersArgs | undefined,
  { state: { users: UsersState }; rejectValue: string }
>("users/fetch", async (args, { getState, rejectWithValue }) => {
  const state = getState().users;
  try {
    return await usersApi.list({
      page: args?.page ?? state.page,
      pageSize: args?.pageSize ?? state.pageSize,
      search: args?.search ?? state.search,
      sort: args?.sort ?? state.sort,
      filters: args?.filters ?? state.filters,
    });
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error, "Failed to load users."));
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setFilters(state, action: PayloadAction<Partial<UsersFilterInput>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    toggleSort(state, action: PayloadAction<string>) {
      const key = action.payload;
      if (state.sort.key === key) {
        state.sort.direction = state.sort.direction === "asc" ? "desc" : "asc";
      } else {
        state.sort = { key, direction: "asc" };
      }
      state.page = 1;
    },
    toggleSelect(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.selectedIds = state.selectedIds.includes(id)
        ? state.selectedIds.filter((entry) => entry !== id)
        : [...state.selectedIds, id];
    },
    toggleSelectPage(state) {
      const pageIds = state.items.map((item) => item.id);
      const allSelected = pageIds.length > 0 && pageIds.every((id) => state.selectedIds.includes(id));
      state.selectedIds = allSelected
        ? state.selectedIds.filter((id) => !pageIds.includes(id))
        : [...new Set([...state.selectedIds, ...pageIds])];
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    clearUsersError(state) {
      state.error = null;
    },
    resetUsers() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data.items;
        state.total = action.payload.data.total;
        state.page = action.payload.data.page;
        state.pageCount = action.payload.data.pageCount;
        state.summary = action.payload.meta.summary;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to load users.";
      });
  },
});

export const {
  setSearch,
  setFilters,
  setPage,
  setPageSize,
  toggleSort,
  toggleSelect,
  toggleSelectPage,
  clearSelection,
  clearUsersError,
  resetUsers,
} = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
