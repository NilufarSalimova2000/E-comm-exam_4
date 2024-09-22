import { tabget, productget, singleData } from "./service.js";

const tabList = document.querySelector(".tab_list");
const productsList = document.querySelector(".products_list");
const btn = document.getElementsByClassName("btn");
const SaveBlock = document.querySelector(".cart_block");
const Modall = document.querySelector(".modal");
const openModal = document.querySelector(".open_modal");
const closeModal = document.querySelector(".close_modal");


// tabni render qilish
const renderTab = async () => {
    const data = await tabget();
    tabList.innerHTML = data?.map((item) => (
        `<button class="btn font-normal text-[22px] text-[#262626]" data-item ="${item}">${item}</button>`
    )).join("");

    if (data && data.length > 0){
      renderProducts(data[0]);
      btn[0].style.color = "#33a0ff"; // Birinchisini rangi aktiv bo'lishi
      btn[0].style.borderBottom = "2px solid #33a0ff"; // Borderi
    }
}
renderTab();

// Ma'lumotlarni o'chirish
const deleteItem = (id) => {
    let savedData = JSON.parse(localStorage.getItem("num")) || [];
    savedData = savedData.filter(item => item.id != id); 
    localStorage.setItem("num", JSON.stringify(savedData));
    saveProducts();
};


// Localstoregdagi ma'lumotlarni render qilish
const saveProducts = () => {
    const savedData = JSON.parse(localStorage.getItem("num")) || [];
    SaveBlock.innerHTML = savedData?.map(item => 
    `<div class="flex items-center justify-between py-[54px] border-b border-b-[3px] border-b-[#f6f7f8]"><div class="flex items-center gap-[25px]">
    <button data-id="${item.id}" class="bg-[#FFF7F8] flex items-center justify-center w-[24px] h-[24px] py-[5px] rounded-[50%] btn_delete"><img src="./img/delete_icon.svg" alt="icon"></button>
    <div class="flex items-center justify-center w-[137px] rounded-[7px] h-[94px] bg-[#F6F6F6]"><img class="w-[100px] h-[80px]" src="${item.image}" alt=""></div>
    <h3 class="font-normal text-[18px] text-[#262626]">${item.title}</h3></div>
    <div class="flex items-center gap-[25px]"><p class="font-semibold text-[20px] text-[#262626] mr-[40px]">$${Math.round(Number((item.price)*0.76))}</p>
    </div></div>
    `
    ).join("");
};

// Localstorege
const save = (data) => {
  const oldData = JSON.parse(localStorage.getItem("num")) || [];
  
  // Bir marta mahsulot qo'shish uchun
  const single = oldData.some(item => item.id === data.id);
  
  if (!single) {
      localStorage.setItem("num", JSON.stringify([data, ...oldData]));
      saveProducts();
      CalculateCount();
      calculateTotalPrice();
  } else {
      alert("Bu mahsulot oldin qo'shilgan");
  }
};

