import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearAlert } from '../redux/alertSlice';
import '../assets/GlobalAlert.css'

const GlobalAlert = () => {

    const dispatch = useDispatch();
    const alert = useSelector(state => state.alert);

    useEffect(() => {
        if (alert.show) {
            const timer = setTimeout(() => {
                dispatch(clearAlert());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alert.show, dispatch]);

    if (!alert.show) return null;

    return (
        <div className='ff-libre-franklin global-alert'>
            <Alert className='text-center p-4' variant='danger'>
                {alert.message}
            </Alert>
        </div>
    );
};

export default GlobalAlert;