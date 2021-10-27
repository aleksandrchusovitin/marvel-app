import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const Page404 = () => {
  const styleParagraph = {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px',
  };

  const styleLink = {
    display: 'block',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '24px',
  };


  return (
    <div>
      <ErrorMessage />
      <p style={styleParagraph}>Page doesn't exist</p>
      <Link style={styleLink} to="/">Back to main page</Link>
    </div>
  );
};

export default Page404;