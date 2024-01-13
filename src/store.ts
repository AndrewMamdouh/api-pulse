import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PERSIST,
  PAUSE,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import selectedRequestReducer from './slices/selectedRequestSlice';
import collectionReducer from './slices/collectionSlice';
import flowReducer from './slices/flowSlice';
import selectedFlowReducer from './slices/selectedFlowSlice';
import recordReducer from './slices/latestRecordSlice';
import latestRequestDataReducer from './slices/latestRequestDataSlice';
import envReducer from './slices/envSlice';
import baseUrlReducer from './slices/baseUrlSlice';

const rootReducer = combineReducers({
  selectedRequest: selectedRequestReducer,
  collections: collectionReducer,
  flow: flowReducer,
  selectedFlow: selectedFlowReducer,
  latestRecord: recordReducer,
  latestRequestData: latestRequestDataReducer,
  env: persistReducer({ key: 'env', storage }, envReducer),
  baseUrl: persistReducer({ key: 'baseUrl', storage }, baseUrlReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  /**
   *
   */
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
