export default function Footer({ onGo }) {
  return (
    <footer>
      <div className="lg">grey<span>·</span>flame</div>
      <p>a small studio of wax, resin and concrete · made in india</p>
      <div className="links">
        <a onClick={() => onGo('home')}>home</a>
        <a onClick={() => onGo('shop')}>shop</a>
        <a onClick={() => onGo('about')}>about</a>
        <a onClick={() => onGo('contact')}>contact</a>
      </div>
      <p style={{ fontSize: '11px', opacity: '.5' }}>© 2026 grey flame · handmade with ♡</p>
    </footer>
  )
}
