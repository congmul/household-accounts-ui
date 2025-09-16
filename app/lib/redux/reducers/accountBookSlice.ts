import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountBookWithMember } from '@/app/lib/models';

interface AccountBookState {
    accountBooks: AccountBookWithMember[] | [] | null;
    defaultAccountBook: AccountBookWithMember | null;
}

const initialState: AccountBookState = {
    accountBooks: null,
    defaultAccountBook: null,
};

const accountBookSlice = createSlice({
  name: 'accountBook',
  initialState,
  reducers: {
    setAccountBooks: (state, action: PayloadAction<AccountBookWithMember[] | []>) => {
      state.accountBooks = action.payload
    },
    setDefaultAccountBook: (state, action: PayloadAction<AccountBookWithMember | null>) => {
      state.defaultAccountBook = action.payload
    }
  },
});

export const accountBookActions = accountBookSlice.actions;

export default accountBookSlice.reducer;
