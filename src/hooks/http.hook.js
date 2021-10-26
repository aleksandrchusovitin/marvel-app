import { useState, useCallback } from "react";

export const useHttp = () => {
  const [process, setProcess] = useState('waiting');
  const [error, setError] = useState(null);

  const request = useCallback(async (paramsRequest) => {
    const { 
      url,
      method = 'GET',
      body = null,
      headers = {
        'Content-Type': 'application/json',
      },
     } = paramsRequest;

     setProcess('loading');

     try {
       const response = await fetch(url, { method, body, headers });

       if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
    }

       const data = await response.json(); 
       setProcess('completed');

       return data;

     } catch (e) {
        setProcess('error');
        setError(e.message);
        throw e;
     }

  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { process, error, request, clearError };
}
