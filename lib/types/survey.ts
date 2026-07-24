export type CurrentMethod =
  | "word_of_mouth"
  | "agent"
  | "notice_board"
  | "social_media"
  | "other";

export type YesNo = "yes" | "no";
export type YesNoMaybe = "yes" | "no" | "maybe";
export type TrustLevel = "yes" | "somewhat" | "no";

export type PriorityItem =
  | "price"
  | "distance_to_gate"
  | "room_type"
  | "amenities"
  | "safety";

export type SurveyResponseInput = {
  currentMethod: CurrentMethod | null;
  currentMethodOther: string;
  biggestFrustration: string;
  priorityRanking: PriorityItem[];
  wasScammed: YesNo | null;
  wasScammedDetails: string;
  trustsVerifiedListings: TrustLevel | null;
  wantsRoommateSplit: YesNoMaybe | null;
  willingToPayDeposit: YesNoMaybe | null;
  wouldSwitch: YesNoMaybe | null;
  wouldSwitchReason: string;
};
