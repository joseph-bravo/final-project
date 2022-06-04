import React from 'react';

export default function Tag(props) {
  const { tag } = props;
  return (
    <li className="badge badge-ghost overflow-x-clip ">
      <div>{tag}</div>
    </li>
  );
}
