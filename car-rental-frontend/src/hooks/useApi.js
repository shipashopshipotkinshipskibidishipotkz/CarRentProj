import { useState, useEffect, useCallback } from 'react';

const useApi = (apiFunction, immediate = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { data, loading, error, execute, setData };
};

export default useApi;
