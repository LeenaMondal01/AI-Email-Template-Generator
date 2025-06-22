import React from 'react'

const LogoHeaderComponent = ({style,imageUrl,outerStyle}) => {
  return (
    <div style={outerStyle}>
      <img src={imageUrl} alt="logo" style={style} />
    </div>
  )
}

export default LogoHeaderComponent