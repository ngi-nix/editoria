import React from 'react'
import config from 'config'
import { ButtonWithIcon } from './Button'

const DownloadEpub = ({ book, htmlToEpub, onError }) => {
  let converter
  if (config['pubsweet-client'] && config['pubsweet-client'].converter) {
    converter = config['pubsweet-client'].converter
  }

  const handleDownload = () => {
    htmlToEpub({
      variables: {
        bookId: book.id,
        destination: 'attachment',
        converter: !converter ? 'default' : `${converter}`,
        style: 'epub.css',
      },
    })
      .then(res => {
        const { data } = res
        const { exportBook } = data
        window.location.replace(exportBook)
      })
      .catch(error => {
        console.error('er', error)
        onError(error)
      })
  }

  const icon = (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Common/Icon/Download">
        <rect width="28" height="28" fill="white" />
        <g id="Common/Icon-background">
          <rect width="28" height="28" fill="white" />
        </g>
        <g id="Vector">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.54 10.3708C17.884 8.38416 16.0648 7 14 7C11.936 7 10.1168 8.38416 9.46 10.3708C7.5088 10.6466 6 12.3933 6 14.4999C6 15.5174 6.3552 16.4966 7.0008 17.2574C7.2928 17.6016 7.7984 17.6358 8.1296 17.3308C8.4608 17.0249 8.492 16.4991 8.2 16.1533C7.8128 15.6983 7.6 15.1099 7.6 14.4999C7.6 13.1216 8.6768 12 10 12H10.08C10.4608 12 10.7896 11.72 10.8648 11.3308C11.1632 9.78748 12.4824 8.66665 14 8.66665C15.5184 8.66665 16.8368 9.78748 17.136 11.3308C17.2112 11.72 17.5392 12 17.92 12H18C19.3232 12 20.4 13.1216 20.4 14.4999C20.4 15.1099 20.1872 15.6983 19.8008 16.1533C19.508 16.4991 19.54 17.0249 19.8704 17.3308C20.0232 17.4708 20.212 17.5391 20.4 17.5391C20.6216 17.5391 20.8416 17.4433 21 17.2574C21.6448 16.4966 22 15.5174 22 14.4999C22 12.3933 20.4912 10.6466 18.54 10.3708Z"
            fill="#828282"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M13.4348 21.7564C13.7428 22.0781 14.2412 22.0806 14.5564 21.7673L16.9564 19.3531C17.274 19.0331 17.2828 18.5065 16.9756 18.1748C16.6684 17.844 16.162 17.8331 15.8444 18.154L14.8004 19.204V14.5007C14.8004 14.0398 14.442 13.6673 14.0004 13.6673C13.5588 13.6673 13.2004 14.0398 13.2004 14.5007V19.1556L12.166 18.0781C12.01 17.9156 11.8052 17.834 11.6004 17.834C11.3956 17.834 11.1908 17.9156 11.0348 18.0781C10.722 18.404 10.722 18.9306 11.0348 19.2565L13.4348 21.7564Z"
            fill="#828282"
          />
        </g>
      </g>
    </svg>
  )

  return (
    <React.Fragment>
      <ButtonWithIcon
        icon={icon}
        label="Download Epub"
        onClick={handleDownload}
      />
    </React.Fragment>
  )
}

export default DownloadEpub
