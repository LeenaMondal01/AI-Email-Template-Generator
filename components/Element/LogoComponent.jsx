import React from 'react'

const LogoComponent = ({style,imageUrl,outerStyle}) => {
  return (
    <div style={outerStyle}>
        <img src={imageUrl} alt="logo" style={style} />
    </div>
  )
}

export default LogoComponent