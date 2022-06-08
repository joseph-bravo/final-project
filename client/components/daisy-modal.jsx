import React from 'react';

export default class DaisyModal extends React.Component {
  render() {
    const { label, children, isOpen, closeModal } = this.props;
    return (
      <>
        <div
          onClick={closeModal}
          className={`modal ${isOpen ? 'modal-open' : ''}`}>
          <div onClick={e => e.stopPropagation()} className="modal-box">
            <h3 className="pb-4 text-3xl font-bold">{label}</h3>
            <div className="">{children}</div>
          </div>
        </div>
      </>
    );
  }
}
