import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import tutorReducer from './slices/tutorSlice';
import notificationReducer from './slices/notificationSlice';
import themeReducer from './slices/themeSlice';
import bookmarkReducer from './slices/bookmarkSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classReducer,
    tutors: tutorReducer,
    notifications: notificationReducer,
    theme: themeReducer,
    bookmarks: bookmarkReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
