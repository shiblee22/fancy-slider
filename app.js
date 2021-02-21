// Extra Features :
// 1.Added spinner while loading data
// 2.Added Select All button which will select all images of the page when clicked
// 3.Shown No of selected image in the top left corner of page
// 4.Shown error message when No matched item found
// 5.Shown image serial no top of slider

const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const search = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const spinner = document.getElementById('loading-spinner');
const errorDiv = document.getElementById('error');
const selectAll = document.getElementById('select-all');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if (images.length === 0) {
    showError();
  } else {
    imagesArea.style.display = 'block';
    // show gallery title
    galleryHeader.style.display = 'block';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img class="img-fluid img-thumbnail" id="single-image" onclick="selectItem(event,'${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })
  }
  toggleSpinner();
}

const getImages = (query) => {
  gallery.innerHTML = '';
  errorDiv.innerHTML = '';
  imagesArea.style.display = 'none';
  document.getElementById('image-no').innerText = 0;

  toggleSpinner();

  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(error => console.log(error))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // Selecting or Unselecting images 
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.add('added');
    sliders.push(img);
  } else {
    sliders.splice(item, 1)
    element.classList.remove('added');
  }
  document.getElementById('image-no').innerText = sliders.length;
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  
  // hide image aria
  imagesArea.style.display = 'none';

  // Handling negative duration 
  let duration = document.getElementById('duration').value || 1000;
  if (duration < 0) {
    duration = 1000;
    alert("Default time duration is set since you have given negative value.");
  }
  sliders.forEach(slide => {
    let i = sliders.indexOf(slide);
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<h5 class="text-center">Image No : ${i+1} </h5>
    <img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  getImages(search.value)
  sliders.length = 0;
})

sliderBtn.addEventListener('click', function () {
  createSlider()
})

search.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    getImages(search.value)
    sliders.length = 0;
  }
})

//Showing message if no images matched to the search for example when searched boogyman
function showError() {
  errorDiv.innerHTML = `
  <h1 class="text-center mt-3">Oops!</h1>
  <h3 class="text-center mt-3">We Did Not Found The Image You Are Looking For!</h3>
  `
}

//Show spinner while loading data
const toggleSpinner = () => {  
  spinner.classList.toggle('d-none'); 
}

//Event listener to select all button to select all image of the page
selectAll.addEventListener('click', () => {
  const allImages = document.querySelectorAll("#single-image");
  allImages.forEach((item) => {
    let i = sliders.indexOf(item.currentSrc);
    if (i === -1) {
      sliders.push(item.currentSrc);
      item.classList.add('added');
    }
  });
  document.getElementById('image-no').innerText = sliders.length;
});