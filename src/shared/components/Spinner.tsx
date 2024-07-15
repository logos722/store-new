import React from 'react'

interface ISpinner {
  isLoading: boolean
}

const Spinner: React.FC<ISpinner> = ({isLoading}) => {

  if (isLoading) {
    return (
      
      <div>
        {/* <span class="loader"></span> */}
      </div>
    )
  } else {
    return 
  }
}

export default Spinner


// .loader {
//   width: 48px;
//   height: 48px;
//   border: 5px solid #FFF;
//   border-bottom-color: #FF3D00;
//   border-radius: 50%;
//   display: inline-block;
//   box-sizing: border-box;
//   animation: rotation 1s linear infinite;
//   }

//   @keyframes rotation {
//   0% {
//       transform: rotate(0deg);
//   }
//   100% {
//       transform: rotate(360deg);
//   }
//   } 