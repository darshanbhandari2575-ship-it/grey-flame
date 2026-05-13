export const luxuryEase = [0.16, 1, 0.3, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: luxuryEase },
  },
}

export const smoothReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: luxuryEase },
  },
}

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.04,
    },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, ease: luxuryEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.26, ease: luxuryEase },
  },
}

export const productCardReveal = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.96,
    rotateX: 6,
    transformPerspective: 1000,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transformPerspective: 1000,
    transition: {
      type: 'spring',
      stiffness: 96,
      damping: 15,
      mass: 0.75,
    },
  },
}

export const imageReveal = {
  hidden: { opacity: 0, scale: 1.035 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.95, ease: luxuryEase },
  },
}

export const buttonMotion = {
  whileHover: { scale: 1.025 },
  whileTap: { scale: 0.975 },
  transition: { type: 'spring', stiffness: 260, damping: 26, mass: 0.75 },
}

export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1000,
    boxShadow: '0 0 0 rgba(46,42,38,0)',
  },
  hover: {
    y: -6,
    scale: 1.02,
    rotateX: 2,
    rotateY: -2,
    transformPerspective: 1000,
    boxShadow: '0 18px 42px rgba(46,42,38,0.14)',
    transition: {
      type: 'spring',
      stiffness: 105,
      damping: 15,
      mass: 0.8,
    },
  },
}

export const depthStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.06,
    },
  },
}
