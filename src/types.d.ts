interface Recipe {
  id: string
  name: string
  duration: number
  difficulty: string
  calories: number
  image_url: string
  created_by?: string
  created_by_name?: string
}
