import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SinglePostSymbolArt from '../components/symbol-art-single-post';
import { apiViewPostFromId } from '../lib/endpoints';

export default function SinglePostPage(props) {
  const { id } = useParams();
  const apiPath = apiViewPostFromId(id);
  const [symbolArt, setSymbolArt] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(apiPath)
      .then(res => res.json())
      .then(res => {
        if (Object.keys(res)[0] === 'error') {
          setSymbolArt(null);
        } else {
          const [symbolArtRes] = res;
          setSymbolArt(symbolArtRes);
        }
        setLoading(false);
      });
  }, [id]);

  return (
    <SinglePostSymbolArt loading={loading} symbolArt={symbolArt} id={id} />
  );
}
