export const CATEGORY_LABELS = {
  ELECTRONICS: 'Электроника',
  CLOTHING: 'Одежда',
  HOME_AND_GARDEN: 'Дом и сад',
  AUTO: 'Авто',
  SPORTS: 'Спорт',
  BOOKS: 'Книги',
  GAMES: 'Игры',
  OTHER: 'Другое',
};

export const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }));
