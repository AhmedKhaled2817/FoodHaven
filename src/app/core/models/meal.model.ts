export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  strTags?: string;
  [key: string]: any;
}

export interface MealResponse {
  meals: Meal[];
}

export interface Category {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface Area {
  strArea: string;
}

export interface AreaResponse {
  meals: Area[];
}

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription?: string;
  strType?: string;
}

export interface IngredientResponse {
  meals: Ingredient[];
}

export interface CartItem {
  meal: Meal;
  quantity: number;
  price: number;
}
