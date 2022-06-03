import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SymbolArtCard from '../components/symbol-art-card';
import { apiViewPostFromId } from '../lib/endpoints';

export default function SinglePostPage(props) {
  const { id } = useParams();
  const apiPath = apiViewPostFromId(id);
  const [symbolArt, setSymbolArt] = useState();

  useEffect(() => {
    fetch(apiPath)
      .then(res => res.json())
      .then(([symbolArtRes]) => setSymbolArt(symbolArtRes));
  }, [id]);

  return <SymbolArtCard symbolArt={symbolArt} />;
}
