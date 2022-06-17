import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorDisplay from '../components/error-display';
import SinglePostSymbolArt from '../components/symbol-art-single-post';
import { apiViewPostFromId } from '../lib/endpoints';

export default function SinglePostPage(props) {
  const { id } = useParams();
  const apiPath = apiViewPostFromId(id);
  const [symbolArt, setSymbolArt] = useState();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    setErrorMessage(null);
    setLoading(true);
    fetch(apiPath)
      .then(res => {
        return Promise.all([res, res.json()]);
      })
      .then(tuple => {
        const [res, resBody] = tuple;
        if (!res.ok) {
          setErrorMessage({
            status: res.status,
            message: resBody.error ? resBody.error : res.statusText
          });
        } else {
          setSymbolArt(resBody);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [apiPath]);

  if (loading) return;
  if (!loading && errorMessage) return <ErrorDisplay {...errorMessage} />;

  return <SinglePostSymbolArt symbolArt={symbolArt} id={id} />;
}
