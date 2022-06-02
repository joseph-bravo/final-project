import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import propTypes from 'prop-types';

function PlaceholderImage() {
  return (
    <div className="bg-300 rounded-box aspect-[2/1] w-full animate-pulse"></div>
  );
}

export default function SymbolArtCard(props) {
  const {
    postId,
    title,
    description,
    previewImagePath,
    tags,
    username,
    filePropsSound
  } = props.symbolArt;

  const downloadLink = `/api/post/${postId}/download`;

  return (
    <div className="break-inside rounded-box grid grid-cols-2 gap-4 bg-base-100 p-4">
      <div>
        <LazyLoadImage
          className="rounded-box aspect-[2/1] w-full"
          src={previewImagePath}
          placeholder={<PlaceholderImage />}
        />
      </div>
      <div className="span">
        <div className="flex items-center justify-between">
          <h3 className="m-0 text-lg font-bold">{title}</h3>
          <a
            href={downloadLink}
            className="btn btn-secondary btn-sm w-1/4 px-2">
            <span className="material-icons">download</span>
          </a>
        </div>
        <h4 className="text-sm font-semibold">@{username}</h4>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}

SymbolArtCard.propTypes = {
  symbolArt: propTypes.shape({
    postId: propTypes.number,
    description: propTypes.string,
    title: propTypes.string,
    tags: propTypes.arrayOf(propTypes.string),
    username: propTypes.string,
    filePropsSound: propTypes.number,
    previewImagePath: propTypes.string
  }).isRequired
};
