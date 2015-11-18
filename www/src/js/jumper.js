export default class Jumper {
  constructor(defaults = {}) {
    this.duration = defaults.duration || 1000
    this.offset = defaults.offset || 0
    this.callback = defaults.callback || undefined

    this.easing = defaults.easing || function(t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
  }

  jump(target, overrides = {}) {
    this.jumpStart = window.pageYOffset

    this.jumpDuration = overrides.duration || this.duration
    this.jumpOffset = overrides.offset || this.offset
    this.jumpCallback = overrides.callback || this.callback
    this.jumpEasing = overrides.easing || this.easing

    this.jumpDistance = target.nodeType === 1
      ? this.jumpOffset + Math.round(target.getBoundingClientRect().top)
      : target

    requestAnimationFrame((time) => this._loop(time))
  }

  _loop(currentTime) {
    if(!this.timeStart) {
      this.timeStart = currentTime
    }

    this.timeElapsed = currentTime - this.timeStart
    this.jumpNext = this.jumpEasing(this.timeElapsed, this.jumpStart, this.jumpDistance, this.jumpDuration)

    window.scrollTo(0, this.jumpNext)

    this.timeElapsed < this.jumpDuration
      ? requestAnimationFrame((time) => this._loop(time))
      : this._end()
  }

  _end() {
    window.scrollTo(0, this.jumpStart + this.jumpDistance)

    typeof this.jumpCallback === 'function' && this.jumpCallback.call()
    this.timeStart = false
  }
}
