import React from 'react';
import { IoMailUnreadOutline } from 'react-icons/io5';

function MessageMe() {
  const email = 'zalvendayao888@gmail.com';
  const mailto = `mailto:${email}`;
  return (
    <div className="fixed bottom-0 right-0 opacity-0 sm:opacity-100 m-10">
      <div className="tooltip tooltip-secondary" data-tip="Email Me">
        <button
          title="email-me"
          id="email-me"
          type="button"
          className="btn btn-primary rounded-full w-16 h-16 shadow-md hover:btn-secondary"
          onClick={() => {
            window.location.assign(mailto);
          }}
        >
          <IoMailUnreadOutline size={50} />
        </button>
      </div>
    </div>
  );
}

MessageMe.propTypes = {};

export default MessageMe;
