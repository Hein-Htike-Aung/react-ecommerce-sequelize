const isDuplicate = <T extends { id: number }>(targetObj: T | null, id: string) => {
  return targetObj && +targetObj.id !== +id;
};

export default isDuplicate;
