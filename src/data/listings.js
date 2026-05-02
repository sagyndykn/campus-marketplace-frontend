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

export const CATEGORY_VALUES = Object.keys(CATEGORY_LABELS);

export const CATEGORIES = CATEGORY_VALUES.map((value) => ({ value, label: CATEGORY_LABELS[value] }));
