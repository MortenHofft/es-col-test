import React from 'react';

const Paper = ({children, padded}) => <div className="paper" style={{border: '1px solid #ddd', background: 'white', padding: padded ? '16px': null}}>{children}</div>;

export default Paper;