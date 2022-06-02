import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import propTypes from 'prop-types';

function PlaceholderImage() {
  return (
    <div className="bg-300 rounded-box aspect-[2/1] w-full animate-pulse"></div>
  );
}

function Tag(props) {
  const { tag } = props;
  return (
    <li className="badge badge-ghost">
      <button>{tag}</button>
    </li>
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
    filePropsSound,
    filePropsName
  } = props.symbolArt;

  const { playSound } = props;

  const downloadLink = `/api/post/${postId}/download`;

  return (
    <div className="grid-item rounded-box flex h-fit flex-col gap-4 bg-base-100 p-4">
      <div>
        <LazyLoadImage
          className="rounded-box aspect-[2/1] w-full"
          src={previewImagePath}
          placeholder={<PlaceholderImage />}
        />
        <button onClick={e => playSound(filePropsSound)}>audio</button>
      </div>
      <div>
        <div>
          <h3 className="m-0 break-words break-all text-lg font-bold ">
            {title}
          </h3>
        </div>
        <h4 className="text-sm font-semibold">@{username}</h4>
        <p className="text-sm">{description}</p>
      </div>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag, id) => {
          if (tag === '') return '';
          return <Tag key={id} tag={tag} />;
        })}
      </ul>
      <div>
        <a
          href={downloadLink}
          className="btn btn-secondary btn-sm btn-block px-2">
          <span className="material-icons">download</span>
        </a>
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
