export const getLevel = (score: number, t: Function) => {
  if (score < 5) return t("game.levelBeginner");
  if (score < 10) return t("game.levelIntermediate");
  if (score < 20) return t("game.levelAdvanced");
  return t("game.levelExpert");
};

export const getBadge = (score: number, t: Function) => {
  if (score >= 20) return t("game.badgeMaster");
  if (score >= 10) return t("game.badgePro");
  if (score >= 5) return t("game.badgeNovice");
  return t("game.badgeNoob");
};
