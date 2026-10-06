import "./navbar.css"

export default function NavBar() {
  return (
    <nav className="nav">
      <a href="#top" className="wordmark">
        Magic Mirror
      </a>

      <ul className="nav-links">
        <li>
          <a href="#services">Services</a>
        </li>
        <li>
          <a href="#book">Book</a>
        </li>
        <li>
          <a href="#course">Course</a>
        </li>
        <li>
          <a href="#visit">Visit</a>
        </li>
      </ul>
    </nav>
  )
}
