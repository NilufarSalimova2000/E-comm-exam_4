import { tabget, productget, singleData } from "./service.js";

const tabList = document.querySelector(".tab_list");
const productsList = document.querySelector(".products_list");
const btn = document.getElementsByClassName("btn");
const SaveBlock = document.querySelector(".cart_block");

const renderTab = async () => {
    const data = await tabget();
    tabList.innerHTML = data?.map((item) => (
        `<button class="btn font-normal text-[22px] text-[#262626]" data-item ="${item}">${item}</button>`
    )).join("");

    

    if (data && data.length > 0){
      renderProducts(data[0]);
      btn[0].style.color = "#33a0ff"; // Birinchi tabni faol rangda qilish
      btn[0].style.borderBottom = "2px solid #33a0ff";
    }
}
renderTab();

// Ma'lumotlarni o'chirish
const deleteItem = (id) => {
    let savedData = JSON.parse(localStorage.getItem("num")) || [];
    savedData = savedData.filter(item => item.id != id); // LocalStorage'dan elementni o'chirish
    localStorage.setItem("num", JSON.stringify(savedData)); // Yangi ma'lumotlarni saqlash
    saveProducts();
     // Ekranni yangilash
};


// Saqlangan ma'lumotlarni render qilish
const saveProducts = () => {
    const savedData = JSON.parse(localStorage.getItem("num")) || [];
    SaveBlock.innerHTML = savedData?.map(item => 
    `<div class="flex items-center justify-between py-[54px] border-b border-b-[3px] border-b-[#f6f7f8]"><div class="flex items-center gap-[25px]">
    <button data-id="${item.id}" class="bg-[#FFF7F8] flex items-center justify-center w-[24px] h-[24px] py-[5px] rounded-[50%] btn_delete"><img src="./img/delete_icon.svg" alt="icon"></button>
    <div class="flex items-center justify-center w-[137px] rounded-[7px] h-[94px] bg-[#F6F6F6]"><img class="w-[100px] h-[80px]" src="${item.image}" alt=""></div>
    <h3 class="font-normal text-[18px] text-[#262626]">${item.title}</h3></div>
    <div class="flex items-center gap-[25px]"><p class="font-normal text-[18px] text-[#262626]">$${Math.round(Number((item.price)*0.76))}</p>
    </div></div>
    `
    ).join("");
};

// Saqlash funksiyasi
const save = (data) => {
  const oldData = JSON.parse(localStorage.getItem("num")) || [];
  
  // Saqlangan mahsulotlar orasida borligini tekshirish
  const isAlreadySaved = oldData.some(item => item.id === data.id);
  
  if (!isAlreadySaved) {
      localStorage.setItem("num", JSON.stringify([data, ...oldData]));
      saveProducts(); // Saqlangan mahsulotlarni yangilash
      updateItemCount();
      calculateTotalPrice();
  } else {
      alert("Bu mahsulot allaqachon saqlangan!"); // Mahsulot allaqachon saqlangan bo'lsa xabar beriladi
  }
};

const renderProducts = async (item) => {
    const data = await productget(item);
    productsList.innerHTML = data?.map((item) => (
        `<li class="w-[320px] border border-[3px] border-[#f6f7f8] shadow-xl seller_product_item">
        <div class="seller__content_block"><img class="w-[300px] h-[273px]" src="${item.image}" alt="imag">
        <div class="seller__buttons">
                  <div class="seller__buttons_wrapper">
                    <button class="like_btn">
                    <img src="./img/like_icon.svg" alt="icon"></button>
                    <button class="buy_btn" data-add="${item.id}">
                    <img src="./img/buy_icon.svg" alt="icon"></button>
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

// Element qo'shish funksiyasi
productsList.addEventListener("click", async (e) => {
  const dataId = e.target.closest('button')?.dataset.add; // Mahsulot ID sini olish
  if (dataId) {
      const data = await singleData(dataId); // Mahsulot ID bilan ma'lumot olish
      save(data);
      
  }
});

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

// Delete tugmasi bosilganda o'chirish
SaveBlock.addEventListener("click", (e) => {
  const deleteButton = e.target.closest('.btn_delete'); // Tugmani yoki tugma ichidagi elementni topamiz
  if (deleteButton) {
    const id = deleteButton.dataset.id; // `data-id` qiymatini olamiz
    if (id) {
      deleteItem(id); // Mahsulotni o'chirish funksiyasini chaqirish
      updateItemCount();
      calculateTotalPrice();
    }
  }
});

const updateItemCount = () => {
  const savedData = JSON.parse(localStorage.getItem("num")) || []; // Saqlangan ma'lumotlarni olish
  const itemCount = savedData.length; // Mahsulotlar sonini hisoblash

  // product_count elementini yangilash
  const countElement = document.querySelector(".product_count");
  if (countElement) {
    countElement.textContent = itemCount; // Mahsulotlar sonini interfeysda ko'rsatish
  }
};

// Saqlangan mahsulotlar sonini dastur yuklanganda yangilash
updateItemCount();


const calculateTotalPrice = () => {
  const savedData = JSON.parse(localStorage.getItem("num")) || [];
  const totalPrice = savedData.reduce((sum, item) => sum + Math.round(Number(item.price) * 0.76), 0);
  const totalPriceElement = document.querySelector(".total_price");
  if (totalPriceElement) {
      totalPriceElement.textContent = `$${totalPrice}`; // Umumiy summani interfeysga chiqarish
  }
};
calculateTotalPrice();





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