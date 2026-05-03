export default function Nav({ onGo, count, onOpenCart }) {
  return (
    <nav>
      <div className="lg" onClick={() => onGo('home')}>grey<span>·</span>flame</div>
      <ul>
        <li><a onClick={() => onGo('home')}>home</a></li>
        <li><a onClick={() => onGo('shop')}>shop</a></li>
        <li><a onClick={() => onGo('about')}>about</a></li>
        <li><a onClick={() => onGo('contact')}>contact</a></li>
      </ul>
      <div className="ic">
        <div className="bag" onClick={onOpenCart}>bag (<span>{count}</span>)</div>
      </div>
    </nav>
  )
}
