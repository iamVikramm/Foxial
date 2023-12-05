import React from 'react';

const InvalidUrl = () => {
  return (
    <div className="relative not-found-container bg-[#64B5F6]">
        <div>
            <div className="error-text text-white">
                <h1>404</h1>
                <p>Page Not Found</p>
            </div>
            <div className="animation-container">
                <div className="scene">
                  <div className="skater">
                    <div className="skateboard">
                      <div className="wheel"></div>
                      <div className="wheel"></div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <h3 className='absolute bottom-10'>Please check the url entered.</h3>
    </div>
  );
};

export default InvalidUrl;