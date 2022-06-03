import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SinglePostSymbolArt from '../components/symbol-art-single-post';
import { apiViewPostFromId } from '../lib/endpoints';

export default function SinglePostPage(props) {
  const { id } = useParams();
  const apiPath = apiViewPostFromId(id);
  const [symbolArt, setSymbolArt] = useState();

  useEffect(() => {
    fetch(apiPath)
      .then(res => res.json())
      .then(res => {
        if (Object.keys(res)[0] === 'error') {
          setSymbolArt(null);
        } else {
          const [symbolArtRes] = res;
          setSymbolArt(symbolArtRes);
        }
      });
  }, [id]);

  return <SinglePostSymbolArt symbolArt={symbolArt} id={id} />;
}