// Mahsulotlarni render qilish
const renderProducts = async (item) => {
    const data = await productget(item);
    productsList.innerHTML = data?.map((item) => (
        `<li class="w-[320px] border border-[3px] border-[#f6f7f8] shadow-xl seller_product_item">
        <div class="seller__content_block"><img class="w-[300px] h-[273px]" src="${item.image}" alt="imag">
        <div class="seller__buttons">
                  <div class="seller__buttons_wrapper">
                    <button class="like_btn">
                    <span class="like"><svg width="53" height="52" viewBox="0 0 53 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.25">
                      <path opacity="0.25" d="M26.8862 50.423C40.6933 50.423 51.8862 39.4539 51.8862 25.923C51.8862 12.392 40.6933 1.42297 26.8862 1.42297C13.0791 1.42297 1.88623 12.392 1.88623 25.923C1.88623 39.4539 13.0791 50.423 26.8862 50.423Z" stroke="#33A0FF" stroke-width="2" />
                    </g>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M29.8221 19.961C30.466 19.9617 31.0959 20.1482 31.6363 20.4981C32.1768 20.8481 32.6046 21.3466 32.8686 21.9338C33.1326 22.5211 33.2215 23.172 33.1246 23.8085C33.0276 24.445 32.749 25.04 32.3221 25.522C31.7091 26.213 26.4822 31.106 26.4822 31.106C26.4822 31.106 21.2442 26.213 20.6312 25.511C20.09 24.9035 19.7922 24.1176 19.7952 23.304C19.8103 22.4273 20.1692 21.5915 20.7946 20.9769C21.42 20.3622 22.2618 20.0178 23.1387 20.0178C24.0155 20.0178 24.8573 20.3622 25.4827 20.9769C26.108 21.5915 26.467 22.4273 26.4822 23.304C26.4822 22.8649 26.5686 22.43 26.7367 22.0243C26.9047 21.6186 27.1511 21.25 27.4616 20.9395C27.7721 20.6289 28.1407 20.3826 28.5464 20.2145C28.9522 20.0465 29.387 19.96 29.8262 19.96L29.8221 19.961ZM29.8262 17.731C28.6199 17.7289 27.4458 18.1204 26.4822 18.846C25.3782 18.0266 24.0103 17.6442 22.6415 17.7723C21.2726 17.9004 19.9994 18.5299 19.0666 19.5399C18.1338 20.5498 17.6073 21.8689 17.5882 23.2436C17.5691 24.6183 18.0588 25.9515 18.9631 26.987C19.5891 27.705 23.7121 31.565 24.9631 32.731C25.376 33.1172 25.9203 33.332 26.4856 33.332C27.051 33.332 27.5952 33.1172 28.0081 32.731C29.2521 31.566 33.3581 27.716 33.9921 26.999C34.7034 26.1955 35.1677 25.2037 35.329 24.1427C35.4903 23.0817 35.3419 21.9968 34.9015 21.0181C34.4611 20.0395 33.7475 19.2088 32.8465 18.6259C31.9455 18.0429 30.8953 17.7326 29.8221 17.732L29.8262 17.731Z" />
                  </svg></span></button>
                    <button class="buy_btn" data-add="${item.id}">
                    <span class="buy"><svg width="52" height="52" viewBox="0 0 52 52" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.25">
                      <path opacity="0.25" d="M26.3862 50.423C39.9172 50.423 50.8862 39.4539 50.8862 25.923C50.8862 12.392 39.9172 1.42297 26.3862 1.42297C12.8553 1.42297 1.88623 12.392 1.88623 25.923C1.88623 39.4539 12.8553 50.423 26.3862 50.423Z" stroke="#33A0FF" stroke-width="2" />
                    </g>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M32.4402 28.878C32.9543 28.8773 33.4522 28.6982 33.849 28.3715C34.2458 28.0447 34.517 27.5904 34.6163 27.086L35.7313 21.513C35.7958 21.19 35.788 20.8567 35.7084 20.5371C35.6288 20.2175 35.4793 19.9195 35.2707 19.6646C35.0622 19.4097 34.7997 19.2041 34.5022 19.0627C34.2048 18.9214 33.8796 18.8477 33.5503 18.847H22.4502V17.732C22.45 17.4371 22.333 17.1544 22.1247 16.9456C21.9165 16.7368 21.6341 16.619 21.3393 16.618H19.1243C18.8345 16.6267 18.5594 16.7479 18.3575 16.9559C18.1556 17.164 18.0427 17.4425 18.0427 17.7325C18.0427 18.0224 18.1556 18.301 18.3575 18.509C18.5594 18.7171 18.8345 18.8383 19.1243 18.847H20.2392V29.992C19.798 29.99 19.366 30.1191 18.9982 30.3628C18.6303 30.6065 18.3431 30.9539 18.1728 31.361C18.0026 31.7681 17.957 32.2166 18.0419 32.6497C18.1267 33.0827 18.3382 33.4808 18.6496 33.7936C18.9609 34.1063 19.358 34.3196 19.7907 34.4064C20.2234 34.4932 20.672 34.4497 21.0799 34.2812C21.4878 34.1128 21.8365 33.8272 22.0819 33.4604C22.3273 33.0936 22.4582 32.6623 22.4582 32.221H30.2243C30.226 32.6597 30.3577 33.088 30.6027 33.4519C30.8478 33.8158 31.1951 34.0989 31.6009 34.2656C32.0067 34.4322 32.4528 34.4749 32.8828 34.3882C33.3129 34.3016 33.7076 34.0894 34.0172 33.7786C34.3267 33.4677 34.5373 33.0722 34.6222 32.6418C34.7072 32.2114 34.6627 31.7655 34.4944 31.3604C34.3261 30.9552 34.0416 30.609 33.6767 30.3655C33.3118 30.1219 32.883 29.992 32.4443 29.992H22.4573V28.878H32.4402ZM33.5553 21.078L32.4402 26.651H22.4532V21.078H33.5532H33.5553Z"/>
                  </svg></span></button>
                  </div>
                </div>
        </div>
        <div class="pt-[10px] pb-[18px] px-[12px] text-center"><h3 class="font-bold text-[18px] leading-[150%] tracking-[0.03em] text-[#223263] mb-[6px]">${item.title}</h3>
        <div class="flex items-center gap-[15px] justify-center">
        <p class="font-normal text-[18px] leading-[150%] tracking-[0.04em] text-[#9098b1] line-through">$ ${item.price}</p>
        <p class="font-bold text-[18px] leading-[150%] tracking-[0.04em] text-[#fb7181]">24%</p>
        <p class="font-bold text-[20px] leading-[180%] tracking-[0.03em] text-[#40bfff]">$${Math.round(Number((item.price)*0.76))}</p>
        <p class="font-bold text-[18px] leading-[150%] tracking-[0.03em] text-[#223263]">Rate: ${item.rating.rate}</p>
        </div>
        </div>
        </li>`
    )).join("");
    saveProducts();
};

