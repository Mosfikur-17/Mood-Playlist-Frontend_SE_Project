export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  favoriteMood: string;
  favoriteGenre: string;
  bio?: string;
  joinedDate?: string;
}
