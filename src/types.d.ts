interface Recipe {
  id: string
  created_at: string // timestampz from supabase
  name: string
  duration: number
  calories: number
  difficulty: string
  image_url: string
  ingredients: Ingredient[] // jsonb from supabase
  created_by?: string
  created_by_name?: string
}

interface Ingredient {
  name: string
  amount: string
}
