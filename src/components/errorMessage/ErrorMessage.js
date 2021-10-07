import img from './error.gif';

const ErrorMessage = () => (
  <img 
    src={img} 
    alt="error_img" 
    style={
      { 
        display: "block", 
        width: "250px", 
        height: "250px", 
        objectFit: "contain", 
        margin: "0 auto" 
      }
    } 
  />
);

export default ErrorMessage;