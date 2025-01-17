import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/features/dashboardSlice';

export const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    setTimeout(() => {
      dispatch(setLoading({ isLoading: false, error: '' }));
    }, 1500);
  }, [dispatch]);

  return children;
}; 