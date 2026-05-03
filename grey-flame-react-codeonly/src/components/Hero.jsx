export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eb"><span className="dot"></span><span className="micro">est. studio · made in india</span></div>
        <h1>hand-poured.<br /><em>softly lit.</em><br />slowly made.</h1>
        <div className="meta">
          <div className="tag">a small studio of resin, wax & concrete — shaped by hand, lit by hour.</div>
          <div className="st">
            <div><div className="n">60</div><div className="l">pieces</div></div>
            <div><div className="n">3</div><div className="l">collections</div></div>
            <div><div className="n">100%</div><div className="l">handmade</div></div>
          </div>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <img
          src="/images/greyflame-hero.png"
          srcSet="/images/greyflame-hero.png 768w, /images/greyflame-hero.png 1080w, /images/greyflame-hero.png 1440w"
          sizes="(max-width: 900px) 62vw, 48vw"
          alt=""
          fetchPriority="high"
        />
      </div>
    </section>
  )
}
