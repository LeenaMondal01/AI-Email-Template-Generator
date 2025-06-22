import React from 'react'

const SocialIconsComponent = ({ socialIcons = [], style, outerStyle }) => {
  return (
    <div style={outerStyle}>
      {socialIcons.map((icon, index) => (
        <a href={icon.url || '#'} key={index} target="_blank" rel="noopener noreferrer">
          <img
            src={icon.icon}
            alt={`social-icon-${index}`}
            style={{
              width: style?.width || 30,
              height: style?.height || 30,
              objectFit: 'contain',
              cursor: 'pointer'
            }}
          />
        </a>
      ))}
    </div>
  );
};

export default SocialIconsComponent;
