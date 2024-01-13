import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Collection } from '../models';

export type CollectionState = Collection[];

const initialState: CollectionState = [];

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    /**
     *  Set Collection Reducer
     */
    setCollections: (state, action: PayloadAction<any[]>) => {
      return [...action.payload];
    },
  },
});

export const { setCollections } = collectionSlice.actions;

export default collectionSlice.reducer;
