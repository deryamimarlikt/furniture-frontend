import { Product } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (): Promise<Product[]> => {
  try {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("NEXT_PUBLIC_API_URL tanımlanmamış, boş array döndürülüyor");
      return [];
    }

    const res = await fetch(URL);

    if (!res.ok) {
      console.warn("Products API yanıt vermedi, boş array döndürülüyor");
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Products API hatası, boş array döndürülüyor:", error);
    return [];
  }
};

export default getProduct;
