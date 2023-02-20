export interface Verdict {
  id: number;
  ratingListId: number;
  vkPersonId: number;
  rating: Rating;
  comment?: string;
}

export enum Rating {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
  NOT_SURE = 'NOT_SURE',
}
