import React from 'react'

const ButtonComponent = ({style,content,url,outerStyle}) => {
  return (
    <a href={url} style={outerStyle}>
      <button style={style}>{content}</button>
    </a> 
  )
}

export default ButtonComponent