// Button bosilganda qo'shish
productsList.addEventListener("click", async (e) => {
  const dataId = e.target.closest('button')?.dataset.add; 
  if (dataId) {
      const data = await singleData(dataId); 
      save(data);
  }
});

// Tab uchun
tabList.addEventListener("click", (e) => {
    if( e.target.dataset.item){
        renderProducts(e.target.dataset.item);
        for (let i of btn) {
          i.style.color = "";
          i.style.borderBottom = "";
      }
      e.target.style.color = "#33a0ff";
      e.target.style.borderBottom = "2px solid #33a0ff";
    }
})

// O'chirish
SaveBlock.addEventListener("click", (e) => {
  const deleteButton = e.target.closest('.btn_delete'); 
  if (deleteButton) {
    const id = deleteButton.dataset.id; 
    if (id) {
      deleteItem(id);
      CalculateCount();
      calculateTotalPrice();
    }
  }
});


// Countni hisoblash
const CalculateCount = () => {
  const savedData = JSON.parse(localStorage.getItem("num")) || []; 
  const Count = savedData.length; 

  const countProduct = document.querySelector(".product_count");
  if (countProduct) {
    countProduct.textContent = Count; 
  }
};

CalculateCount();

// Total priceni hisoblash
const calculateTotalPrice = () => {
  const savedData = JSON.parse(localStorage.getItem("num")) || [];
  const totalPrice = savedData.reduce((sum, item) => sum + Math.round(Number(item.price) * 0.76), 0);
  const totalPriceElement = document.querySelector(".total_price");
  if (totalPriceElement) {
      totalPriceElement.textContent = `$${totalPrice}`; 
  }
};
calculateTotalPrice();

//Modal
openModal.addEventListener("click", () => {
  Modall.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  Modall.classList.add("hidden");
})

// slider
  $(".slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          dots: false,
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });