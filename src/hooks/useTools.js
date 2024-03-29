import { useEffect, useState } from 'react';

const useTools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('https://tools-express-manufacturer-server.vercel.app/tools')
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setTools(data);
      });
  }, []);
  return [tools, loading];
};
export default useTools;
