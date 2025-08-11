import axios from 'axios';

export async function fetchProductByBarcode(barcode) {
  if (!barcode) return null;
  const url = `https://world.openfoodfacts.org/api/v0/product/${encodeURIComponent(barcode)}.json`;
  const { data } = await axios.get(url);
  if (data && data.status === 1) {
    const p = data.product || {};
    return {
      name: p.product_name || p.generic_name || 'Unknown product',
      brand: p.brands || null,
      imageUrl: p.image_small_url || p.image_url || null,
      barcode,
    };
  }
  return null;
}

export async function fetchRecipesByIngredients(ingredientsArray) {
  const ingredients = (ingredientsArray || []).filter(Boolean).join(',');
  if (!ingredients) return [];
  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredients)}`;
  const { data } = await axios.get(url);
  return Array.isArray(data?.meals) ? data.meals : [];
}

export async function fetchRecipeDetailById(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(id)}`;
  const { data } = await axios.get(url);
  return data?.meals?.[0] || null;
}