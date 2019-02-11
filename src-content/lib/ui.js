import '../style.scss'

class UI {
  constructor () {
    this.template = `
    <div class="__stutter_text">
      <span class="__stutter_left"></span>
      <span class="__stutter_right"><span class="__stutter_center"></span><span class="__stutter_remainder"></span></span>
    </div>`
    this.holder = document.createElement('div')
    this.holder.classList.add('__stutter')
    this.holder.innerHTML = this.template
    this.left = this.holder.getElementsByClassName('__stutter_left')[0]
    this.center = this.holder.getElementsByClassName('__stutter_center')[0]
    this.remainder = this.holder.getElementsByClassName('__stutter_remainder')[0]
  }

  show (word) {
    this.left.textContent = word.val.substr(0, word.index)
    this.center.textContent = word.val.substr(word.index, 1)
    this.remainder.textContent = word.val.substr(word.index + 1)
  }

  hide () {
    if (this.holder.parentNode) {
      this.holder.parentNode.removeChild(this.holder)
    }
  }

  reveal () {
    if (!this.holder.parentNode) {
      document.body.insertBefore(this.holder, document.body.childNodes[0])
    }
  }
}

export let ui = new UI()
