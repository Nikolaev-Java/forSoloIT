const galleryClassName = 'gallery';
const galleryLineClassName = 'gallery-line';
const galleryItemClassName = 'gallery-item';
const galleryButtonsContainerClassName = 'gallery__buttons';
const galleryButtonClassName = 'gallery-btn__dot';
const galleryArrowNextClassName = 'gallery-arrow__next';
const galleryArrowPrevClassName = 'gallery-arrow__prev';
const transformRegExp = /[-0-9.]+(?=px)/;
class Gallery {
  constructor(element, options = {}) {
    this.containerNode = element;
    this.size = element.childElementCount;
    this.setting = {
      name: options.name || 'unknow',
      dots: options.dots || false,
      arrow: options.arrow || false,
      gap: options.gap || 0,
    }
    this.currentSlide = 0;
    this.shiftThreshold = 250;
    this.swipeDuration = 10;
    this.sliderSpacing = this.setting.gap;
    this.positionX2 = 0;
    this.positonInit = 0;
    this.positionFinal = 0;
    this.indexSlide = 0;
    this.timeStartTouch = 0;
    this.positionX1 = 0;
    this.createHTML = this.createHTML.bind(this);
    this.setEvents = this.setEvents.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.switchSlideCards = this.switchSlideCards.bind(this);
    this.selectDirectionSwipe = this.selectDirectionSwipe.bind(this);
    this.hadleClickButton = this.hadleClickButton.bind(this);
    this.thisDotsCards = this.thisDotsCards.bind(this);
    this.setSetting = this.setSetting.bind(this);
    this.hadleClickArrowNext = this.hadleClickArrowNext.bind(this);
    this.hadleClickArrowPrev = this.hadleClickArrowPrev.bind(this);
    this.changeDisabled = this.changeDisabled.bind(this);
    this.createHTML();
    this.setSetting();
    this.slideWidth = this.sliderItem[0].offsetWidth + this.sliderSpacing;
    this.viewCount = Math.round(this.sliderLine.offsetWidth / this.slideWidth);
    this.setting.arrow && this.changeDisabled();
    this.setEvents();
  }
  createHTML() {
    this.containerNode.classList.add(galleryClassName, createModifierClassName(galleryClassName, this.setting.name));
    this.containerNode.innerHTML = `
      <div class="${galleryLineClassName} ${createModifierClassName(galleryLineClassName, this.setting.name)}">
      ${this.containerNode.innerHTML}
      </div>
    `;
    this.sliderLine = document.querySelector(`.${createModifierClassName(galleryLineClassName, this.setting.name)}`);
    this.sliderItem = Array.from(this.sliderLine.children).map((child) =>
      wrapElementByDiv(child, galleryItemClassName, this.setting.name));
    if (this.setting.dots) {
      this.galleryButtonsContainer = document.createElement('div');
      this.galleryButtonsContainer.classList.add(galleryButtonsContainerClassName,
        createModifierClassName(galleryButtonsContainerClassName, this.setting.name));
      this.galleryButtonsContainer.insertAdjacentHTML('afterbegin', createButtons(galleryButtonClassName, this.setting.name, this.size));
      this.containerNode.after(this.galleryButtonsContainer);
      this.galleryButtons = document.querySelectorAll(`.${createModifierClassName(galleryButtonClassName
        , this.setting.name)}`);
      this.galleryButtons[0].classList.add('active');
    }
    if (this.setting.arrow) {
      this.arrowNext = document.createElement('div');
      this.arrowPrev = document.createElement('div');
      this.arrowNext.classList.add(galleryArrowNextClassName,
        createModifierClassName(galleryArrowNextClassName, this.setting.name));
      this.arrowPrev.classList.add(galleryArrowPrevClassName,
        createModifierClassName(galleryArrowPrevClassName, this.setting.name));
      this.containerNode.before(this.arrowNext);
      this.containerNode.after(this.arrowPrev);
    }
  }
  setSetting() {
    this.sliderLine.style.gap = this.setting.gap + 'px';
  }
  setEvents() {
    this.sliderLine.addEventListener('touchstart', this.handleTouchStart, false);
    this.sliderLine.addEventListener('touchmove', this.handleTouchMove, false);
    this.sliderLine.addEventListener('touchend', this.handleTouchEnd, false);
    this.setting.dots && this.galleryButtonsContainer.addEventListener('click', this.hadleClickButton);
    this.setting.arrow && this.arrowNext.addEventListener('click', this.hadleClickArrowNext);
    this.setting.arrow && this.arrowPrev.addEventListener('click', this.hadleClickArrowPrev);
  }
  handleTouchStart(event) {
    this.positionX1 = this.positonInit = event.touches[0].clientX;
    if (event.target.closest('.slider-image__wrapper')) {
      event.stopPropagation();
    }
  }
  handleTouchMove(event) {
    if (event.target.closest('.slider-image__wrapper')) {
      event.stopPropagation();
    }
    this.timeStartTouch = event.timeStamp;
    this.positionX2 = this.positionX1 - event.touches[0].clientX;
    this.positionX1 = event.touches[0].clientX;
    this.style = this.sliderLine.style.transform;
    this.sliderLine.style.transition = "0s";
    this.transform = +this.style.match(transformRegExp);
    this.sliderLine.style.transform = `translate3d(${this.transform - this.positionX2}px, 0px,0px)`;
  }
  handleTouchEnd(event) {
    this.positionFinal = this.positonInit - this.positionX1;
    if (event.target.closest('.slider-image__wrapper')) {
      event.stopPropagation();
    }
    if ((event.timeStamp - this.timeStartTouch) > this.swipeDuration) {
      if (Math.abs(this.positionFinal) > this.shiftThreshold) {
        this.selectDirectionSwipe();
      }
    } else {
      this.selectDirectionSwipe();
    }
    if (this.positonInit !== this.positionX1) {
      this.switchSlideCards()
    }
  }
  hadleClickButton(e) {
    const btn = e.target.closest(`.${createModifierClassName(galleryButtonClassName
      , this.setting.name)}`);
    if (btn) {
      this.indexSlide = btn.dataset.slideid;
      this.switchSlideCards();
    }
  }
  hadleClickArrowNext() {
    if (this.indexSlide < this.size - this.viewCount) { this.indexSlide++; }
    this.switchSlideCards();
  }
  hadleClickArrowPrev() {
    if (this.indexSlide > 0) { this.indexSlide--; }
    this.switchSlideCards();
  }
  thisDotsCards(id) {
    this.galleryButtons.forEach(element => element.classList.remove('active'));
    this.galleryButtons[id].classList.add('active');
  }
  switchSlideCards() {
    this.sliderLine.style.transition = 'all 0.9s cubic-bezier(0.65, 0.05, 0.36, 1) 0s';
    this.sliderLine.style.transform = 'translate(' + (this.indexSlide * -this.slideWidth) + 'px, 0px)';
    this.setting.dots && this.thisDotsCards(this.indexSlide);
    this.setting.arrow && this.changeDisabled();
  }
  selectDirectionSwipe() {
    if (this.positonInit > [this.positionX1] && this.indexSlide < this.size - this.viewCount) {
      this.indexSlide++;
    } else if (this.positonInit < [this.positionX1] && this.indexSlide > 0) {
      this.indexSlide--;
    }
  }
  changeDisabled() {
    if (this.indexSlide === this.size - this.viewCount) {
      this.arrowNext.classList.add('disabled');
    } else {
      this.arrowNext.classList.remove('disabled');
    }
    if (this.indexSlide === 0) {
      this.arrowPrev.classList.add('disabled');
    } else {
      this.arrowPrev.classList.remove('disabled');
    }
  }
}



/* HElpers */
function wrapElementByDiv(element, className, suf) {
  const wraperNode = document.createElement('div');
  wraperNode.classList.add(className, createModifierClassName(className, suf));
  element.before(wraperNode);
  wraperNode.prepend(element);
  return wraperNode;
}
function createModifierClassName(className, modifier) {
  return className + '-' + modifier;
}
function createButtons(className, modifier, size) {
  let stringHTML = '';
  for (let index = 0; index < size; index++) {
    stringHTML += `<div class="${className} ${createModifierClassName(className, modifier)}" data-slideId="${index}"><span></span></div>`
  }
  return stringHTML;
}