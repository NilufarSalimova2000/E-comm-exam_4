const url = "https://fakestoreapi.com/products/categories";
const url2 = "https://fakestoreapi.com/products/category";
const url3 = "https://fakestoreapi.com/products";

export const tabget = async () => {
    try {
        const res = await fetch(`${url}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return error.message;
    }
};

export const productget = async (item) => {
    try {
        const res = await fetch(`${url2}/${item}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return error.message;
    }
};


export const singleData = async (id) => {
    try {
        const res = await fetch(`${url3}/${id}`);
        const data = await res.json();
        return data;
    } catch (error) {
        return error.mesage;
    }
}