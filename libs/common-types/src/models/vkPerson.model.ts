export interface VkPerson {
  id: number;
  screenName?: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  photoUrl?: string;
  relation?: MaritalStatus;
}

export enum MaritalStatus {
  Any = 0,
  NotMarried = 1,
  Dating = 2,
  Engaged = 3,
  Married = 4,
  AllIsDifficult = 5,
  ActivelyLooking = 6,
  InLove = 7,
  InCivilMarriage = 8,
}
