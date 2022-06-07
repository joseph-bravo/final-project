import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { apiDownloadPostFromId, pathPostFromId } from '../lib/endpoints';
import AppContext from '../lib/app-context';
import sounds from '../lib/sound-catalog.json';
import Tag from './tag';
import PlaceholderImage from './placeholder-image';

/**
 *
 * @param {Object} props
 * @param {Object} props.symbolArt - Symbol Art data from fetch request.
 * @returns
 */
export default function SymbolArtCard(props) {
  const { playSound } = React.useContext(AppContext);

  if (!props.symbolArt) {
    return;
  }

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

  const downloadLink = apiDownloadPostFromId(postId);
  const postLink = pathPostFromId(postId);

  return (
    <div className="grid-item rounded-box flex h-fit flex-col gap-4 bg-base-100 p-4">
      <div className="flex flex-col gap-4">
        <Link to={postLink} className="transition-all hover:translate-y-0.5">
          <LazyLoadImage
            className="rounded-box aspect-[2/1] w-full select-none shadow-sm"
            src={previewImagePath}
            placeholder={<PlaceholderImage />}
          />
        </Link>
        <div className="flex justify-between">
          <div className="flex items-center gap-2 break-all rounded-full bg-base-300 px-2 font-semibold">
            <span className="material-icons select-none text-xs">
              description
            </span>
            {filePropsName}
          </div>
          {
            // prettier-ignore
            filePropsSound > 1
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
      <div className="y-2 flex flex-col ">
        <div className="w-fit">
          <Link to={postLink}>
            <h3 className="link-hover m-0 break-words break-all text-lg font-bold">
              {title}
            </h3>
          </Link>
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
