import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import propTypes from 'prop-types';
import sounds from '../lib/sound-catalog.json';
import { urlDownloadFromId } from '../lib/endpoints';

function PlaceholderImage() {
  return (
    <div className="bg-300 rounded-box aspect-[2/1] w-full animate-pulse"></div>
  );
}

function Tag(props) {
  const { tag } = props;
  return (
    <li className="badge badge-ghost overflow-x-clip">
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

  const downloadLink = urlDownloadFromId(postId);

  return (
    <div className="grid-item rounded-box flex h-fit flex-col gap-4 bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <LazyLoadImage
          className="rounded-box aspect-[2/1] w-full"
          src={previewImagePath}
          placeholder={<PlaceholderImage />}
        />
        <div className="flex justify-between">
          <div className="badge badge-lg badge-ghost gap-2 overflow-x-clip font-semibold">
            <span className="material-icons text-xs">description</span>
            {filePropsName}
          </div>
          {
            // prettier-ignore
            filePropsSound !== 1
              ? (
            <button
              className="btn btn-outline btn-xs gap-2 rounded-full text-sm font-semibold"
              onClick={e => playSound(filePropsSound)}>
              <span className="material-icons text-xs">volume_up</span>
              {sounds[filePropsSound].name}
            </button>
                )
              : null
          }{' '}
        </div>
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
