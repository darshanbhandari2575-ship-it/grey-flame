import { memo } from 'react'

function Hero() {
  const heroImage = '/images/optimized/greyflame-hero-1440.webp'

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
          src={heroImage}
          srcSet="/images/optimized/greyflame-hero-768.webp 768w, /images/optimized/greyflame-hero-1080.webp 1080w, /images/optimized/greyflame-hero-1440.webp 1440w"
          sizes="(max-width: 900px) 62vw, 48vw"
          alt=""
          width="1672"
          height="941"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: "cover" }}
        />
      </div>
    </section>
  )
}

export default memo(Hero)
