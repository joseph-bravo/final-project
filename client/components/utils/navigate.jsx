import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navigate(props) {
  const navigate = useNavigate();
  const { to } = props;
  useEffect(() => {
    navigate(to);
  }, [to]);
  return <></>;
}
