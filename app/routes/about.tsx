import { Link } from "react-router-dom";


export default function Admin() {
  return (
    <div>
      <h1>About page</h1>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </div>
    
  );
}
