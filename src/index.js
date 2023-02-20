var iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="24px" width="24px">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
<path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
</svg>
`;

var errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="40px" width="40px">
<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
</svg>
`;

let jsonData;

var itemPage = document.getElementById("item");
var itemsList = document.getElementById("items");
var mainCarousel = document.getElementById("carousel");

const openVideoTab = (item) => {
  itemsList.style.display = "none";

  let itemTitle = document.createElement("h1");
  itemTitle.textContent = item.name;
  itemPage.style.display = "block";
  itemPage.appendChild(itemTitle);

  let video = document.createElement("video");
  video.src = item.mediaFile;
  video.controls = true;
  video.muted = false;
  video.addEventListener(
    "error",
    function () {
      alert("Video type not supported");
    },
    true
  );
  itemPage.appendChild(video);
};

const closeVideoTab = () => {
  itemPage.style.display = "none";
  itemPage.innerHTML = "";
  itemsList.style.display = "block";
};

async function streamsData() {
  const response = await fetch(
    "https://cdn-media.brightline.tv/training/demo.json",
    {
      method: "GET",
    }
  );
  jsonData = await response.json();

  jsonData == undefined ? alert("API error") : displayData(jsonData);
}

const displayData = (data) => {
  data.streams.forEach((item) => {
    if (item.name && item.mediaFile) {
      let itemHtml = document.createElement("div");
      itemHtml.className = "item-card";
      let thumbnailHtml = ``;

      let checkVideo = document.createElement("video");
      checkVideo.src = item.mediaFile;

      checkVideo.oncanplay = () => {
        thumbnailHtml = `<video src=${item.mediaFile}></video>`;

        itemHtml.innerHTML = `${thumbnailHtml} <div class="item-footer"><div>${iconSvg}</div><div class="item-title">${item.name}</div></div>`;
        itemHtml.addEventListener(
          "click",
          function () {
            openVideoTab(item);
          },
          false
        );
      };

      thumbnailHtml = `<div class="error-icon">${errorSvg}</div>`;
      itemHtml.innerHTML = `${thumbnailHtml} <div class="item-footer"><div>${iconSvg}</div><div class="item-title">${item.name}</div></div>`;
      itemHtml.addEventListener(
        "click",
        function () {
          openVideoTab(item);
        },
        false
      );

      mainCarousel.appendChild(itemHtml);
    }
  });
};

var currentItem = 0;

const navigateItems = () => {
  var selectedItem = document.getElementsByClassName("item-card")[currentItem];
  selectedItem.focus();
  selectedItem.scrollIntoView();
  selectedItem.classList.add("item-card-focused");
  if (currentItem > 0)
    selectedItem.previousElementSibling.classList.remove("item-card-focused");
  if (currentItem < jsonData.streams.length - 1) {
    selectedItem.nextElementSibling.classList.remove("item-card-focused");
  }
};

document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    if (currentItem == 0) return false;
    currentItem--;
    navigateItems();
    return false;
  }

  if (event.keyCode == 39) {
    if (currentItem == jsonData.streams.length - 1) return false;
    currentItem++;
    navigateItems();
    return false;
  }

  if (event.keyCode == 13) {
    openVideoTab(jsonData.streams[currentItem]);
    return false;
  }

  if (event.keyCode == 8) {
    closeVideoTab();
    return false;
  }
});

async function app() {
  await streamsData();
  openVideoTab(jsonData.streams[0]);
  navigateItems();
}

app();
